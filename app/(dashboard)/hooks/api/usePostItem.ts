import { ItemType } from "@/components/entities/ItemType";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

const usePostItem = (itemName: ItemType) => {
  const queryClient = useQueryClient();

  // Define types for transactions
  type TransactionRequestType = InferRequestType<
    typeof client.api.transactions.$post
  >["json"];

  type TransactionResponseType = InferResponseType<
    typeof client.api.transactions.$post
  >;

  // Define types for other item types excluding transactions
  type DefaultRequestType = InferRequestType<
    (typeof client.api)[Exclude<ItemType, "transactions">]["$post"]
  >["json"];
  type DefaultResponseType = InferResponseType<
    (typeof client.api)[Exclude<ItemType, "transactions">]["$post"]
  >;

  type RequestType = TransactionRequestType | DefaultRequestType;
  type ResponseType = TransactionResponseType | DefaultResponseType;

  const createItem = async (json: RequestType) => {
    const response =
      itemName === "transactions"
        ? await client.api.transactions.$post({
            json: json as TransactionRequestType,
          })
        : await client.api[itemName].$post({
            json: json as DefaultRequestType,
          });
    if (!response.ok) {
      throw new Error(`Failed to create ${CapTrimEnd(itemName, true)}`);
    }

    return response.json();
  };

  const onSuccess = () => {
    const trimmedName = CapTrimEnd(itemName, true);
    toast.success(`${trimmedName} Created`);
    queryClient.invalidateQueries({ queryKey: [itemName] });
  };

  const onError = () => {
    toast.error(`Failed in creating ${CapTrimEnd(itemName, true)}.`);
  };

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: createItem,
    onSuccess,
    onError,
  });
};

export default usePostItem;
