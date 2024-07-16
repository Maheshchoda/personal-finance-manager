import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  useDeleteItem,
  useGetItems,
  usePostItem,
} from "@/app/(dashboard)/hooks/api";
import useConfirm from "@/components/hooks/useConfirm";

import useEditSheet from "@/components/hooks/useEditSheet";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";
import { Loader2 } from "lucide-react";
import TransactionForm, { TransactionApiFormValues } from "./TransactionForm";

const TransactionSheet = ({ id }: { id?: string }) => {
  const { newSheetOpen, closeNewSheet, isOpen, onClose } = useEditSheet();
  const TransactionOpen = id ? isOpen(id) : newSheetOpen;
  const newTransaction = usePostItem("transactions");
  const deleteTransaction = useDeleteItem("transactions");

  const accountMutation = usePostItem("accounts");
  const accountQuery = useGetItems("accounts");
  const onAccountCreation = (name: string) => accountMutation.mutate({ name });
  const accountOptions = (accountQuery.data ?? []).map((item) => {
    if ("name" in item) {
      return { label: item.name, value: item.id };
    } else {
      throw new Error(`Expected Account to have a name property`);
    }
  });

  const categoryMutation = usePostItem("categories");
  const categoryQuery = useGetItems("categories");
  const onCategoryCreation = (name: string) =>
    categoryMutation.mutate({ name });
  const categoryOptions = (categoryQuery.data ?? []).map((item) => {
    if ("name" in item) {
      return { label: item.name, value: item.id };
    } else {
      throw new Error(`Expected Account to have a name property`);
    }
  });

  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: `You are about to delete an ${CapTrimEnd("transactions", true)}.`,
  });

  const isLoading = accountQuery?.isLoading || categoryQuery?.isLoading;

  const isPending =
    newTransaction.isPending ||
    accountMutation?.isPending ||
    categoryMutation?.isPending;

  const onSubmit = (values: TransactionApiFormValues) => {
    console.log(JSON.stringify(values), "Getting values");
    newTransaction.mutate(values, {
      onSuccess: () => {
        id && onClose(id);
      },
    });
  };

  const onDelete = async (id: string) => {
    const confirmStatus = await confirm();
    if (confirmStatus) {
      deleteTransaction.mutate(
        { id },
        {
          onSuccess: () => {
            onClose(id);
          },
        },
      );
    }
  };

  return (
    <div>
      <ConfirmationDialog />
      <Sheet
        open={TransactionOpen}
        onOpenChange={() => {
          return id ? onClose(id) : closeNewSheet();
        }}
      >
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>
              Edit {`${CapTrimEnd("transactions", true)}`}
            </SheetTitle>
            <SheetDescription>
              Update your {`${CapTrimEnd("transactions", true)}`} information
              below:
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <TransactionForm
              onSubmit={onSubmit}
              disabled={isPending}
              accountOptions={accountOptions}
              onAccountCreation={onAccountCreation}
              categoryOptions={categoryOptions}
              onCategoryCreation={onCategoryCreation}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TransactionSheet;
