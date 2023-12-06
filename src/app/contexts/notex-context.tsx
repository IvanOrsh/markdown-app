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
}

function setRootNotes(state: NotesState, action: any) {
  return {
    ...state,
    rootNotes: action.payload,
  };
}

function reducer(state: NotesState, action: any) {
  console.log(state, action);

  switch (action.type) {
    case "set_root_notes":
      return setRootNotes(state, action);

    default:
      return state;
  }
}

const initialState: NotesState = {
  rootNotes: [],
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
