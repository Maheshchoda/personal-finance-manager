import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import useEditSheet from "@/components/hooks/useEditSheet";
import useGetAccount from "@/features/accounts/api/useGetAccount";
import useEditAccount from "@/features/accounts/api/useEditAccount";
import AccountForm, {
  FormType,
} from "@/features/accounts/components/AccountForm";
import { Loader2 } from "lucide-react";

const EditAccountSheet = () => {
  const { id, isOpen, onClose } = useEditSheet();
  const getAccountQuery = useGetAccount({ id });
  const mutation = useEditAccount({ id });

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
            disabled={mutation.isPending}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default EditAccountSheet;
