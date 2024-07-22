import React from "react";
import AccountFilter from "./AccountFilter";
import DateFilter from "./DateFilter";

const Filter = () => {
  return (
    <div className="flex flex-col items-center gap-y-2 lg:flex-row lg:gap-x-2 lg:gap-y-0">
      <AccountFilter />
      <DateFilter />
    </div>
  );
};

export default Filter;
