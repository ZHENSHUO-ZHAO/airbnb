import React from "react";

export default function Dropdown({
  label,
  options,
  value,
  onChange,
  className = "",
}) {
  return (
    <div className={className}>
      <label className="form-label">{label}</label>
      <select
        className="form-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt || "Any"}
          </option>
        ))}
      </select>
    </div>
  );
}
