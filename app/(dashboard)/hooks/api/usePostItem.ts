import { ItemType } from "@/components/entities/ItemType";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  PostItemRequestTypes,
  PostItemRequestType as RequestType,
  PostItemResponseType as ResponseType,
} from "@/app/(dashboard)/hooks/api/apiTypes";
import { toast } from "sonner";

const usePostItem = <T extends ItemType>(itemName: T) => {
  const queryClient = useQueryClient();

  const createItem = async (json: RequestType<T>) => {
    const response =
      itemName === "transactions"
        ? await client.api.transactions.$post({
            json: json as PostItemRequestTypes["transactions"],
          })
        : await client.api[
            itemName as Exclude<typeof itemName, "transactions">
          ].$post({
            json: json as RequestType<Exclude<typeof itemName, "transactions">>,
          });

    if (!response.ok) {
      throw new Error(`Failed to create ${CapTrimEnd(itemName, true)}`);
    }

    const data = await response.json();
    return data as ResponseType<T>;
  };

  const onSuccess = () => {
    const trimmedName = CapTrimEnd(itemName, true);
    toast.success(`${trimmedName} Created`);
    queryClient.invalidateQueries({ queryKey: [itemName] });
  };

  const onError = () => {
    toast.error(`Failed in creating ${CapTrimEnd(itemName, true)}.`);
  };

  return useMutation<ResponseType<T>, Error, RequestType<T>>({
    mutationFn: createItem,
    onSuccess,
    onError,
  });
};

export default usePostItem;
