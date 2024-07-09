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

const useDeleteAccount = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();

  const deleteAccount = async (json: RequestType) => {
    const response = await client.api.accounts[":id"]["$delete"]({
      param: { id },
    });
    return await response.json();
  };

  const onSuccess = () => {
    toast.success("Account Deleted");
    queryClient.invalidateQueries({ queryKey: ["accounts"] });
  };

  const onError = () => {
    toast.error("Failed in delete Account.");
  };

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: deleteAccount,
    onSuccess,
    onError,
  });
};

export default useDeleteAccount;
