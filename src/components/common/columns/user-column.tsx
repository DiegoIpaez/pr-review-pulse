import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ExternalLink from '@/components/common/links/external-link';

type UserColumnProps = {
  username: string;
  url: string;
  avatarUrl?: string;
};

export default function UserColumn({
  username,
  url,
  avatarUrl,
}: UserColumnProps) {
  const initials = username?.slice(0, 2).toUpperCase() ?? '??';

  return (
    <span className="inline-flex items-center gap-2">
      <Avatar className="w-5 h-5">
        <AvatarImage src={avatarUrl ?? ''} alt="Avatar" />
        <AvatarFallback className="text-[9px]">{initials}</AvatarFallback>
      </Avatar>
      <ExternalLink href={url}>
        <span className="text-sm">{username}</span>
      </ExternalLink>
    </span>
  );
}
