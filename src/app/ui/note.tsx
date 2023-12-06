import { DateTime } from "luxon";
import { NoteData } from "../lib/client/types";

export default function Note({ note }: { note: NoteData }) {
  return (
    <article className="p-2 text-black border-2 hover:outline hover:outline-2 hover:outline-black rounded  cursor-pointer space-y-2 group transition-all duration-200 hover:scale-y-110 ">
      <h2 className="text-xl font-bold line-clamp-1 group-hover:line-clamp-none ">
        {note.title}
      </h2>
      <p className="hidden group-hover:block text-sm text-gray-500 dark:text-gray-300">
        id: {note.id}
      </p>
      <p className="hidden group-hover:block">
        <span className="font-bold text-gray-500 dark:text-gray-300 text-sm mr-2">
          created:
        </span>
        {note.created_at.toLocaleString(DateTime.DATETIME_MED)}
      </p>
      <p>
        <span className="font-bold text-gray-500 dark:text-gray-300 text-sm mr-2">
          updated:
        </span>
        {note.updated_at.toLocaleString(DateTime.DATETIME_MED)}
      </p>
      <p>
        <span className="font-bold text-gray-500 dark:text-gray-300 text-sm mr-2">
          status:
        </span>
        {note.is_published ? "Published" : "Draft"}
      </p>
    </article>
  );
}
