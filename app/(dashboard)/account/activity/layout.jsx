import ActivityNavbar from "@/app/components/dashboard/ActivityNavbar";

export default function ActivityLayout({ children }) {
  return (
    <div className="min-h-screen">
      <ActivityNavbar />
      {children}
    </div>
  );
}
