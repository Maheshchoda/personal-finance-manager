import React from "react";
import AccountFilter from "./AccountFilter";

const FilterByDate = () => {
  return (
    <div className="flex flex-col items-center gap-y-2 lg:flex-row lg:gap-x-2 lg:gap-y-0">
      <AccountFilter />
    </div>
  );
};

export default FilterByDate;
