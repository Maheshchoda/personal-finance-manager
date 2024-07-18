import { usePostItem, useGetItems } from "../hooks/api";

const AccountCategoryOptions = () => {
  const accountMutation = usePostItem("accounts");
  const accountQuery = useGetItems("accounts");
  const onAccountCreation = (name: string) => accountMutation.mutate({ name });
  const accountOptions = (accountQuery.data ?? []).map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const categoryMutation = usePostItem("categories");
  const categoryQuery = useGetItems("categories");
  const onCategoryCreation = (name: string) =>
    categoryMutation.mutate({ name });
  const categoryOptions = (categoryQuery.data ?? []).map((item) => ({
    label: item.name,
    value: item.id,
  }));
  return {
    accountOptions,
    onAccountCreation,
    categoryOptions,
    onCategoryCreation,
  };
};

export default AccountCategoryOptions;
