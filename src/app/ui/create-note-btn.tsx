import { useNotesDispatch } from "../contexts/notes-context";
import { createNote } from "../lib/client/api";

export default function CreateNoteBtn() {
  const dispatch = useNotesDispatch();

  async function handleClick() {
    const json = await createNote();

    dispatch({
      type: "add_new_note_to_root_notes",
      payload: json,
    });
  }

  return (
    <button
      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-300"
      onClick={handleClick}
    >
      Create Note
    </button>
  );
}
