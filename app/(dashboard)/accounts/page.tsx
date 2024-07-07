"use client";
import useSheet from "@/components/hooks/useSheet";
import useGetAccounts from "@/features/accounts/api/useGetAccounts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/Table/DataTable";
import { Columns } from "@/app/(dashboard)/accounts/Columns";

const AccountsPage = () => {
  const { onOpen } = useSheet();
  const accounts = useGetAccounts()?.data ?? [];

  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl">Accounts Page</CardTitle>
          <Button onClick={onOpen}>
            <Plus className="mr-2 size-4" />
            New Account
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={Columns}
            data={accounts}
            disabled={false}
            filterKey="name"
            onDelete={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsPage;
