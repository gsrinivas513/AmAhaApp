import React, { useState } from 'react';

/**
 * Reusable Input Component
 * Supports text, email, password, number inputs with validation states
 * 
 * Usage:
 * <Input label="Email" type="email" placeholder="Enter email" />
 * <Input label="Password" type="password" error="Password is required" />
 */
export function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  const baseStyles = `
    w-full px-4 py-2.5 text-base font-medium
    border-2 border-gray-200 rounded-lg
    transition-all duration-200
    focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100
    disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
    placeholder:text-gray-400
  `;

  const errorStyles = error ? 'border-error focus:border-error focus:ring-red-100' : '';
  const widthStyle = fullWidth ? 'w-full' : '';

  const containerPadding = icon && iconPosition === 'left' ? 'pl-10' : '';

  return (
    <div className={`flex flex-col gap-2 ${widthStyle}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`${baseStyles} ${errorStyles} ${containerPadding}`}
          {...props}
        />

        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm font-medium text-error">{error}</p>
      )}

      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

export default Input;
