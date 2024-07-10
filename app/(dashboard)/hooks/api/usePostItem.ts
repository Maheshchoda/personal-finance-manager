import ResourceType from "@/app/(dashboard)/entities/Resource";
import CapTrimEnd from "@/app/(dashboard)/utilities/CapTrimEnd";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

const usePostItem = ({ itemName }: ResourceType) => {
  const queryClient = useQueryClient();

  type RequestType = InferRequestType<
    (typeof client.api)[ResourceType["itemName"]]["$post"]
  >["json"];
  type ResponseType = InferResponseType<
    (typeof client.api)[ResourceType["itemName"]]["$post"]
  >;

  const createItem = async (json: RequestType) => {
    const response = await client.api[itemName].$post({ json });
    if (!response.ok) {
      throw new Error(`Failed to create ${CapTrimEnd(itemName, true)}`);
    }
    return await response.json();
  };

  const onSuccess = () => {
    toast.success(`${CapTrimEnd(itemName, true)} Created`);
    queryClient.invalidateQueries({ queryKey: ["accounts"] });
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
