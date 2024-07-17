import { ItemType } from "@/components/entities/ItemType";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";

import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  BulkDeleteItemRequestType as RequestType,
  BulkDeleteItemResponseType as ResponseType,
} from "@/app/(dashboard)/hooks/api/apiTypes";

const useBulkDeleteItems = <T extends ItemType>(itemName: T) => {
  const queryClient = useQueryClient();

  const deleteItem = async (json: RequestType<T>) => {
    const response = await client.api[itemName]["bulk-delete"]["$post"]({
      json,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete ${itemName}`);
    }

    return (await response.json()) as ResponseType<T>;
  };

  const onSuccess = () => {
    toast.success(`${CapTrimEnd(itemName)} Deleted.`);
    queryClient.invalidateQueries({ queryKey: [itemName] });
    if (itemName !== "transactions") {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    }
  };

  const onError = () => {
    toast.error(`Failed to delete ${CapTrimEnd(itemName)}.`);
  };

  return useMutation<ResponseType<T>, Error, RequestType<T>>({
    mutationFn: deleteItem,
    onSuccess,
    onError,
  });
};

export default useBulkDeleteItems;
