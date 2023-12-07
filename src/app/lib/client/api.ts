import { DateTime } from "luxon";
import { type NoteData } from "./types";

export async function createNote() {
  const res = await fetch("/api/notes", {
    method: "POST",
  });

  const json = await res.json();

  return transformJsonToNote(json);
}

export async function fetchNotes(parent_id?: string) {
  let queryString = "";

  if (parent_id) {
    queryString += `?parent_id=${parent_id}`;
  }

  const notesRes = await fetch("/api/notes" + queryString);
  const json = await notesRes.json();
  console.log(json);

  const transformed = json.map((data: any) => {
    return transformJsonToNote(data);
  });

  return transformed;
}

function transformJsonToNote(json: any): NoteData {
  return {
    ...json,
    created_at: DateTime.fromISO(json.created_at),
    updated_at: DateTime.fromISO(json.updated_at),
    child_notes: [],
  };
}
