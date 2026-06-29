import Link from "next/link";

interface SecondaryButtonProps {
  title: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}

export default function SecondaryButton({
  title,
  href,
  onClick,
  type = "button",
}: SecondaryButtonProps) {
  if (href) {
    return (
      <Link
        href={href}
        className="w-full h-14 rounded-2xl border-2 border-[#B45309] text-[#B45309] hover:bg-[#FFF7ED] transition-all duration-300 flex items-center justify-center font-bold text-lg"
      >
        {title}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full h-14 rounded-2xl border-2 border-[#B45309] text-[#B45309] hover:bg-[#FFF7ED] transition-all duration-300 font-bold text-lg"
    >
      {title}
    </button>
  );
}