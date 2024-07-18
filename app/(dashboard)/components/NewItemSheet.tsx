import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { usePostItem } from "@/app/(dashboard)/hooks/api";

import AccountCategoryOptions from "@/app/(dashboard)/components/AccountCategoryOptions";
import ItemForm, {
  AccountFormValues,
  CategoryFormValues,
  FormSubmitType,
  FormValueSchemaType,
  TransactionFormValues,
} from "@/app/(dashboard)/components/ItemForm";
import { ItemType } from "@/components/entities/ItemType";
import useEditSheet from "@/components/hooks/useEditSheet";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";
import { PostItemRequestType } from "../hooks/api/apiTypes";

const getDefaultValues = <T extends ItemType>(
  itemName: T,
): FormValueSchemaType => {
  if (itemName === "transactions") {
    return {
      date: new Date(),
      accountId: "",
      amount: "",
      payee: "",
      notes: "",
      categoryId: "",
    } as TransactionFormValues;
  } else {
    return {
      name: "",
    } as T extends "accounts" ? AccountFormValues : CategoryFormValues;
  }
};

const NewItemSheet = <T extends ItemType>({ itemName }: { itemName: T }) => {
  const { newSheetOpen, closeNewSheet } = useEditSheet();
  const {
    accountOptions = [],
    categoryOptions = [],
    onAccountCreation = () => {},
    onCategoryCreation = () => {},
  } = itemName === "transactions" ? AccountCategoryOptions() : {};
  const mutation = usePostItem(itemName);
  const onSubmit = (values: FormSubmitType<T>) => {
    if (itemName === "transactions") {
      mutation.mutate(values as PostItemRequestType<T>, {
        onSuccess: () => {
          closeNewSheet();
        },
      });
    } else {
      mutation.mutate(values as PostItemRequestType<T>, {
        onSuccess: () => {
          closeNewSheet();
        },
      });
    }
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
        {itemName === "transactions" ? (
          <ItemForm
            accountOptions={accountOptions}
            categoryOptions={categoryOptions}
            onAccountCreation={onAccountCreation}
            onCategoryCreation={onCategoryCreation}
            mode="create"
            itemName={itemName}
            onSubmit={onSubmit}
            defaultValues={getDefaultValues(itemName)}
            disabled={mutation.isPending}
          />
        ) : (
          <ItemForm
            mode="create"
            itemName={itemName}
            onSubmit={onSubmit}
            defaultValues={getDefaultValues(itemName)}
            disabled={mutation.isPending}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default NewItemSheet;
