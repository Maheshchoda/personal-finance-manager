import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import useConfirm from "@/components/hooks/useConfirm";
import useEditSheet from "@/components/hooks/useEditSheet";
import useEditAccount from "@/features/accounts/api/useEditAccount";
import useGetAccount from "@/features/accounts/api/useGetAccount";
import useDeleteAccount from "../api/useDeleteAccount";
import AccountForm, {
  FormType,
} from "@/features/accounts/components/AccountForm";

import { Loader2 } from "lucide-react";

const EditAccountSheet = () => {
  const { id, isOpen, onClose } = useEditSheet();
  const getAccountQuery = useGetAccount({ id });
  const editMutation = useEditAccount({ id });
  const deleteMutation = useDeleteAccount();
  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: "you are about to delete an account",
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
