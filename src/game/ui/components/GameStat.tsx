type GameStatProps = {
  label: string;
  value: string | number;
};

export function GameStat({ label, value }: GameStatProps) {
  return (
    <div className="min-w-0 rounded-panel border border-lab-line bg-lab-bg/70 px-3 py-2">
      <p className="truncate font-mono text-[0.68rem] uppercase text-lab-muted">{label}</p>
      <p className="mt-1 font-mono text-xl font-black text-lab-text">{value}</p>
    </div>
  );
}
