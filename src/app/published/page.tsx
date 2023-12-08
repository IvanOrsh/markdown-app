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

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {notes.map((note) => (
          <li
            key={note.id}
            className="hover:outline hover:outline-2 hover:outline-green-700 hover:cursor-pointer p-2 bg-white rounded-lg shadow-md"
          >
            <Link href={`/published/${note.id}`}>
              <h3 className="text-xl font-bold py-2 truncate-title text-gray-700">
                {note.title}
              </h3>
              <p className="text-sm text-gray-600">
                Created:{" "}
                {note.created_at.toLocaleString(DateTime.DATETIME_SHORT)}
              </p>
              <p className="text-sm text-gray-600">
                Updated:{" "}
                {note.updated_at.toLocaleString(DateTime.DATETIME_SHORT)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
