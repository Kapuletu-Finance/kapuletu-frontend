const AVATAR_COLORS = [
  "bg-primary text-primary-foreground",
  "bg-burnt-amber text-white",
  "bg-refined-blue text-white",
  "bg-secondary text-secondary-foreground",
  "bg-muted text-muted-foreground",
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getAvatarColor(name: string): string {
  return AVATAR_COLORS[hashString(name) % AVATAR_COLORS.length];
}
