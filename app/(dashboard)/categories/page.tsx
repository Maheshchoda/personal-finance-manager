"use client";

import useSheet from "@/components/hooks/useSheet";
import { useGetItems, useBulkDeleteItems } from "@/app/(dashboard)/hooks/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

import { default as CategoryTableSkeleton } from "@/app/(dashboard)/components/ItemTableSkeleton";
import Columns from "@/app/(dashboard)/components/Columns";
import { DataTable } from "@/components/Table/DataTable";
import ResourceType from "@/components/entities/Resource";
import ItemSheet from "../components/ItemSheet";

const categoryResource: ResourceType = {
  itemName: "categories",
};

const CategoriesPage = () => {
  const { onOpen } = useSheet();
  const categoriesQuery = useGetItems(categoryResource);
  const deleteCategoryMutation = useBulkDeleteItems(categoryResource);

  const categories = categoriesQuery.data ?? [];

  const disabledActions =
    categoriesQuery.isLoading || deleteCategoryMutation.isPending;

  if (categoriesQuery.isLoading) {
    return <CategoryTableSkeleton />;
  }

  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <ItemSheet itemName={categoryResource.itemName} />
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl">Categories Page</CardTitle>
          <Button onClick={onOpen}>
            <Plus className="mr-2 size-4" />
            New Category
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={Columns(categoryResource)}
            data={categories}
            disabled={disabledActions}
            filterKey="name"
            onDelete={(rows) => {
              const ids = rows.map((row) => row.original.id);
              deleteCategoryMutation.mutate({ ids });
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesPage;
