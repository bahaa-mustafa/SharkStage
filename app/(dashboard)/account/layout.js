import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4 bg-background dark:bg-background-dark flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
