"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";

export default function SortSelectServer() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSort(e: ChangeEvent<HTMLSelectElement>) {
    console.log(`sorting ${e.target.value}`);
    const params = new URLSearchParams(searchParams);
    params.set("sort", e.target.value);
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-between px-3 py-2">
      <label
        htmlFor="sort"
        className="mr-2 basis-1/4 text-gray-500 dark:text-gray-300 font-bold text-md"
      >
        Sort by:{" "}
      </label>
      <select
        name="sort"
        id="sort"
        className="bg-white p-2 border-0 rounded basis-3/4 text-md text-gray-800 dark:text-gray-300"
        onChange={handleSort}
      >
        <option value="title">Title A to Z</option>
        <option value="-title">Titlt Z to A</option>

        <option value="created_at">Created (old to new)</option>
        <option value="-created_at">Created (new to old)</option>

        <option value="updated_at">Updated (old to new)</option>
        <option value="-updated_at">Updated (new to old)</option>
      </select>
    </div>
  );
}
