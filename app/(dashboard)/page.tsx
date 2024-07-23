import DataGrid from "@/app/(dashboard)/(features)/summary/DataGrid";
import DataChart from "@/app/(dashboard)/(features)/summary/charts/DataChart";
import { Metadata } from "next";

export default function DashboardPage() {
  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <DataGrid />
      <DataChart />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Money Manager - Dashboard",
  description:
    "Manage your finances effortlessly with real-time tracking, insights, and comprehensive overviews of your accounts, transactions, and budgets.",
};
