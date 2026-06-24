import FieldLabel from "./FieldLabel";

export default function TextField({
  label,
  type = "text",
  icon: Icon,
  value,
  onChange,
  placeholder,
  error,
  rightSlot,
  name,
}) {
  return (
    <div>
      {label ? <FieldLabel>{label}</FieldLabel> : null}
      <div className="relative">
        {Icon ? (
          <Icon
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        ) : null}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-lg border ${error ? "border-rose-300" : "border-slate-200"} bg-white py-2.5 ${Icon ? "pl-9" : "pl-3.5"} ${rightSlot ? "pr-10" : "pr-3.5"} text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100`}
        />
        {rightSlot}
      </div>
      {error ? (
        <p className="mt-1 text-xs font-medium text-rose-500">{error}</p>
      ) : null}
    </div>
  );
}
