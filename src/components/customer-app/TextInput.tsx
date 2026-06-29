interface TextInputProps {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export default function TextInput({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: TextInputProps) {
  return (
    <div className="space-y-2">

      <label className="text-sm font-semibold text-[#071028]">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-14 rounded-2xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-[#B45309] transition-all"
      />

    </div>
  );
}