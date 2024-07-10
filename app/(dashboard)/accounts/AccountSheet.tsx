"use client";
import NewAccountSheet from "@/app/(dashboard)/accounts/NewAccountSheet";
import EditAccountSheet from "@/app/(dashboard)/accounts/EditAccountSheet";

const AccountSheet = () => {
  return (
    <>
      <EditAccountSheet />
      <NewAccountSheet />
    </>
  );
};

export default AccountSheet;
