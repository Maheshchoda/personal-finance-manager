"use client";

import useGetSummary from "../useGetSummary";
import CategorySpendingChart from "./CategorySpendingChart";
import TransactionsChart from "./TransactionsChart";

const DataChart = () => {
  const { data, isLoading } = useGetSummary({});

  if (isLoading) {
    return <div> Loading...</div>;
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
