import { ItemType } from "@/components/entities/ItemType";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  PatchItemRequestTypes,
  PatchItemRequestType as RequestType,
  PatchItemResponseType as ResponseType,
} from "@/app/(dashboard)/hooks/api/apiTypes";

interface Props {
  id: string;
  itemName: ItemType;
}

const useEditItem = <T extends ItemType>({ id, itemName }: Props) => {
  const queryClient = useQueryClient();

  const updateItem = async (json: RequestType<T>) => {
    const patchRequest =
      itemName === "transactions"
        ? client.api.transactions[":id"]["$patch"]({
            param: { id },
            json: json as PatchItemRequestTypes["transactions"],
          })
        : client.api[itemName][":id"]["$patch"]({
            param: { id },
            json: json as RequestType<Exclude<typeof itemName, "transactions">>,
          });

    const response = await patchRequest;

    if (!response.ok) {
      throw new Error(`Failed to update ${CapTrimEnd(itemName, true)}`);
    }

    const data = await response.json();
    return data as ResponseType<T>;
  };

  const onSuccess = () => {
    toast.success(`${CapTrimEnd(itemName, true)} Updated.`);
    queryClient.invalidateQueries({
      queryKey: [CapTrimEnd(itemName, true), { id }],
    });
    queryClient.invalidateQueries({ queryKey: [itemName] });
    if (itemName !== "transactions") {
      //to avoid invalidate transactions twice.
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    }
  };

  const onError = () => {
    toast.error(`Failed in updating ${CapTrimEnd(itemName, true)}.`);
  };

  return useMutation<ResponseType<T>, Error, RequestType<T>>({
    mutationFn: updateItem,
    onSuccess,
    onError,
  });
};

export default useEditItem;
