import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import useSheet from "@/components/hooks/useSheet";
import usePostAccount from "@/features/accounts/api/usePostAccount";
import AccountForm, {
  FormType,
} from "@/features/accounts/components/AccountForm";

const NewAccountSheet = () => {
  const { isOpen, onClose } = useSheet();
  const mutation = usePostAccount();
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
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new Account to track your transactions.
          </SheetDescription>
        </SheetHeader>
        <AccountForm
          onSubmit={onSubmit}
          defaultValues={{ name: "" }}
          disabled={mutation.isPending}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NewAccountSheet;
