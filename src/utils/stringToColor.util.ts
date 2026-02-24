function hashToHue(str: string): number {
  let hash = 0;

  for (let letter = 0; letter < str.length; letter++) {
    hash = (hash << 5) - hash + str.charCodeAt(letter);
    hash |= 0;
  }

  return Math.abs(hash) % 360;
}

export function stringToColor(
  value: string,
  options?: { saturation?: number; lightness?: number }
): string {
  const { saturation = 65, lightness = 55 } = options ?? {};

  const normalized = value.trim().toLowerCase();
  const hue = hashToHue(normalized);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
