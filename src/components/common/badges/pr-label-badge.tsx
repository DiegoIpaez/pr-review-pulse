export function PrLabelBadge({
  name,
  color,
}: {
  name: string;
  color: string | null;
}) {
  const hex = color ?? '6b7280';
  return (
    <span
      className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium"
      style={{
        backgroundColor: `#${hex}20`,
        borderColor: `#${hex}40`,
        color: `#${hex}`,
      }}
    >
      {name}
    </span>
  );
}
