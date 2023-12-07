import { DateTime } from "luxon";

import { NoteData } from "../lib/client/types";
import { useNotesDispatch } from "../contexts/notes-context";

export default function Note({ note }: { note: NoteData }) {
  const dispatch = useNotesDispatch();

  function handleDragStart(e: React.DragEvent) {
    console.log("drag start");
    // #2
    dispatch({
      type: "update_current_drag_id",
      payload: note.id,
    });
  }

  function handleDragEnd(e: React.DragEvent) {
    console.log("drag end");
  }

  function handleDrop(e: React.DragEvent) {
    console.log("drop", note.id);
  }

  function handleDragOver(e: React.DragEvent) {
    console.log("drag over");
    e.preventDefault(); // #1, to make drop works
  }

  function handleDragEnter(e: React.DragEvent) {
    console.log("drag enter");
  }

  function handleDragLeave(e: React.DragEvent) {
    console.log("drag leave");
  }

  return (
    <article
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className="p-2 bg-white text-black border-2 hover:outline hover:outline-2 hover:outline-black rounded group  cursor-pointer space-y-2"
    >
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
