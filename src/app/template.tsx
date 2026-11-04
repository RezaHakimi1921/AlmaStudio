/** Soft fade between pages — opacity only, so fixed bars and glass never jump. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-fade">{children}</div>;
}
