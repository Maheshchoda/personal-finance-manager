import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<
  (typeof client.api.accounts)[":id"]["$patch"]
>["json"];
type ResponseType = InferResponseType<
  (typeof client.api.accounts)[":id"]["$patch"]
>;

const useEditAccount = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();

  const updateAccount = async (json: RequestType) => {
    const response = await client.api.accounts[":id"]["$patch"]({
      param: { id },
      json,
    });
    return await response.json();
  };

  const onSuccess = () => {
    toast.success("Account Updated.");
    queryClient.invalidateQueries({ queryKey: ["account", { id }] });
    queryClient.invalidateQueries({ queryKey: ["accounts"] });
  };

  const onError = () => {
    toast.error("Failed in updating Account.");
  };

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: updateAccount,
    onSuccess,
    onError,
  });
};

export default useEditAccount;
