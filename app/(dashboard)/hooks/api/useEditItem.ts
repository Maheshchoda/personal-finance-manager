import { ItemType } from "@/components/entities/ItemType";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

interface Props {
  id: string;
  itemName: ItemType;
}

// Define types for request and response
type TransactionRequestType = InferRequestType<
  (typeof client.api)["transactions"][":id"]["$patch"]
>["json"];
type TransactionResponseType = InferResponseType<
  (typeof client.api)["transactions"][":id"]["$patch"]
>;

type DefaultRequestType = InferRequestType<
  (typeof client.api)[Exclude<ItemType, "transactions">][":id"]["$patch"]
>["json"];
type DefaultResponseType = InferResponseType<
  (typeof client.api)[Exclude<ItemType, "transactions">][":id"]["$patch"]
>;

type RequestType = TransactionRequestType | DefaultRequestType;
type ResponseType = TransactionResponseType | DefaultResponseType;

const useEditItem = ({ id, itemName }: Props) => {
  const queryClient = useQueryClient();

  const updateItem = async (json: RequestType) => {
    let response;

    switch (itemName) {
      case "transactions": {
        response = await client.api.transactions[":id"]["$patch"]({
          param: { id },
          json: json as TransactionRequestType,
        });
        break;
      }
      case "accounts":
      case "categories": {
        response = await client.api[itemName][":id"]["$patch"]({
          param: { id },
          json: json as DefaultRequestType,
        });
        break;
      }
      default:
        throw new Error(`Unsupported item type: ${itemName}`);
    }

    if (!response.ok) {
      throw new Error(`Failed to update ${CapTrimEnd(itemName, true)}`);
    }

    return response.json();
  };

  const onSuccess = () => {
    toast.success(`${CapTrimEnd(itemName, true)} Updated.`);
    queryClient.invalidateQueries({
      queryKey: [CapTrimEnd(itemName, true), { id }],
    });
    queryClient.invalidateQueries({ queryKey: [itemName] });
    if (itemName === "accounts") {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    }
  };

  const onError = () => {
    toast.error(`Failed in updating ${CapTrimEnd(itemName, true)}.`);
  };

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: updateItem,
    onSuccess,
    onError,
  });
};

export default useEditItem;
