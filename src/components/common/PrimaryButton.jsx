export default function PrimaryButton({
  children,
  onClick,
  className = "",
  type = "button",
  disabled,
  icon: Icon,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-white ${className}`}
    >
      {children}
      {Icon && <Icon size={16} />}
    </button>
  );
}
