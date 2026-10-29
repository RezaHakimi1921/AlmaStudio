type Props = {
  children: React.ReactNode;
  className?: string;
  solid?: boolean;
};

export function GlassCard({ children, className = "", solid = false }: Props) {
  return (
    <div className={`${solid ? "solid-card" : "glass"} ${className}`.trim()}>
      {children}
    </div>
  );
}
