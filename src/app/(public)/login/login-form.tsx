"use client";

import { useFormState } from "react-dom";

import { type LoginFormState, login } from "./actions";

export default function LoginForm() {
  const initialState: LoginFormState = {
    errors: {},
    message: null,
  };
  const [state, dispatch] = useFormState(login, initialState);

  return (
    <div className="p-8 border-2 space-y-4 min-w-[400px]">
      <h1 className="text-2xl bg-gray-800 p-2 font-bold text-center text-white">
        Log In
      </h1>
      <form action={dispatch} className="space-y-4">
        <div>
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded focus:ring-green-600 focus:border-green-600 block w-full p-2.5"
            type="text"
            name="username"
            id="username"
          />
          {state?.errors?.username?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>

        <div>
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded focus:ring-green-600 focus:border-green-600 block w-full p-2.5"
            type="password"
            name="password"
            id="password"
          />
          {state?.errors?.password?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>

        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline tr"
          type="submit"
        >
          Submit
        </button>
        {state?.message && <p className="text-red-500">{state.message}</p>}
      </form>
    </div>
  );
}
