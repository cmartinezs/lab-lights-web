import { animate, stagger, type JSAnimation } from 'animejs';

type TimelineTarget = Parameters<typeof animate>[0];
type TimelineParameters = Parameters<typeof animate>[1];

export function canUseMotion() {
  const root = globalThis.document?.documentElement;
  if (root?.dataset['reducedMotion'] === 'true') return false;

  return !globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

export function animateIfAllowed(targets: TimelineTarget, parameters: TimelineParameters): JSAnimation | null {
  if (!canUseMotion()) {
    return null;
  }

  return animate(targets, parameters);
}

export { stagger };
