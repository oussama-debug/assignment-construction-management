import { CopyrightFooter } from "@/components/common/copyright-footer";

export default async function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full bg-sidebar p-2">
      <div className="border-gray-150 bg-gray-25/50 inset-0 flex h-full w-full flex-1 flex-col items-center justify-between rounded-xl border border-dashed bg-white">
        <div></div>
        {children}
        <CopyrightFooter />
      </div>
    </div>
  );
}
