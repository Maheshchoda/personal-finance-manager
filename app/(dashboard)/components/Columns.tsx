"use client";

import Actions from "@/app/(dashboard)/components/Actions";
import { ItemType } from "@/components/entities/ItemType";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { client } from "@/lib/hono";
import { formatCurrency } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { InferResponseType } from "hono";
import { ArrowUpDown } from "lucide-react";

type TransactionResponseType = InferResponseType<
  typeof client.api.transactions.$get,
  200
>["data"][0];

type DefaultResponseType = InferResponseType<
  (typeof client.api)[Exclude<ItemType, "transactions">]["$get"],
  200
>["data"][0];

type ResponseType<T extends ItemType> = T extends "transactions"
  ? TransactionResponseType
  : DefaultResponseType;

const createColumns = <T extends ItemType>(
  itemName: T,
): ColumnDef<ResponseType<T>>[] => {
  const commonColumns: ColumnDef<ResponseType<T>>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  if (itemName === "transactions") {
    const transactionColumns: ColumnDef<TransactionResponseType>[] = [
      {
        accessorKey: "payee",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Payee
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: "account",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Account
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <span>{row.original.account}</span>,
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Category
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <span>{row.original.category}</span>,
      },
      {
        accessorKey: "date",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const date = row.getValue("date") as Date;
          return <span>{format(date, "dd MMMM, yyyy")}</span>;
        },
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("amount"));
          return (
            <Badge
              variant={amount < 0 ? "destructive" : "primary"}
              className="px-3.5 py-2.5 text-xs font-medium"
            >
              {formatCurrency(amount)}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => <Actions itemName={itemName} id={row.original.id} />,
      },
    ];

    return [...commonColumns, ...transactionColumns] as ColumnDef<
      ResponseType<T>
    >[];
  } else {
    const defaultColumns: ColumnDef<DefaultResponseType>[] = [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => <Actions itemName={itemName} id={row.original.id} />,
      },
    ];

    return [...commonColumns, ...defaultColumns] as ColumnDef<
      ResponseType<T>
    >[];
  }
};

const AccountColumn = (account: string, accountId: string) => {};

export default createColumns;
