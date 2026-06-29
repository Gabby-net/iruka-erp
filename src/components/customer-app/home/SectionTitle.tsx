interface Props {
  title: string;
}

export default function SectionTitle({
  title,
}: Props) {
  return (
    <h2 className="text-2xl font-black text-[#071028] mt-8 mb-4">
      {title}
    </h2>
  );
}