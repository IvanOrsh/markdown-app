"use client";

import { useEffect } from "react";
import { useNotesDispatch, useNotesState } from "../contexts/notes-context";
import { fetchNotes } from "../lib/client/api";
import NoteList from "./note-list";
import CreateNoteBtn from "./create-note-btn";
import SortSelect from "./sort-select";

export default function NoteContainer() {
  const state = useNotesState();
  const dispatch = useNotesDispatch();

  function handleChange(value: string) {
    dispatch({
      type: "sort_notes",
      sortKey: value,
    });
  }

  useEffect(() => {
    async function init() {
      console.log("init");
      const notes = await fetchNotes();
      dispatch({
        type: "set_root_notes",
        payload: notes,
      });
    }

    init();
  }, [dispatch]);

  if (!state.rootNotes) {
    return (
      <div className="w-full text-center text-gray-500 py-4 text-lg font-bold dark:text-gray-300">
        loading...
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <CreateNoteBtn />
      <SortSelect onChange={handleChange} />
      <NoteList notes={state.rootNotes} />
    </div>
  );
}
