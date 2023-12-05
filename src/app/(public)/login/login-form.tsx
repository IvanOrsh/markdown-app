"use client";

export default function LoginForm() {
  return (
    <div className="p-8 border-2 space-y-4">
      <h1 className="text-2xl">Log In</h1>
      <form action="" className="space-y-4">
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
        </div>

        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline tr"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
