export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full overflow-x-hidden bg-sidebar">
      {children}
    </div>
  );
}
