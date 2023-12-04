import { PropsWithChildren } from "react";

export default function PublicLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen m-auto max-w-xs items-center justify-center">
      {children}
    </div>
  );
}
