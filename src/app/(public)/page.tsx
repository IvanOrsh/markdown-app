import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-2 w-full">
      <h1 className="bg-yellow-300 p-2 font-bold text-black w-full text-center">
        Markdown App
      </h1>

      <ul className="space-y-2">
        <li>
          <Link
            className="block bg-red-700 p-2 text-white w-full text-center hover:outline hover:outline-2 hover:outline-red-900"
            href="/signup"
          >
            Sign Up
          </Link>
        </li>

        <li>
          <Link
            className="block bg-blue-700 p-2 text-white w-full text-center hover:outline hover:outline-2 hover:outline-blue-900"
            href="/login"
          >
            Log In
          </Link>
        </li>
      </ul>
    </div>
  );
}
