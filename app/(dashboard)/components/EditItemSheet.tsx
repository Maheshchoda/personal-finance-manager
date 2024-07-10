import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import ItemForm, { FormType } from "@/app/(dashboard)/components/ItemForm";
import {
  useDeleteItem,
  useEditItem,
  useGetItem,
} from "@/app/(dashboard)/hooks/api";
import useConfirm from "@/components/hooks/useConfirm";
import useEditSheet from "@/components/hooks/useEditSheet";

import { Loader2 } from "lucide-react";
import ResourceType from "@/components/entities/Resource";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";

const EditItemSheet = ({ itemName }: ResourceType) => {
  const { id, isOpen, onClose } = useEditSheet();
  const getItemQuery = useGetItem({ id, itemName });
  const editMutation = useEditItem({ id, itemName });
  const deleteMutation = useDeleteItem({ itemName });
  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: `You are about to delete an ${CapTrimEnd(itemName, true)}.`,
  });

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const onSubmit = (values: FormType) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onDelete = async ({ id }: { id: string }) => {
    const confirmStatus = await confirm();
    if (confirmStatus) {
      deleteMutation.mutate(
        { id },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    }
  };

  return (
    <div>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit {`${CapTrimEnd(itemName, true)}`}</SheetTitle>
            <SheetDescription>
              Update your {`${CapTrimEnd(itemName, true)}`} information below:
            </SheetDescription>
          </SheetHeader>
          {getItemQuery.isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ItemForm
              itemName={itemName}
              id={id}
              onSubmit={onSubmit}
              defaultValues={{ name: getItemQuery.data?.name ?? "" }}
              disabled={isPending}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default EditItemSheet;
