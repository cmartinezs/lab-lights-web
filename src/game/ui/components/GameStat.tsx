type GameStatProps = {
  label: string;
  value: string | number;
  highlight?: boolean;
};

export function GameStat({ label, value, highlight = false }: GameStatProps) {
  return (
    <div className={[
      'min-w-0 rounded-panel border px-3 py-2 transition',
      highlight ? 'border-lab-red/60 bg-lab-red/10' : 'border-lab-line bg-lab-bg/70',
    ].join(' ')}>
      <p className="truncate font-mono text-[0.68rem] uppercase text-lab-muted">{label}</p>
      <p className={['mt-1 font-mono text-xl font-black', highlight ? 'text-lab-red' : 'text-lab-text'].join(' ')}>{value}</p>
    </div>
  );
}
