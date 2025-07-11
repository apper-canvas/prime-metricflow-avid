import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const SearchBar = ({ placeholder = "Search...", onSearch, className, ...props }) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <ApperIcon name="Search" size={16} />
      </div>
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-10 pr-4"
        {...props}
      />
    </form>
  );
};

export default SearchBar;