import { ItemType } from "@/components/entities/ItemType";
import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";

const { transactions, accounts, categories, summary } = client.api;

// Helper types for response and request data
type InferResponseData<T> = InferResponseType<T, 200>["data"];
type InferRequestData<T> = InferRequestType<T>;

// Types for multiple items
export type MultipleItemResponseType<T extends ItemType> = {
  transactions: InferResponseData<typeof transactions.$get>;
  accounts: InferResponseData<typeof accounts.$get>;
  categories: InferResponseData<typeof categories.$get>;
}[T];

// Types for single items
export type SingleItemResponseType<T extends ItemType> = {
  transactions: InferResponseData<(typeof transactions)[":id"]["$get"]>;
  accounts: InferResponseData<(typeof accounts)[":id"]["$get"]>;
  categories: InferResponseData<(typeof categories)[":id"]["$get"]>;
}[T];

// Types for posting items
export type PostItemRequestType<T extends ItemType> = {
  transactions: InferRequestData<typeof transactions.$post>["json"];
  accounts: InferRequestData<typeof accounts.$post>["json"];
  categories: InferRequestData<typeof categories.$post>["json"];
}[T];

export type PostItemResponseType<T extends ItemType> = {
  transactions: InferResponseType<typeof transactions.$post>;
  accounts: InferResponseType<typeof accounts.$post>;
  categories: InferResponseType<typeof categories.$post>;
}[T];

// Types for editing items
export type PatchItemRequestType<T extends ItemType> = {
  transactions: InferRequestData<
    (typeof transactions)[":id"]["$patch"]
  >["json"];
  accounts: InferRequestData<(typeof accounts)[":id"]["$patch"]>["json"];
  categories: InferRequestData<(typeof categories)[":id"]["$patch"]>["json"];
}[T];

export type PatchItemResponseType<T extends ItemType> = {
  transactions: InferResponseType<(typeof transactions)[":id"]["$patch"]>;
  accounts: InferResponseType<(typeof accounts)[":id"]["$patch"]>;
  categories: InferResponseType<(typeof categories)[":id"]["$patch"]>;
}[T];

// Types for deleting items
export type DeleteItemRequestType<T extends ItemType> = {
  transactions: InferRequestData<
    (typeof transactions)[":id"]["$delete"]
  >["param"];
  accounts: InferRequestData<(typeof accounts)[":id"]["$delete"]>["param"];
  categories: InferRequestData<(typeof categories)[":id"]["$delete"]>["param"];
}[T];

export type DeleteItemResponseType<T extends ItemType> = {
  transactions: InferResponseType<(typeof transactions)[":id"]["$delete"]>;
  accounts: InferResponseType<(typeof accounts)[":id"]["$delete"]>;
  categories: InferResponseType<(typeof categories)[":id"]["$delete"]>;
}[T];

// Types for bulk deleting items
export type BulkDeleteItemRequestType<T extends ItemType> = {
  transactions: InferRequestData<
    (typeof transactions)["bulk-delete"]["$post"]
  >["json"];
  accounts: InferRequestData<(typeof accounts)["bulk-delete"]["$post"]>["json"];
  categories: InferRequestData<
    (typeof categories)["bulk-delete"]["$post"]
  >["json"];
}[T];

export type BulkDeleteItemResponseType<T extends ItemType> = {
  transactions: InferResponseType<
    (typeof transactions)["bulk-delete"]["$post"]
  >;
  accounts: InferResponseType<(typeof accounts)["bulk-delete"]["$post"]>;
  categories: InferResponseType<(typeof categories)["bulk-delete"]["$post"]>;
}[T];

// for getting summary of the homepage.

export type GetSummaryRequestType = InferRequestData<
  typeof summary.$get
>["query"];

export type GetSummaryResponseType = InferResponseData<typeof summary.$get>;
