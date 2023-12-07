import { NoteData } from "../lib/client/types";
import Note from "./note";

type NoteListProps = {
  notes: NoteData[];
  depth?: number;
};

export default function NoteList({ notes, depth = 0 }: NoteListProps) {
  return (
    <ul
      className={`space-y-4 `}
      style={{
        marginLeft: `${depth * 10}px`,
      }}
    >
      {notes.map((note) => (
        <li key={note.id}>
          <Note note={note} depth={depth + 1} />
        </li>
      ))}
    </ul>
  );
}
