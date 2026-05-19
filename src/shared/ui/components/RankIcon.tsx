import { IconMedal, IconRankDot } from '../nano/Icon';

type RankIconProps = {
  rank: number;
};

const medalConfig: Record<number, { className: string; label: string }> = {
  1: { className: 'text-lab-amber drop-shadow-[0_0_6px_rgb(246_184_75_/_0.7)]', label: 'Oro' },
  2: { className: 'text-[#c0c8d0]', label: 'Plata' },
  3: { className: 'text-[#cd8b5a]', label: 'Bronce' },
};

export function RankIcon({ rank }: RankIconProps) {
  const medal = medalConfig[rank];

  if (medal) {
    return (
      <span aria-label={`${medal.label}, puesto ${rank}`} className={`flex items-center justify-center ${medal.className}`} title={medal.label}>
        <IconMedal size={20} />
      </span>
    );
  }

  return (
    <span aria-label={`Puesto ${rank}`} className="flex items-center justify-center text-lab-muted" title={`#${rank}`}>
      <IconRankDot size={20} />
    </span>
  );
}
