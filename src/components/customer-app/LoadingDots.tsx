export default function LoadingDots() {
  return (
    <div className="flex items-center justify-center gap-2">

      <div
        className="w-3 h-3 rounded-full bg-[#B45309] animate-bounce"
      />

      <div
        className="w-3 h-3 rounded-full bg-[#B45309] animate-bounce"
        style={{ animationDelay: "0.2s" }}
      />

      <div
        className="w-3 h-3 rounded-full bg-[#B45309] animate-bounce"
        style={{ animationDelay: "0.4s" }}
      />

    </div>
  );
}