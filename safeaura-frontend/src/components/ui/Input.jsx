export default function Input({ icon, ...props }) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">{icon}</span>
      )}
      <input
        className="w-full bg-surface/70 border border-primary/20 rounded-2xl py-4 pl-11 pr-4 text-white placeholder-muted focus:outline-none focus:border-primary"
        {...props}
      />
    </div>
  );
}
