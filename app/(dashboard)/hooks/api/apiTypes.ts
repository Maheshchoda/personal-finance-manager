import { ItemType } from "@/components/entities/ItemType";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";

// For multiple items
type InferMultipleItemsType<T> = InferResponseType<T, 200>["data"];

export type MultipleItemsResponseTypes = {
  transactions: InferMultipleItemsType<typeof client.api.transactions.$get>;
  accounts: InferMultipleItemsType<typeof client.api.accounts.$get>;
  categories: InferMultipleItemsType<typeof client.api.categories.$get>;
};

export type MultipleItemsResponseType<T extends ItemType> =
  MultipleItemsResponseTypes[T];

// For single item
type InferSingleItemType<T> = InferResponseType<T, 200>["data"];

export type SingleItemResponseTypes = {
  transactions: InferSingleItemType<
    (typeof client.api.transactions)[":id"]["$get"]
  >;
  accounts: InferSingleItemType<(typeof client.api.accounts)[":id"]["$get"]>;
  categories: InferSingleItemType<
    (typeof client.api.categories)[":id"]["$get"]
  >;
};

export type SingleItemResponseType<T extends ItemType> =
  SingleItemResponseTypes[T];

// For posting item

type InferPostRequestType<T> = InferRequestType<T>;
type InferPostResponseType<T> = InferResponseType<T>;

export type PostItemRequestTypes = {
  transactions: InferPostRequestType<
    typeof client.api.transactions.$post
  >["json"];
  accounts: InferPostRequestType<typeof client.api.accounts.$post>["json"];
  categories: InferPostRequestType<typeof client.api.categories.$post>["json"];
};

export type PostItemResponseTypes = {
  transactions: InferPostResponseType<typeof client.api.transactions.$post>;
  accounts: InferPostResponseType<typeof client.api.accounts.$post>;
  categories: InferPostResponseType<typeof client.api.categories.$post>;
};

export type PostItemRequestType<T extends ItemType> = PostItemRequestTypes[T];
export type PostItemResponseType<T extends ItemType> = PostItemResponseTypes[T];

// For editing item

type InferPatchRequestType<T> = InferRequestType<T>;
type InferPatchResponseType<T> = InferResponseType<T>;

export type PatchItemRequestTypes = {
  transactions: InferPatchRequestType<
    (typeof client.api)["transactions"][":id"]["$patch"]
  >["json"];
  accounts: InferPatchRequestType<
    (typeof client.api)["accounts"][":id"]["$patch"]
  >["json"];
  categories: InferPatchRequestType<
    (typeof client.api)["categories"][":id"]["$patch"]
  >["json"];
};

export type PatchItemResponseTypes = {
  transactions: InferPatchResponseType<
    (typeof client.api)["transactions"][":id"]["$patch"]
  >;
  accounts: InferPatchResponseType<
    (typeof client.api)["accounts"][":id"]["$patch"]
  >;
  categories: InferPatchResponseType<
    (typeof client.api)["categories"][":id"]["$patch"]
  >;
};

export type PatchItemRequestType<T extends ItemType> = PatchItemRequestTypes[T];
export type PatchItemResponseType<T extends ItemType> =
  PatchItemResponseTypes[T];
