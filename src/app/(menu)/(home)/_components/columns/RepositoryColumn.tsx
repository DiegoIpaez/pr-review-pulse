import { Badge } from '@/components/ui/badge';
import { stringToColor } from '@/utils/stringToColor.util';

export default function RepositoryColumn({
  repository,
}: {
  repository: string;
}) {
  const color = stringToColor(repository);

  return (
    <Badge
      className="border font-medium text-xs text-[var(--color)] bg-[var(--color)]/10"
      style={
        {
          '--color': color,
          borderColor: `${color}33`,
          color: color,
          backgroundColor: `${color}12`,
        } as React.CSSProperties
      }
    >
      {repository}
    </Badge>
  );
}
