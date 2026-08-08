export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-surface/60 border border-primary/10 rounded-2xl p-4 ${className}`}>
      {children}
    </div>
  );
}
