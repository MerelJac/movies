import { Grid2x2, List } from "lucide-react";

// Toggles between the "list" and "grid" movie layouts. Controlled by the
// `movieDisplay` state in App.jsx.

const VIEWS = [
  { key: "list", label: "List", Icon: List },
  { key: "grid", label: "Grid", Icon: Grid2x2 },
];

export default function ViewToggle({ value, onChange }) {
  return (
    <div className="view-toggle" role="group" aria-label="Movie layout">
      {VIEWS.map(({ key, label, Icon }) => (
        <button
          key={key}
          type="button"
          className={`view-toggle__button${
            value === key ? " view-toggle__button--active" : ""
          }`}
          aria-pressed={value === key}
          onClick={() => onChange(key)}
        >
          <Icon size={12} />
          {label}
        </button>
      ))}
    </div>
  );
}