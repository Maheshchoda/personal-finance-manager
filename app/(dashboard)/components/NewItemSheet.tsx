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
  FormSubmitValues,
  FormValues,
  TransactionFormValues,
} from "@/app/(dashboard)/components/ItemForm";
import { ItemType } from "@/components/entities/ItemType";
import useEditSheet from "@/components/hooks/useEditSheet";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";
import { PostItemRequestType } from "../hooks/api/apiTypes";

const getDefaultValues = <T extends ItemType>(itemType: T): FormValues => {
  if (itemType === "transactions") {
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

const NewItemSheet = <T extends ItemType>({ itemType }: { itemType: T }) => {
  const { newSheetOpen, closeNewSheet } = useEditSheet();
  const {
    accountOptions = [],
    categoryOptions = [],
    onAccountCreation = () => {},
    onCategoryCreation = () => {},
  } = itemType === "transactions" ? AccountCategoryOptions() : {};
  const mutation = usePostItem(itemType);
  const onSubmit = (values: FormSubmitValues<T>) => {
    if (itemType === "transactions") {
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
          <SheetTitle>New {CapTrimEnd(itemType, true)}</SheetTitle>
          <SheetDescription>
            Create a new entry to keep track of your{" "}
            {CapTrimEnd(itemType, true)}.
          </SheetDescription>
        </SheetHeader>
        {itemType === "transactions" ? (
          <ItemForm
            accountOptions={accountOptions}
            categoryOptions={categoryOptions}
            onAccountCreation={onAccountCreation}
            onCategoryCreation={onCategoryCreation}
            mode="create"
            itemType={itemType}
            onSubmit={onSubmit}
            defaultValues={getDefaultValues(itemType)}
            disabled={mutation.isPending}
          />
        ) : (
          <ItemForm
            mode="create"
            itemType={itemType}
            onSubmit={onSubmit}
            defaultValues={getDefaultValues(itemType)}
            disabled={mutation.isPending}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default NewItemSheet;
