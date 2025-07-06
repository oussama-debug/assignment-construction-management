export default async function CreateWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      {children}
    </div>
  );
}
