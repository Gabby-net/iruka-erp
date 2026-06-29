import Image from "next/image";

interface LogoProps {
  size?: number;
}

export default function Logo({
  size = 100,
}: LogoProps) {
  return (
    <div className="flex flex-col items-center">

      <Image
        src="/logo/nkiruka-logo.png"
        alt="IRUKA BREAD"
        width={size}
        height={size}
        priority
      />

      <h1 className="mt-4 text-3xl font-black text-[#B45309]">
        IRUKA BREAD
      </h1>

      <p className="mt-1 text-gray-500 text-center">
        Fresh, Delicious, Irresistible
      </p>

    </div>
  );
}