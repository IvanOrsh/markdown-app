import { getCurrentUser } from "@/app/lib/server/auth";
import NoteContainer from "@/app/ui/note-container";

export default async function Page() {
  const user = await getCurrentUser();

  return (
    <div className="overflow-auto min-h-screen p-2 flex-none w-1/3 max-w-[350px]">
      <div className="text-sm p-2 text-gray-500 dark:text-gray-300">
        Signed in as: {user.username}
      </div>
      <NoteContainer />
    </div>
  );
}
