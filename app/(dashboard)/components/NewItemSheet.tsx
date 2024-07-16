import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { usePostItem } from "@/app/(dashboard)/hooks/api";

import ItemForm, { FormType } from "@/app/(dashboard)/components/ItemForm";
import { ItemType } from "@/components/entities/ItemType";
import useEditSheet from "@/components/hooks/useEditSheet";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";

const NewItemSheet = ({
  itemName,
}: {
  itemName: Exclude<ItemType, "transactions">;
}) => {
  const { newSheetOpen, openNewSheet, closeNewSheet } = useEditSheet();
  const mutation = usePostItem(itemName);
  const onSubmit = (values: FormType) => {
    mutation.mutate(values, {
      onSuccess: () => {
        closeNewSheet();
      },
    });
  };
  return (
    <Sheet open={newSheetOpen} onOpenChange={closeNewSheet}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New {CapTrimEnd(itemName, true)}</SheetTitle>
          <SheetDescription>
            Create a new entry to keep track of your{" "}
            {CapTrimEnd(itemName, true)}.
          </SheetDescription>
        </SheetHeader>
        <ItemForm
          itemName={itemName}
          onSubmit={onSubmit}
          defaultValues={{ name: "" }}
          disabled={mutation.isPending}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NewItemSheet;
