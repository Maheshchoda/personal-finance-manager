"use client";

import { useUser } from "@clerk/nextjs";
import React from "react";

const WelcomeMessage = () => {
  const { user, isLoaded } = useUser();
  return (
    <div className="mt-14 space-y-2">
      <h2 className="text-2xl font-medium text-white lg:text-4xl">
        Welcome Back{isLoaded && `, ${user?.firstName}.`} 👋
      </h2>
      <p className="text-sm text-[#89b6fd] lg:text-base">
        This is your financial Overview Report.
      </p>
    </div>
  );
};

export default WelcomeMessage;
