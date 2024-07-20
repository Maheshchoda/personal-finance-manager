import { ItemType } from "@/components/entities/ItemType";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  PostItemRequestType as RequestType,
  PostItemResponseType as ResponseType,
} from "@/app/(dashboard)/hooks/api/apiTypes";
import { toast } from "sonner";

const usePostItem = <T extends ItemType>(itemType: T) => {
  const queryClient = useQueryClient();

  const createItem = async (json: RequestType<T>) => {
    const postRequest =
      itemType === "transactions"
        ? client.api.transactions.$post({
            json: json as RequestType<"transactions">,
          })
        : client.api[
            itemType as Exclude<typeof itemType, "transactions">
          ].$post({
            json: json as RequestType<Exclude<typeof itemType, "transactions">>,
          });

    const response = await postRequest;

    if (!response.ok) {
      throw new Error(`Failed to create ${CapTrimEnd(itemType, true)}`);
    }

    const data = await response.json();
    return data as ResponseType<T>;
  };

  const onSuccess = () => {
    const trimmedName = CapTrimEnd(itemType, true);
    toast.success(`${trimmedName} Created`);
    queryClient.invalidateQueries({ queryKey: [itemType] });
  };

  const onError = () => {
    toast.error(`Failed in creating ${CapTrimEnd(itemType, true)}.`);
  };

  return useMutation<ResponseType<T>, Error, RequestType<T>>({
    mutationFn: createItem,
    onSuccess,
    onError,
  });
};

export default usePostItem;
