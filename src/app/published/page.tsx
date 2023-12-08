import Link from "next/link";
import { DateTime } from "luxon";

import { sql } from "../lib/server/db";
import Search from "../ui/search";

async function getNotes(query?: string) {
  let sqlStr = "select * from notes where is_published = true";
  let values = [];

  if (query !== undefined) {
    sqlStr += " and title ilike $1";
    values.push(`%${query}%`);
  }

  const notesRes = await sql(sqlStr, values);

  return notesRes.rows;
}

export default async function Page({
  searchParams,
}: {
  searchParams?: { query?: string };
}) {
  const query = searchParams?.query;
  const notes = await getNotes(query);

  return (
    <article className="container mx-auto px-4 py-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-green-700">
        Published Notes:
      </h2>

      <Search />

      <table className="w-full">
        <caption className="sr-only">Published Notes</caption>
        <thead className="border-b border-gray-500">
          <tr className="text-left text-sm text-gray-600 font-bold py-2">
            <th>Title</th>
            <th>Created</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-400 divide-solid text-md">
          {notes.map((note) => (
            <tr key={note.id}>
              <td>
                <Link
                  className="block hover:outline hover:outline-2 hover:outline-green-700 hover:cursor-pointer p-2 bg-gray-100/10 rounded-md "
                  href={`/published/${note.id}`}
                >
                  {note.title}
                </Link>
              </td>
              <td className="py-2">
                {note.created_at.toLocaleString(DateTime.DATETIME_SHORT)}
              </td>
              <td className="py-2">
                {note.updated_at.toLocaleString(DateTime.DATETIME_SHORT)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
