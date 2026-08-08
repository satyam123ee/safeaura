export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'w-full py-4 rounded-2xl font-semibold transition active:scale-[0.98] disabled:opacity-50';
  const variants = {
    primary: 'bg-brand-gradient text-white',
    outline: 'border border-primary/40 text-white bg-surface/60',
    danger: 'bg-gradient-to-br from-red-500 to-pink-600 text-white',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
