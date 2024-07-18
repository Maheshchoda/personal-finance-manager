import { ItemType } from "@/components/entities/ItemType";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";

import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>["json"];
type ResponseType = InferResponseType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>;

const BulkCreateTransactions = (itemType: ItemType) => {
  const queryClient = useQueryClient();

  const bulkCreate = async (json: RequestType) => {
    const response = await client.api["transactions"]["bulk-create"]["$post"]({
      json,
    });

    if (!response.ok) {
      throw new Error(`Failed to create ${itemType}`);
    }

    return await response.json();
  };

  const onSuccess = () => {
    toast.success(`${CapTrimEnd(itemType)} Created.`);
    queryClient.invalidateQueries({ queryKey: [itemType] });
  };

  const onError = () => {
    toast.error(`Failed to create ${CapTrimEnd(itemType)}.`);
  };

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: bulkCreate,
    onSuccess,
    onError,
  });
};

export default BulkCreateTransactions;
