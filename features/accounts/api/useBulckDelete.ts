import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<
  (typeof client.api.accounts)["bulk-delete"]["$post"]
>["json"];
type ResponseType = InferResponseType<
  (typeof client.api.accounts)["bulk-delete"]["$post"]
>;

const useBulkDeleteAccounts = () => {
  const queryClient = useQueryClient();

  const deleteAccount = async (json: RequestType) => {
    const response = await client.api.accounts["bulk-delete"]["$post"]({
      json,
    });

    if (!response.ok) {
      throw new Error("Failed to delete accounts");
    }

    return await response.json();
  };

  const onSuccess = () => {
    toast.success("Accounts Deleted");
    queryClient.invalidateQueries({ queryKey: ["accounts"] });
  };

  const onError = () => {
    toast.error("Failed in delete Accounts.");
  };

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: deleteAccount,
    onSuccess,
    onError,
  });
};

export default useBulkDeleteAccounts;
