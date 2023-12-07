"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { fetchNote, updateNote } from "@/app/lib/client/api";
import { type NoteData } from "@/app/lib/client/types";
import { useNotesDispatch } from "@/app/contexts/notes-context";

export default function Page() {
  const searchParams = useSearchParams();
  const [curNote, setCurNote] = useState<NoteData | null>(null);

  const dispatch = useNotesDispatch();

  async function refreshNote(note_id: string) {
    console.log("refresh note:", note_id);

    const note = await fetchNote(note_id);
    setCurNote(note);
  }

  const handleUpdateNote = useDebouncedCallback(async (note: NoteData) => {
    const updatedNote = await updateNote(note);
    dispatch({
      type: "update_note",
      payload: updatedNote,
    });
  }, 350);

  useEffect(() => {
    console.log(searchParams);
    const note_id = searchParams.get("note_id");
    console.log("content container:", note_id);

    if (note_id !== null && curNote?.id !== note_id) {
      refreshNote(note_id);
    }
  }, [searchParams, curNote]);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newNote = {
      ...curNote!,
      title: e.target.value,
    };

    setCurNote(newNote);
    await handleUpdateNote(newNote);
  }

  return (
    <div className="flex-auto w-2/3">
      {curNote && (
        <div className="p-2 w-full">
          <label
            htmlFor="title"
            className="text-gray-500 dark:text-gray-300 font-bold text-sm"
          >
            Title:
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={curNote.title}
            onChange={handleChange}
            className="text-xl font-bold p-2 text-gray-800 dark:text-gray-300 focus:outline-gray-500 w-full"
          />
        </div>
      )}
    </div>
  );
}
