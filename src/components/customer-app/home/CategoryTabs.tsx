"use client";

const tabs = [
  { icon: "🍞", label: "All" },
  { icon: "🥖", label: "Small" },
  { icon: "🥐", label: "Medium" },
  { icon: "🥯", label: "Classic" },
  { icon: "🍞", label: "Jumbo" },
  { icon: "👨‍👩‍👧", label: "Family" },
];

interface Props {
  selected: string;
  onSelect: (value: string) => void;
}

export default function CategoryTabs({
  selected,
  onSelect,
}: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto py-5">

      {tabs.map((tab) => (

        <button
          key={tab.label}
          onClick={() => onSelect(tab.label)}
          className={`px-5 py-3 rounded-full whitespace-nowrap transition-all font-semibold

          ${
            selected === tab.label
              ? "bg-[#B45309] text-white"
              : "bg-white shadow-sm"
          }`}
        >
          {tab.icon} {tab.label}
        </button>

      ))}

    </div>
  );
}