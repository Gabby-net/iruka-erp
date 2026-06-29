"use client";

import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: Props) {
  return (
    <div className="bg-white rounded-full shadow-md h-14 px-5 flex items-center mt-6">

      <Search
        size={20}
        className="text-gray-400"
      />

      <input
        className="flex-1 ml-3 outline-none bg-transparent"
        placeholder="Search your favourite bread..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

    </div>
  );
}