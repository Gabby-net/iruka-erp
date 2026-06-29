import Image from "next/image";

interface HeroBannerProps {
  title: string;
  subtitle: string;
  image: string;
}

export default function HeroBanner({
  title,
  subtitle,
  image,
}: HeroBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#B45309] to-[#D97706] p-6 text-white shadow-xl">

      <div className="max-w-[60%]">

        <h2 className="text-2xl font-black leading-tight">
          {title}
        </h2>

        <p className="mt-3 text-white/90">
          {subtitle}
        </p>

      </div>

      <div className="absolute right-0 bottom-0">

        <Image
          src={image}
          alt={title}
          width={170}
          height={170}
          className="object-contain"
        />

      </div>

    </div>
  );
}