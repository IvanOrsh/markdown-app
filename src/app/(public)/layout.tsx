import { PropsWithChildren } from "react";

export default function PublicLayout({ children }: PropsWithChildren) {
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  );
}
