import useConfirm from "@/components/hooks/useConfirm";
import useEditSheet from "@/components/hooks/useEditSheet";
import useSheet from "@/components/hooks/useSheet";
import { useDeleteItem } from "@/app/(dashboard)/hooks/api";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { ItemType } from "@/components/entities/ItemType";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";

interface Props {
  id: string;
  itemName: ItemType;
}

const Actions = ({ id, itemName }: Props) => {
  const { onClose } = useSheet();
  const { onOpen } = useEditSheet();
  const deleteMutation = useDeleteItem(itemName);
  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: `You are about to delete an ${CapTrimEnd(itemName, true)}`,
  });

  const handleDelete = async ({ id }: { id: string }) => {
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
    <>
      <ConfirmationDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={() => onOpen(id)}
          >
            <Edit className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={() => handleDelete({ id })}
          >
            <Trash className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Actions;
