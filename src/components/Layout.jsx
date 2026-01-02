import Header from "./Header";

function Layout({ children, user }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Header user={user} />

      <main className="flex-1 px-6 pt-24 pb-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}

export default Layout;
