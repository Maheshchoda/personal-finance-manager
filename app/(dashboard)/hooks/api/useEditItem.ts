import ResourceType from "@/components/entities/Resource";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";

import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

interface Props extends ResourceType {
  id: string;
}

const useEditItem = ({ id, itemName }: Props) => {
  const queryClient = useQueryClient();

  type RequestType = InferRequestType<
    (typeof client.api)[Props["itemName"]][":id"]["$patch"]
  >["json"];
  type ResponseType = InferResponseType<
    (typeof client.api)[Props["itemName"]][":id"]["$patch"]
  >;

  const updateItem = async (json: RequestType) => {
    const response = await client.api[itemName][":id"]["$patch"]({
      param: { id },
      json,
    });

    if (!response.ok) {
      throw new Error(`Failed to update ${CapTrimEnd(itemName, true)}`);
    }

    return await response.json();
  };

  const onSuccess = () => {
    toast.success(`${CapTrimEnd(itemName, true)} Updated.`);
    queryClient.invalidateQueries({
      queryKey: [`${CapTrimEnd(itemName, true)}`, { id }],
    });
    queryClient.invalidateQueries({ queryKey: [itemName] });
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
