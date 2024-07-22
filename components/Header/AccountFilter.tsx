"use client";
import qs from "query-string";

import { useGetItems } from "@/app/(dashboard)/hooks/api";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const AccountFilter = () => {
  const router = useRouter();
  const pathName = usePathname();

  const params = useSearchParams();
  const accountId = params.get("accountId") || "all";
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const { data: accounts, isLoading: isAccountsLoading } =
    useGetItems("accounts");

  const onAccountChange = (selectedAccount: string) => {
    const query = {
      from,
      to,
      accountId: selectedAccount,
    };

    if (selectedAccount === "all") {
      query.accountId = "";
    }

    const url = qs.stringifyUrl(
      {
        url: pathName,
        query,
      },
      { skipNull: true, skipEmptyString: true },
    );

    router.push(url);
  };

  return (
    <Select
      value={accountId}
      onValueChange={onAccountChange}
      disabled={isAccountsLoading}
    >
      <SelectTrigger className="h-9 w-full rounded-md border-none bg-white/10 px-3 font-normal text-white outline-none transition hover:bg-white/20 hover:text-white focus:bg-white/30 focus:ring-transparent focus:ring-offset-0 lg:w-auto">
        <SelectValue placeholder="Account" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Select Accounts</SelectItem>
        {accounts?.map((account) => (
          <SelectItem value={account.id} key={account.id}>
            {account.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default AccountFilter;
