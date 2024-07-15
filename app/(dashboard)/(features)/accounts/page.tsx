"use client";

import useSheet from "@/components/hooks/useSheet";
import { useGetItems, useBulkDeleteItems } from "@/app/(dashboard)/hooks/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

import { default as AccountTableSkeleton } from "@/app/(dashboard)/components/ItemTableSkeleton";
import Columns from "@/app/(dashboard)/components/Columns";
import { DataTable } from "@/components/Table/DataTable";
import { ItemType } from "@/components/entities/ItemType";
import ItemSheet from "@/app/(dashboard)/components/ItemSheet";

const accountType: ItemType = "accounts";

const AccountsPage = () => {
  const { onOpen } = useSheet();
  const accountsQuery = useGetItems(accountType);
  const deleteAccountsMutation = useBulkDeleteItems(accountType);

  const accounts = accountsQuery.data ?? [];

  const disabledActions =
    accountsQuery.isLoading || deleteAccountsMutation.isPending;

  if (accountsQuery.isLoading) {
    return <AccountTableSkeleton />;
  }

  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <ItemSheet itemName={accountType} />
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
            columns={Columns(accountType)}
            data={accounts}
            disabled={disabledActions}
            filterKey="name"
            onDelete={(rows) => {
              const ids = rows.map((row) => row.original.id);
              deleteAccountsMutation.mutate({ ids });
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsPage;
