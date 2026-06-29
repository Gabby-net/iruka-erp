import Link from "next/link";

interface PrimaryButtonProps {
  title: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}

export default function PrimaryButton({
  title,
  href,
  onClick,
  type = "button",
}: PrimaryButtonProps) {
  if (href) {
    return (
      <Link
        href={href}
        className="w-full h-14 rounded-2xl bg-[#B45309] hover:bg-[#92400E] transition-all duration-300 flex items-center justify-center text-white font-bold text-lg shadow-lg"
      >
        {title}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full h-14 rounded-2xl bg-[#B45309] hover:bg-[#92400E] transition-all duration-300 text-white font-bold text-lg shadow-lg"
    >
      {title}
    </button>
  );
}