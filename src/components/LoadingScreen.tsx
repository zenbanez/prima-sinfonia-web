export default function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0B0B14]">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-white/10 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
        {/* Blinking text */}
        <p className="text-slate-400 text-sm font-medium animate-pulse tracking-widest uppercase">{message}</p>
      </div>
    </div>
  );
}