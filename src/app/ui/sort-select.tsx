import { ChangeEvent } from "react";

export default function SortSelect({ onChange }: { onChange: Function }) {
  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    onChange(e.target.value);
  }

  return (
    <div className="flex items-center justify-between">
      <label
        htmlFor="sort"
        className="mr-2 basis-1/4 text-gray-500 dark:text-gray-300 font-bold text-sm"
      >
        Sort by:{" "}
      </label>
      <select
        name="sort"
        id="sort"
        className="bg-gray-200 p-2 border-0 rounded basis-3/4 text-md text-gray-800 dark:text-gray-300"
        onChange={handleChange}
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
