import { useDeleteItem } from "@/app/(dashboard)/hooks/api";
import useConfirm from "@/components/hooks/useConfirm";
import useEditSheet from "@/components/hooks/useEditSheet";

import ItemSheet from "@/app/(dashboard)/components/ItemSheet";
import { ItemType } from "@/components/entities/ItemType";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

interface Props {
  id: string;
  itemType: ItemType;
}

const Actions = ({ id, itemType }: Props) => {
  const { onOpen, onClose } = useEditSheet();
  const deleteMutation = useDeleteItem(itemType);
  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: `You are about to delete an ${CapTrimEnd(itemType, true)}`,
  });

  const handleDelete = async ({ id }: { id: string }) => {
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
    <>
      <ItemSheet id={id} itemType={itemType} />
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
