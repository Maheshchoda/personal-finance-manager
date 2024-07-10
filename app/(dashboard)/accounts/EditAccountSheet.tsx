import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import AccountForm, { FormType } from "@/app/(dashboard)/accounts/AccountForm";
import {
  useDeleteItem,
  useEditItem,
  useGetItem,
} from "@/app/(dashboard)/hooks/api";
import useConfirm from "@/components/hooks/useConfirm";
import useEditSheet from "@/components/hooks/useEditSheet";

import { Loader2 } from "lucide-react";

const EditAccountSheet = () => {
  const { id, isOpen, onClose } = useEditSheet();
  const getAccountQuery = useGetItem({ id, itemName: "accounts" });
  const editMutation = useEditItem({ id, itemName: "accounts" });
  const deleteMutation = useDeleteItem({ itemName: "accounts" });
  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: "You are about to delete an account.",
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
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>
              Update your account information below:
            </SheetDescription>
          </SheetHeader>
          {getAccountQuery.isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <AccountForm
              id={id}
              onSubmit={onSubmit}
              defaultValues={{ name: getAccountQuery.data?.name ?? "" }}
              disabled={isPending}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default EditAccountSheet;
