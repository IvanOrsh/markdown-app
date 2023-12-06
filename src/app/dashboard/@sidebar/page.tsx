import { getCurrentUser } from "@/app/lib/server/auth";
import NoteContainer from "@/app/ui/note-container";

export default async function Page() {
  const user = await getCurrentUser();

  return (
    <div className="overflow-auto max-h-screen p-2 flex-none w-1/3 bg-red-500/10">
      <div>Signed in as: {user.username}</div>
      <NoteContainer />
    </div>
  );
}
