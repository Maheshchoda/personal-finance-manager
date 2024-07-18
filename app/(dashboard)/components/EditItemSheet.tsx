import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import ItemForm, {
  AccountFormValues,
  CategoryFormValues,
  FormSubmitValues,
  FormValues,
  TransactionFormValues,
} from "@/app/(dashboard)/components/ItemForm";
import {
  useDeleteItem,
  useEditItem,
  useGetItem,
} from "@/app/(dashboard)/hooks/api";
import useConfirm from "@/components/hooks/useConfirm";
import useEditSheet from "@/components/hooks/useEditSheet";

import AccountCategoryOptions from "@/app/(dashboard)/components/AccountCategoryOptions";
import { ItemType } from "@/components/entities/ItemType";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";
import { Loader2 } from "lucide-react";
import {
  PostItemRequestType,
  SingleItemResponseType,
} from "../hooks/api/apiTypes";

type getItemQueryType<T extends ItemType> = SingleItemResponseType<T>;

const EditItemSheet = <T extends ItemType>({
  id,
  itemType,
}: {
  id: string;
  itemType: T;
}) => {
  const { isOpen, closeNewSheet, onClose } = useEditSheet();
  const ItemOpen = isOpen(id);
  const {
    accountOptions = [],
    categoryOptions = [],
    onAccountCreation = () => {},
    onCategoryCreation = () => {},
  } = itemType === "transactions" ? AccountCategoryOptions() : {};
  const getItemQuery = useGetItem<T>({ id, itemType });
  const editMutation = useEditItem({ id, itemType });
  const deleteMutation = useDeleteItem(itemType);
  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: `You are about to delete an ${CapTrimEnd(itemType, true)}.`,
  });

  const getDefaultValues = <T extends ItemType>(itemType: T): FormValues => {
    if (itemType === "transactions") {
      const transaction = getItemQuery.data as getItemQueryType<"transactions">;
      return {
        accountId: transaction.accountId,
        categoryId: transaction.categoryId,
        amount: transaction.amount.toString(),
        date: transaction.date ? new Date(transaction.date) : new Date(),
        payee: transaction.payee,
        notes: transaction.notes,
      } as TransactionFormValues;
    } else {
      const data = getItemQuery.data as getItemQueryType<
        Exclude<ItemType, "transactions">
      >;
      return { name: data.name || "" } as T extends "accounts"
        ? AccountFormValues
        : CategoryFormValues;
    }
  };

  const isPending =
    getItemQuery.isPending ||
    editMutation.isPending ||
    deleteMutation.isPending;

  const onSubmit = (values: FormSubmitValues<T>) => {
    editMutation.mutate(values as PostItemRequestType<T>, {
      onSuccess: () => {
        onClose(id);
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
            onClose(id);
          },
        },
      );
    }
  };

  return (
    <div>
      <ConfirmationDialog />
      <Sheet open={ItemOpen} onOpenChange={() => onClose(id)}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit {`${CapTrimEnd(itemType, true)}`}</SheetTitle>
            <SheetDescription>
              Update your {`${CapTrimEnd(itemType, true)}`} information below:
            </SheetDescription>
          </SheetHeader>
          {getItemQuery.isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : itemType === "transactions" ? (
            <ItemForm
              id={id}
              onDelete={onDelete}
              accountOptions={accountOptions}
              categoryOptions={categoryOptions}
              onAccountCreation={onAccountCreation}
              onCategoryCreation={onCategoryCreation}
              mode="update"
              itemType={itemType}
              onSubmit={onSubmit}
              defaultValues={getDefaultValues(itemType)}
              disabled={isPending}
            />
          ) : (
            <ItemForm
              itemType={itemType}
              mode="update"
              id={id}
              onSubmit={onSubmit}
              defaultValues={getDefaultValues(itemType)}
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
