import { NoteData } from "../lib/client/types";
import Note from "./note";

type NoteListProps = {
  notes: NoteData[];
};

export default function NoteList({ notes }: NoteListProps) {
  return (
    <ul className="space-y-4">
      {notes.map((note) => (
        <li key={note.id}>
          <Note note={note} />
        </li>
      ))}
    </ul>
  );
}
