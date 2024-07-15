import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import useSheet from "@/components/hooks/useSheet";
import { usePostItem } from "@/app/(dashboard)/hooks/api";

import ItemForm, { FormType } from "@/app/(dashboard)/components/ItemForm";
import { ItemType } from "@/components/entities/ItemType";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";

const NewItemSheet = ({
  itemName,
}: {
  itemName: Exclude<ItemType, "transactions">;
}) => {
  const { isOpen, onClose } = useSheet();
  const mutation = usePostItem(itemName);
  const onSubmit = (values: FormType) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
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
