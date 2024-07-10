import ResourceType from "@/app/(dashboard)/entities/Resource";
import CapTrimEnd from "@/app/(dashboard)/utilities/CapTrimEnd";

import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

const useDeleteItem = ({ itemName }: ResourceType) => {
  const queryClient = useQueryClient();

  type RequestType = InferRequestType<
    (typeof client.api)[ResourceType["itemName"]][":id"]["$delete"]
  >["param"];
  type ResponseType = InferResponseType<
    (typeof client.api)[ResourceType["itemName"]][":id"]["$delete"]
  >;

  const deleteItem = async ({ id }: RequestType) => {
    const response = await client.api[itemName][":id"]["$delete"]({
      param: { id },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete ${CapTrimEnd(itemName, true)}`);
    }

    return await response.json();
  };

  const onSuccess = () => {
    toast.success(`${CapTrimEnd(itemName, true)} Deleted`);
    queryClient.invalidateQueries({ queryKey: [itemName] });
  };

  const onError = () => {
    toast.error(`Failed to delete ${CapTrimEnd(itemName, true)}.`);
  };

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: deleteItem,
    onSuccess,
    onError,
  });
};

export default useDeleteItem;
