import { ItemType } from "@/components/entities/ItemType";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";

import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

const transactionPostClient = client.api.transactions["bulk-create"]["$post"];

type RequestType = InferRequestType<typeof transactionPostClient>["json"];
type ResponseType = InferResponseType<typeof transactionPostClient>;

const BulkCreateTransactions = (itemType: ItemType) => {
  const queryClient = useQueryClient();

  const bulkCreate = async (json: RequestType) => {
    const response = await transactionPostClient({
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
    queryClient.invalidateQueries({ queryKey: ["summary"] });
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
