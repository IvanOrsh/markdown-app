import Link from "next/link";
import { DateTime } from "luxon";

import { sql } from "../lib/server/db";
import Search from "../ui/search";
import SortSelectServer from "../ui/sort-select-server";

async function getNotes(query?: string, sort?: string) {
  let sqlStr = "select * from notes where is_published = true";
  let values = [];

  if (query !== undefined) {
    sqlStr += " and title ilike $1";
    values.push(`%${query}%`);
  }

  if (sort !== undefined) {
    switch (sort) {
      case "title":
        sqlStr += " order by title asc";
        break;
      case "-title":
        sqlStr += " order by title desc";
        break;
      case "created":
        sqlStr += " order by created_at asc";
        break;
      case "-created":
        sqlStr += " order by created_at desc";
        break;
      case "updated":
        sqlStr += " order by updated_at asc";
        break;
      case "-updated":
        sqlStr += " order by updated_at desc";
        break;
      default:
        sqlStr += " order by created_at desc";
        break;
    }
  } else {
    sqlStr += " order by title asc";
  }

  const notesRes = await sql(sqlStr, values);

  return notesRes.rows;
}

export default async function Page({
  searchParams,
}: {
  searchParams?: { query?: string; sort?: string };
}) {
  const query = searchParams?.query;
  const sort = searchParams?.sort;
  const notes = await getNotes(query, sort);

  return (
    <article className="container mx-auto px-4 py-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-green-700">
        Published Notes:
      </h2>

      <div className="flex flex-col md:flex-row items-start gap-2">
        <Search />
        <SortSelectServer />
      </div>

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
