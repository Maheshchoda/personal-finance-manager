"use client";

import useGetSummary from "../useGetSummary";
import Chart from "./Chart";

const DataChart = () => {
  const { data, isLoading } = useGetSummary({});

  if (isLoading) {
    return <div> Loading...</div>;
  }
  return (
    <div>
      <Chart data={data?.days} />
    </div>
  );
};

export default DataChart;
