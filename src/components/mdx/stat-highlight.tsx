export function StatHighlight({
  value,
  label,
  detail,
}: {
  value: string;
  label: string;
  detail?: string;
}) {
  return (
    <div className="mdx-stat">
      <span className="mdx-stat-value">{value}</span>
      <span className="mdx-stat-label">{label}</span>
      {detail ? <span className="mdx-stat-detail">{detail}</span> : null}
    </div>
  );
}

export function StatRow({ children }: { children: React.ReactNode }) {
  return <div className="mdx-stat-row">{children}</div>;
}
