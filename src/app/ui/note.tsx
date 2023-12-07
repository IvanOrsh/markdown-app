import { DateTime } from "luxon";

import { NoteData } from "../lib/client/types";
import { useNotesDispatch, useNotesState } from "../contexts/notes-context";
import { updateParent } from "../lib/client/api";
import NoteList from "./note-list";

type NoteProps = {
  note: NoteData;
  depth: number;
};

function isIdInChildNotes(note: NoteData, id: string): boolean {
  if (note.child_notes.length === 0) {
    return false;
  }

  for (const childNote of note.child_notes) {
    if (childNote.id === id) {
      return true;
    }

    if (isIdInChildNotes(childNote, id)) {
      return true;
    }
  }

  return false;
}

export default function Note({ note, depth }: NoteProps) {
  const state = useNotesState();
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

  async function handleDrop(e: React.DragEvent) {
    console.log("drop", note.id);
    // #3
    console.log("current drag id:", state.currentDragId);

    // make sure we are not dropping node to itself
    if (note.id === state.currentDragId) {
      alert("cannot move note into itself");
      return;
    }

    const currentDraggingNote = state.notesMap.get(state.currentDragId!);

    // if currently dragging note is root note, it cannot be child of its own children
    if (
      state.rootNotes.find((note) => note.id === state.currentDragId) &&
      isIdInChildNotes(currentDraggingNote!, note.id)
    ) {
      alert("Root node cannot be a child of its own children");
      return state;
    }

    // TODO: check if target note is descendent of current dragging note

    // update parent api call
    await updateParent(state.currentDragId!, note.id);

    // dispatch change_parent event
    dispatch({
      type: "change_parent",
      newParentId: note.id,
      currentDragId: state.currentDragId,
    });
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
    <div>
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

      {note.child_notes?.length > 0 && (
        <NoteList notes={note.child_notes} depth={depth + 1} />
      )}
    </div>
  );
}
