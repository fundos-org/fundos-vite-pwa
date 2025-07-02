export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen h-screen w-full bg-black flex flex-col items-center p-4 text-white">
      {children}
    </main>
  );
}