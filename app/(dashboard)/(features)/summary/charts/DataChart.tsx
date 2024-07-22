"use client";

import { useSearchParams } from "next/navigation";
import useGetSummary from "../useGetSummary";
import CategorySpendingChart from "./CategorySpendingChart";
import ChartLoadingSkeleton from "./ChartLoadingSkeleton";
import TransactionsChart from "./TransactionsChart";

const DataChart = () => {
  const params = useSearchParams();
  const from = params.get("from") || undefined;
  const to = params.get("to") || undefined;
  const accountId = params.get("accountId") || undefined;
  const { data, isLoading } = useGetSummary({ from, to, accountId });

  if (isLoading) {
    return (
      <div className="lg:grid-col-6 grid grid-cols-1 gap-8">
        <div className="col-span-1 lg:col-span-3 xl:col-span-4">
          <ChartLoadingSkeleton />
        </div>
        <div className="col-span-1 lg:col-span-3 xl:col-span-2">
          <ChartLoadingSkeleton />
        </div>
      </div>
    );
  }
  return (
    <div className="lg:grid-col-6 grid grid-cols-1 gap-8">
      <div className="col-span-1 lg:col-span-3 xl:col-span-4">
        <TransactionsChart data={data?.days} />
      </div>
      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <CategorySpendingChart data={data?.topSpendingCategories} />
      </div>
    </div>
  );
};

export default DataChart;
