import type { Heading } from "@/types";

export type GetHeadings = {
  action: "getHeadings";
};

export type GetHeadingsResponse = {
  action: "getHeadings";
  headings: Heading[];
};
