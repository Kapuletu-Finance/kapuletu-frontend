const AVATAR_COLORS = [
  "bg-[#E67E22]",
  "bg-[#34495E]",
  "bg-[#16A085]",
  "bg-[#8E44AD]",
  "bg-[#283593]",
  "bg-[#C0392B]",
  "bg-[#1E3A8A]",
  "bg-[#0E7C61]",
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
