import { ItemType } from "@/components/entities/ItemType";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";

import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  BulkDeleteItemRequestType as RequestType,
  BulkDeleteItemResponseType as ResponseType,
} from "@/app/(dashboard)/hooks/api/apiTypes";

const useBulkDeleteItems = <T extends ItemType>(itemType: T) => {
  const queryClient = useQueryClient();

  const deleteItem = async (json: RequestType<T>) => {
    const response = await client.api[itemType]["bulk-delete"]["$post"]({
      json,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete ${itemType}`);
    }

    return (await response.json()) as ResponseType<T>;
  };

  const onSuccess = () => {
    toast.success(`${CapTrimEnd(itemType)} Deleted.`);
    queryClient.invalidateQueries({ queryKey: [itemType] });
    if (itemType !== "transactions") {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    }
    queryClient.invalidateQueries({ queryKey: ["summary"] });
  };

  const onError = () => {
    toast.error(`Failed to delete ${CapTrimEnd(itemType)}.`);
  };

  return useMutation<ResponseType<T>, Error, RequestType<T>>({
    mutationFn: deleteItem,
    onSuccess,
    onError,
  });
};

export default useBulkDeleteItems;
