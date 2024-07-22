import DataGrid from "@/app/(dashboard)/(features)/summary/DataGrid";
import DataChart from "@/app/(dashboard)/(features)/summary/charts/DataChart";

export default function DashboardPage() {
  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <DataGrid />
      <DataChart />
    </div>
  );
}
