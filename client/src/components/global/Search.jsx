import React from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

/**
 * Search component for filtering lists/tables
 * @param {Object} props
 * @param {string} props.search
 * @param {function} props.setSearch
 * @param {string} props.title
 */
const Search = ({
  search,
  setSearch,
  title,
}) => {
  return (
    <div className="relative w-full md:w-64 font-geist">
      <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
      <Input
        placeholder={`Search ${title}`}
        className="pl-9"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default Search;
