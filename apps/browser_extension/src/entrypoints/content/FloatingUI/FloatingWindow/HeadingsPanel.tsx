import { useRef, useState } from "react";
import { HeadingsList } from "@/components/HeadingsList";
import type { Heading } from "@/types";
import { getHeadings } from "../../collection";

export const HeadingsPanel = ({
  onScrollToElement,
}: {
  onScrollToElement: (xpaths: string[]) => void;
}) => {
  const [levelFilter, setLevelFilter] = useState(7);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setHeadings(getHeadings());
    setLoading(false);
  };

  const loadedRef = useRef(false);
  if (!loadedRef.current) {
    loadedRef.current = true;
    load();
  }

  return (
    <HeadingsList
      onScrollToElement={onScrollToElement}
      onLevelFilterChange={(level) => {
        setLevelFilter(level);
      }}
      levelFilter={levelFilter}
      loading={loading}
      headings={headings}
    />
  );
};
