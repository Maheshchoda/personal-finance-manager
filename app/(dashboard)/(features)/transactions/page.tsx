"use client";

import { useBulkDeleteItems, useGetItems } from "@/app/(dashboard)/hooks/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

import Columns from "@/app/(dashboard)/components/Columns";
import ItemSheet from "@/app/(dashboard)/components/ItemSheet";
import { default as TransactionTableSkeleton } from "@/app/(dashboard)/components/ItemTableSkeleton";
import { DataTable } from "@/components/Table/DataTable";
import { ItemType } from "@/components/entities/ItemType";
import useEditSheet from "@/components/hooks/useEditSheet";

const transactionResource: ItemType = "transactions";

const TransactionsPage = () => {
  const { openNewSheet } = useEditSheet();
  const transactionsQuery = useGetItems("transactions");
  const deleteTransactionMutation = useBulkDeleteItems(transactionResource);

  const transactions = transactionsQuery.data ?? [];

  const disabledActions =
    transactionsQuery.isLoading || deleteTransactionMutation.isPending;

  if (transactionsQuery.isLoading) {
    return <TransactionTableSkeleton />;
  }

  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <ItemSheet itemType={transactionResource} />
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl">Transactions Page</CardTitle>
          <Button onClick={openNewSheet}>
            <Plus className="mr-2 size-4" />
            New Transaction
          </Button>
        </CardHeader>
        <CardContent>
          {
            <DataTable
              columns={Columns(transactionResource)}
              data={transactions}
              disabled={disabledActions}
              filterKey="payee"
              onDelete={(rows) => {
                const ids = rows.map((row) => row.original.id);
                deleteTransactionMutation.mutate({ ids });
              }}
            />
          }
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
