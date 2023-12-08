"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const debouncedSearch = useDebouncedCallback((term) => {
    console.log(`searching ${term}`);

    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    debouncedSearch(e.target.value);
  }

  return (
    <div className="flex items-center justify-center w-full max-w-3xl rounded-full bg-white border border-gray-200 px-3 py-2 shadow-sm">
      <svg
        className="w-4 h-4 mr-2 text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      <input
        className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500 focus:ring-1 focus:ring-blue-500 text-2xl"
        placeholder="Search..."
        onChange={handleSearch}
      />
    </div>
  );
}
