import React, { useEffect, useState } from "react";

export default function MandatoryTextInput({
  label,
  value,
  onChange,
  isInvalid,
  className = "",
  placeholder = "",
}) {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (isInvalid) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isInvalid]);

  return (
    <div className={`${className} d-flex flex-column`}>
      <label className="form-label">{label} *</label>
      <input
        type="text"
        className={`form-control ${flash ? "flash-red-outline" : ""} ${
          isInvalid ? "is-invalid" : ""
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <div className="invalid-feedback">{label} is required.</div>
    </div>
  );
}
