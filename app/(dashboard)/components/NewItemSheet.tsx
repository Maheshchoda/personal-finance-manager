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
import ResourceType from "@/components/entities/Resource";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";

const NewItemSheet = ({ itemName }: ResourceType) => {
  const { isOpen, onClose } = useSheet();
  const mutation = usePostItem({ itemName });
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
            Create a new {CapTrimEnd(itemName, true)} to track your
            transactions.
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
