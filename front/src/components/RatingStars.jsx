import React, { useId, useState } from "react";

/**
 * RatingStars – versión simple y robusta (doradas)
 *
 * Props:
 * - value: number (0..max)
 * - onChange: (n:number) => void
 * - max?: number = 5 (poné 10 si querés escala 1..10)
 * - readOnly?: boolean = false
 * - size?: "sm" | "md" | "lg" = "md"
 */
export default function RatingStars({
  value = 0,
  onChange,
  max = 5,
  readOnly = false,
  size = "md",
  name,
}) {
  const uid = useId();
  const [hover, setHover] = useState(0);

  const px = size === "lg" ? 36 : size === "sm" ? 22 : 28;
  const display = hover > 0 ? hover : value;

  const handleKeyDown = (e) => {
    if (readOnly) return;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      onChange?.(Math.min(max, (value || 0) + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      onChange?.(Math.max(0, (value || 0) - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      onChange?.(0);
    } else if (e.key === "End") {
      e.preventDefault();
      onChange?.(max);
    }
  };

  return (
    <div className="inline-flex items-center gap-2 select-none">
      <div
        className="flex items-center gap-1 outline-none"
        role="slider"
        aria-label="Puntaje"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        tabIndex={readOnly ? -1 : 0}
        onKeyDown={handleKeyDown}
        onMouseLeave={() => setHover(0)}
      >
        {Array.from({ length: max }).map((_, i) => {
          const active = display >= i + 1;
          const Star = (
            <svg
              width={px}
              height={px}
              viewBox="0 0 24 24"
              className={`transition-transform duration-150 ${
                active ? "text-amber-400" : "text-gray-300"
              } ${!readOnly ? "group-hover:scale-110" : ""}`}
              aria-hidden
            >
              <path
                fill="currentColor"
                d="M12 2.5l2.9 5.88 6.48.94-4.69 4.57 1.11 6.45L12 17.97 6.2 20.34l1.11-6.45L2.62 9.32l6.48-.94L12 2.5z"
              />
            </svg>
          );

          if (readOnly) {
            return <div key={i} className="group">{Star}</div>;
          }

          return (
            <button
              key={i}
              type="button"
              className="group p-0.5 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
              onMouseEnter={() => setHover(i + 1)}
              onFocus={() => setHover(i + 1)}
              onBlur={() => setHover(0)}
              onClick={() => onChange?.(i + 1)}
              aria-label={`Puntaje ${i + 1}`}
            >
              {Star}
            </button>
          );
        })}
      </div>

      {/* input oculto por si lo necesitás en <form> nativo */}
      {name && <input type="hidden" name={name} value={value} id={`${uid}-hidden`} />}
    </div>
  );
}
