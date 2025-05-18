import React, { useEffect, useState } from "react";

export default function MandatoryInput({
  label,
  value,
  onChange,
  className = "",
  placeholder = "",
  inputType = "text",
  inputMode = "",
  invalidMessage = "",
}) {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (invalidMessage) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [invalidMessage]);

  return (
    <div className={`${className} d-flex flex-column`}>
      <label className="form-label">{label} *</label>
      <input
        type={inputType}
        {...(inputMode && { inputMode })}
        className={`form-control ${flash ? "flash-red-outline" : ""} ${
          invalidMessage ? "is-invalid" : ""
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {invalidMessage && (
        <div className="invalid-feedback">{invalidMessage}</div>
      )}
    </div>
  );
}
