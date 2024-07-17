import { ItemType } from "@/components/entities/ItemType";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";

import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  DeleteItemRequestType as RequestType,
  DeleteItemResponseType as ResponseType,
} from "@/app/(dashboard)/hooks/api/apiTypes";

const useDeleteItem = <T extends ItemType>(itemName: T) => {
  const queryClient = useQueryClient();

  const deleteItem = async ({ id }: RequestType<T>) => {
    const response = await client.api[itemName][":id"]["$delete"]({
      param: { id },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete ${CapTrimEnd(itemName, true)}`);
    }

    const deletedId = await response.json();
    return deletedId as ResponseType<T>;
  };

  const onSuccess = () => {
    toast.success(`${CapTrimEnd(itemName, true)} Deleted`);
    queryClient.invalidateQueries({ queryKey: [itemName] });
    if (itemName !== "transactions") {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    }
  };

  const onError = () => {
    toast.error(`Failed to delete ${CapTrimEnd(itemName, true)}.`);
  };

  return useMutation<ResponseType<T>, Error, RequestType<T>>({
    mutationFn: deleteItem,
    onSuccess,
    onError,
  });
};

export default useDeleteItem;
