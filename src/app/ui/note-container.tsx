"use client";

import { useEffect } from "react";
import { useNotesDispatch, useNotesState } from "../contexts/notex-context";
import { fetchNotes } from "../lib/client/api";

export default function NoteContainer() {
  const state = useNotesState();
  const dispatch = useNotesDispatch();

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

  return <div className="w-full">{state.rootNotes.length}</div>;
}
