import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<
  (typeof client.api.accounts)[":id"]["$delete"]
>["param"];
type ResponseType = InferResponseType<
  (typeof client.api.accounts)[":id"]["$delete"]
>;

const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  const deleteAccount = async ({ id }: RequestType) => {
    const response = await client.api.accounts[":id"]["$delete"]({
      param: { id },
    });

    if (!response.ok) {
      throw new Error("Failed to delete account");
    }

    return await response.json();
  };

  const onSuccess = () => {
    toast.success("Account Deleted");
    queryClient.invalidateQueries({ queryKey: ["accounts"] });
  };

  const onError = () => {
    toast.error("Failed to delete Account.");
  };

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: deleteAccount,
    onSuccess,
    onError,
  });
};

export default useDeleteAccount;
