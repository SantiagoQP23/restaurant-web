import { useState } from "react";
import { useDebounce } from "./useDebounce";

export const useSearch = (delay: number = 300) => {
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, delay); // 500ms debounce
  const handleChangeSearch = (value: string) => {
    setSearch(value);
  };

  return {
    // Getters
    search,
    debouncedSearch,

    // Setters
    setSearch,

    // Handlers
    handleChangeSearch,
  };
};
