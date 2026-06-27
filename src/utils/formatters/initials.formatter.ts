export function getInitials(username: string) {
  return username?.slice(0, 2).toUpperCase() ?? '??';
}
