import { DateTime } from "luxon";

import { NoteData } from "../lib/client/types";
import { useNotesDispatch, useNotesState } from "../contexts/notes-context";
import { fetchNotes, updateParent } from "../lib/client/api";
import NoteList from "./note-list";

type NoteProps = {
  note: NoteData;
  depth: number;
};

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

    // TODO: check if target note is descendent of current dragging note
    if (
      checkIfNoteIsDescendent(
        state.notesMap,
        state.notesMap.get(note.id)!,
        state.notesMap.get(state.currentDragId!)!
      )
    ) {
      alert("invalid action. cannot move note into descendent note.");
      return;
    }

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

  async function handleExpand(e: React.MouseEvent) {
    const childNotes = await fetchNotes(note.id);
    dispatch({
      type: "add_child_notes_to_note",
      payload: childNotes,
      id: note.id,
    });
  }

  /**
   * Checks if a given note is a descendant of another note.
   *
   * @param {Map<string, NoteData>} notesMap - The map containing all notes.
   * @param {NoteData} noteA - The note to check if it is a descendant.
   * @param {NoteData} noteB - The potential ancestor note.
   * @return {boolean} Returns true if noteA is a descendant of noteB, otherwise returns false.
   */
  function checkIfNoteIsDescendent(
    notesMap: Map<string, NoteData>,
    noteA: NoteData,
    noteB: NoteData
  ) {
    let curNote = noteA;

    while (curNote.parent_id) {
      curNote = notesMap.get(curNote.parent_id)!;

      if (curNote.id === noteB.id) {
        return true;
      }
    }

    return false;
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
        className="p-2 bg-white text-black border-2 hover:outline hover:outline-2 hover:outline-black rounded cursor-pointer space-y-2"
      >
        <h2 className="text-xl font-bold">{note.title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-300">
          id: {note.id}
        </p>
        <p>
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

      {note.child_count > 0 && (
        <button
          onClick={handleExpand}
          className="bg-gray-100 text-gray-600 dark:text-gray-300 border border-gray-700 text-sm font-bold px-2 py-1 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded"
        >
          expand
        </button>
      )}

      {note.child_notes?.length > 0 && (
        <NoteList notes={note.child_notes} depth={depth + 1} />
      )}
    </div>
  );
}
