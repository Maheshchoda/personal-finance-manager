import ResourceType from "@/components/entities/Resource";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";

import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

const useBulkDeleteItems = ({ itemName }: ResourceType) => {
  const queryClient = useQueryClient();

  type RequestType = InferRequestType<
    (typeof client.api)[ResourceType["itemName"]]["bulk-delete"]["$post"]
  >["json"];
  type ResponseType = InferResponseType<
    (typeof client.api)[ResourceType["itemName"]]["bulk-delete"]["$post"]
  >;

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
