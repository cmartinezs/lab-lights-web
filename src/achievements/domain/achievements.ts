export type AchievementId =
  | 'first-win'
  | 'apprentice'
  | 'researcher'
  | 'expert'
  | 'score-500'
  | 'score-1000'
  | 'score-5000'
  | 'speed-run'
  | 'minimalist'
  | 'dimensional'
  | 'blind-win'
  | 'mirror-win'
  | 'chaos-win'
  | 'chain-win'
  | 'puzzle-5'
  | 'daily-3'
  | 'streak-7'
  | 'coin-1000'
  | 'level-5'
  | 'prestige-1';

export type Achievement = {
  id: AchievementId;
  name: string;
  desc: string;
  icon: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-win',   name: 'Primera luz apagada', desc: 'Gana tu primera partida',               icon: '⚡' },
  { id: 'apprentice',  name: 'Aprendiz de Lab',      desc: 'Gana 10 partidas',                      icon: '🔬' },
  { id: 'researcher',  name: 'Investigador',          desc: 'Gana 50 partidas',                      icon: '🧪' },
  { id: 'expert',      name: 'Experto del Lab',       desc: 'Gana 100 partidas',                     icon: '🏆' },
  { id: 'score-500',   name: 'Puntuación sólida',     desc: 'Alcanza 500 puntos en una partida',     icon: '📊' },
  { id: 'score-1000',  name: 'Puntuación eléctrica',  desc: 'Alcanza 1.000 puntos en una partida',   icon: '⚡' },
  { id: 'score-5000',  name: 'Maestro del puntaje',   desc: 'Alcanza 5.000 puntos en una partida',   icon: '✨' },
  { id: 'speed-run',   name: 'Relámpago',             desc: 'Resuelve en menos de 30 segundos',      icon: '⏱️' },
  { id: 'minimalist',  name: 'Minimalista',            desc: 'Resuelve en 3 movimientos o menos',     icon: '🎯' },
  { id: 'dimensional', name: 'Explorador Dimensional', desc: 'Gana en modo Dimensional',              icon: '🌀' },
  { id: 'blind-win',   name: 'A oscuras',              desc: 'Gana en modo Blind',                    icon: '🙈' },
  { id: 'mirror-win',  name: 'Reflejo perfecto',       desc: 'Gana en modo Mirror',                   icon: '🪞' },
  { id: 'chaos-win',   name: 'Control del caos',       desc: 'Gana en modo Chaos',                    icon: '🌪️' },
  { id: 'chain-win',   name: 'Reacción en cadena',     desc: 'Gana en modo Chain Reaction',           icon: '⛓️' },
  { id: 'puzzle-5',    name: 'Rompecabezas',           desc: 'Resuelve 5 puzzles',                    icon: '🧩' },
  { id: 'daily-3',     name: 'Constante',              desc: 'Completa 3 desafíos diarios',           icon: '📅' },
  { id: 'streak-7',    name: 'Semana completa',         desc: 'Alcanza 7 días de racha',               icon: '🔥' },
  { id: 'coin-1000',   name: 'Coleccionista',           desc: 'Acumula 1.000 monedas',                icon: '💰' },
  { id: 'level-5',     name: 'Progresando',            desc: 'Alcanza el nivel 5',                    icon: '📈' },
  { id: 'prestige-1',  name: 'Prestigio',              desc: 'Alcanza el Prestige 1',                 icon: '⭐' },
];

export function findAchievement(id: AchievementId): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
