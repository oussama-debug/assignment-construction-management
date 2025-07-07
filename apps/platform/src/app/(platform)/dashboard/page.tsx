import { getCurrentUserRole } from "@/lib/user";
import WorkersHeader from "./workers-header";
import WorkersList from "./workers-list";
import WorkersCheckin from "./workers-checkin";

export default async function Dashboard() {
  const userRole = await getCurrentUserRole();

  if (!userRole)
    return (
      <div className="w-full max-w-[1280px] pt-5 mx-auto h-full flex flex-col gap-6">
        <div className="text-center text-red-500">
          Unable to determine user role. Please try logging in again.
        </div>
      </div>
    );

  if (userRole.role !== "supervisor") {
    return (
      <div className="w-full max-w-[1280px] pt-5 mx-auto h-full flex flex-col gap-6">
        <WorkersCheckin name={userRole.name} id={userRole.id} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1280px] pt-5 mx-auto h-full flex flex-col gap-6">
      <WorkersHeader />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <WorkersList />
        </div>
      </div>
    </div>
  );
}
