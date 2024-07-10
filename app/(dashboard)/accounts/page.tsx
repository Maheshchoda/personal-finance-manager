"use client";

import useSheet from "@/components/hooks/useSheet";
import { useGetItems, useBulkDeleteItems } from "@/app/(dashboard)/hooks/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

import AccountTableSkeleton from "@/app/(dashboard)/accounts/AccountTableSkeleton";
import { Columns } from "@/app/(dashboard)/accounts/Columns";
import { DataTable } from "@/components/Table/DataTable";

const AccountsPage = () => {
  const { onOpen } = useSheet();
  const accountsQuery = useGetItems({
    itemName: "accounts",
  });
  const deleteAccountsQuery = useBulkDeleteItems({
    itemName: "accounts",
  });

  const accounts = accountsQuery.data ?? [];

  const isDisabled = accountsQuery.isLoading || deleteAccountsQuery.isPending;

  if (accountsQuery.isLoading) {
    return <AccountTableSkeleton />;
  }

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
            disabled={isDisabled}
            filterKey="name"
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteAccountsQuery.mutate({ ids });
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsPage;
