import { ItemType } from "@/components/entities/ItemType";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";

import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<
  (typeof client.api)[ItemType]["bulk-delete"]["$post"]
>["json"];
type ResponseType = InferResponseType<
  (typeof client.api)[ItemType]["bulk-delete"]["$post"]
>;

const useBulkDeleteItems = (itemName: ItemType) => {
  const queryClient = useQueryClient();

  const deleteItem = async (json: RequestType) => {
    const response = await client.api[itemName]["bulk-delete"]["$post"]({
      json,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete ${itemName}`);
    }

    return await response.json();
  };

  const onSuccess = () => {
    toast.success(`${CapTrimEnd(itemName)} Deleted.`);
    queryClient.invalidateQueries({ queryKey: [itemName] });
  };

  const onError = () => {
    toast.error(`Failed to delete ${CapTrimEnd(itemName)}.`);
  };

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: deleteItem,
    onSuccess,
    onError,
  });
};

export default useBulkDeleteItems;
