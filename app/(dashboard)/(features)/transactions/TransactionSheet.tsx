import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  useDeleteItem,
  useEditItem,
  useGetItem,
  useGetItems,
  usePostItem,
} from "@/app/(dashboard)/hooks/api";
import useConfirm from "@/components/hooks/useConfirm";

import useEditSheet from "@/components/hooks/useEditSheet";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";
import { Loader2 } from "lucide-react";
import TransactionForm, { TransactionApiFormValues } from "./TransactionForm";

const TransactionSheet = ({ id }: { id: string }) => {
  const { newSheetOpen, closeNewSheet, isOpen, onClose } = useEditSheet();
  const TransactionOpen = id ? isOpen(id) : newSheetOpen;
  const newTransaction = usePostItem("transactions");

  const transactionQuery = useGetItem({ id: id, itemName: "transactions" });
  const deleteTransaction = useDeleteItem("transactions");
  const editTransaction = useEditItem({ id: id, itemName: "transactions" });
  const defaultValues = transactionQuery.data
    ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date
          ? new Date(transactionQuery.data.date)
          : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
      }
    : {
        accountId: "",
        categoryId: "",
        amount: "",
        date: new Date(),
        payee: "",
        notes: "",
      };

  const accountMutation = usePostItem("accounts");
  const accountQuery = useGetItems("accounts");
  const onAccountCreation = (name: string) => accountMutation.mutate({ name });
  const accountOptions = (accountQuery.data ?? []).map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const categoryMutation = usePostItem("categories");
  const categoryQuery = useGetItems("categories");
  const onCategoryCreation = (name: string) =>
    categoryMutation.mutate({ name });
  const categoryOptions = (categoryQuery.data ?? []).map((item) => ({
    label: item.name,
    value: item.id,
  }));

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
    if (id) {
      console.log("edit block");
      console.log(values, "from the values");
      editTransaction.mutate(values, {
        onSuccess: () => {
          onClose(id);
        },
      });
    } else {
      console.log("new Block");
      newTransaction.mutate(values, {
        onSuccess: () => {
          closeNewSheet();
        },
      });
    }
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
              id={transactionQuery?.data?.id}
              defaultValues={defaultValues}
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
