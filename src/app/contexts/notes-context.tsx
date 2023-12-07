import {
  createContext,
  PropsWithChildren,
  type Dispatch,
  useReducer,
  useContext,
} from "react";

import { type NoteData } from "../lib/client/types";

interface NotesState {
  rootNotes: NoteData[];
  currentDragId: string | null;
  notesMap: Map<string, NoteData>;
}

function addNotesToCache(notesMap: Map<string, NoteData>, notes: NoteData[]) {
  for (const note of notes) {
    notesMap.set(note.id, note);
  }
}

function setRootNotes(state: NotesState, action: any) {
  addNotesToCache(state.notesMap, action.payload);

  return {
    ...state,
    rootNotes: action.payload,
  };
}

function addNewNoteToRootNotes(state: NotesState, action: any) {
  addNotesToCache(state.notesMap, [action.payload]);
  const newRootNotes = [...state.rootNotes];
  newRootNotes.unshift(action.payload);

  return {
    ...state,
    rootNotes: newRootNotes,
  };
}

function sortNotes(state: NotesState, action: any) {
  const newState = {
    ...state,
  };
  sortNotesRecursively(newState.rootNotes, action.sortKey);

  return {
    ...state,
    rootNotes: newState.rootNotes,
  };
}

function sortNotesRecursively(notes: NoteData[], sortKey: any) {
  notes.sort((a: NoteData, b: NoteData) => {
    const reverse = sortKey.startsWith("-");
    const key = reverse ? sortKey.slice(1) : sortKey;

    if (a[key as keyof NoteData] < b[key as keyof NoteData]) {
      return reverse ? 1 : -1;
    }

    if (a[key as keyof NoteData] > b[key as keyof NoteData]) {
      return reverse ? -1 : 1;
    }

    return 0; // equal
  });

  for (const note of notes) {
    if (note.child_notes.length > 0) {
      sortNotesRecursively(note.child_notes, sortKey);
    }
  }
}

function updateCurrentDragId(state: NotesState, action: any) {
  return {
    ...state,
    currentDragId: action.payload,
  };
}

function changeParent(state: NotesState, action: any) {
  //  get currently dragging note
  const { currentDragId, newParentId } = action;
  const currentDraggingNote = state.notesMap.get(currentDragId);

  if (!currentDraggingNote) {
    return state;
  }

  // get old parent
  const oldParentId = currentDraggingNote.parent_id;
  const oldParent = state.notesMap.get(oldParentId);

  // get new parent
  const newParent = state.notesMap.get(newParentId);

  if (!newParent) {
    return state;
  }

  const newState = {
    ...state,
  };

  // remove the currently dragging note from old parent or root notes:

  if (oldParent) {
    // #1
    oldParent.child_notes.splice(
      oldParent.child_notes.findIndex((note) => note.id === currentDragId),
      1
    );
  } else {
    // 2
    // since it has no old parent, remove it from root notes
    // delete from root notes
    newState.rootNotes.splice(
      newState.rootNotes.findIndex((note) => note.id === currentDragId),
      1
    );
  }

  // add the currently dragging note to new parent
  newParent.child_notes.push(currentDraggingNote);

  // set parent id of current dragging note
  currentDraggingNote.parent_id = newParentId;

  // return new State
  return newState;
}

function addChildNotesToNote(state: NotesState, action: any) {
  addNotesToCache(state.notesMap, action.payload);

  const newState = {
    ...state,
  };

  const note = newState.notesMap.get(action.id);

  if (note) {
    note.child_notes = action.payload;
  }

  return newState;
}

function updateNote(state: NotesState, action: any) {
  const newState = {
    ...state,
  };
  const note = newState.notesMap.get(action.payload.id);

  if (!note) {
    return newState;
  }

  Object.assign(note, action.payload);
  return newState;
}

function reducer(state: NotesState, action: any) {
  console.log(state, action);

  switch (action.type) {
    case "set_root_notes":
      return setRootNotes(state, action);

    case "add_new_note_to_root_notes":
      return addNewNoteToRootNotes(state, action);

    case "sort_notes":
      return sortNotes(state, action);

    case "update_current_drag_id":
      return updateCurrentDragId(state, action);

    case "change_parent":
      return changeParent(state, action);

    case "add_child_notes_to_note":
      return addChildNotesToNote(state, action);

    case "update_note":
      return updateNote(state, action);

    default:
      return state;
  }
}

const initialState: NotesState = {
  rootNotes: [],
  currentDragId: null,
  notesMap: new Map<string, NoteData>(),
};

export const NotesContext = createContext({} as NotesState);
export const NotesDispatchContext = createContext({} as Dispatch<any>);

export function NotesProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <NotesContext.Provider value={state}>
      <NotesDispatchContext.Provider value={dispatch}>
        {children}
      </NotesDispatchContext.Provider>
    </NotesContext.Provider>
  );
}

export function useNotesState() {
  return useContext(NotesContext);
}

export function useNotesDispatch() {
  return useContext(NotesDispatchContext);
}
