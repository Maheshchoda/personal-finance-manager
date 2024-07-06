import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<typeof client.api.accounts.$post>["json"];
type ResponseType = InferResponseType<typeof client.api.accounts.$post>;

const usePostAccount = () => {
  const queryClient = useQueryClient();

  const createAccount = async (json: RequestType) => {
    const response = await client.api.accounts.$post({ json });
    return await response.json();
  };

  const onSuccess = () => {
    toast.success("Account Created");
    queryClient.invalidateQueries({ queryKey: ["accounts"] });
  };

  const onError = () => {
    toast.error("Failed in creating Account.");
  };

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: createAccount,
    onSuccess,
    onError,
  });
};

export default usePostAccount;
