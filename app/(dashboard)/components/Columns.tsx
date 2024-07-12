"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { client } from "@/lib/hono";
import { InferResponseType } from "hono";
import Actions from "@/app/(dashboard)/components/Actions";
import { ItemType } from "@/components/entities/ItemType";

export type AccountsResponseType = InferResponseType<
  (typeof client.api)[ItemType]["$get"],
  200
>["data"][0];

const Columns = (itemName: ItemType): ColumnDef<AccountsResponseType>[] => {
  return [
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
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <Actions itemName={itemName} id={row.original.id} />,
    },
  ];
};
export default Columns;
