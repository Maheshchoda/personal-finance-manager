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
  FormSubmitType,
  FormValueSchemaType,
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
  itemName,
}: {
  id: string;
  itemName: T;
}) => {
  const { isOpen, closeNewSheet, onClose } = useEditSheet();
  const ItemOpen = isOpen(id);
  const {
    accountOptions = [],
    categoryOptions = [],
    onAccountCreation = () => {},
    onCategoryCreation = () => {},
  } = itemName === "transactions" ? AccountCategoryOptions() : {};
  const getItemQuery = useGetItem<T>({ id, itemName });
  const editMutation = useEditItem({ id, itemName });
  const deleteMutation = useDeleteItem(itemName);
  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: `You are about to delete an ${CapTrimEnd(itemName, true)}.`,
  });

  const getDefaultValues = <T extends ItemType>(
    itemName: T,
  ): FormValueSchemaType => {
    if (itemName === "transactions") {
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

  const onSubmit = (values: FormSubmitType<T>) => {
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
            <SheetTitle>Edit {`${CapTrimEnd(itemName, true)}`}</SheetTitle>
            <SheetDescription>
              Update your {`${CapTrimEnd(itemName, true)}`} information below:
            </SheetDescription>
          </SheetHeader>
          {getItemQuery.isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : itemName === "transactions" ? (
            <ItemForm
              id={id}
              onDelete={onDelete}
              accountOptions={accountOptions}
              categoryOptions={categoryOptions}
              onAccountCreation={onAccountCreation}
              onCategoryCreation={onCategoryCreation}
              mode="update"
              itemName={itemName}
              onSubmit={onSubmit}
              defaultValues={getDefaultValues(itemName)}
              disabled={isPending}
            />
          ) : (
            <ItemForm
              itemName={itemName}
              mode="update"
              id={id}
              onSubmit={onSubmit}
              defaultValues={getDefaultValues(itemName)}
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
