import type { TableOfContents } from "@/types";

export type GetTableOfContents = {
  action: "getTableOfContents";
};

export type GetTableOfContentsResponse = {
  action: "getTableOfContents";
  tableOfContents: TableOfContents;
};
