import React, { useRef } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

import { Button } from "./button";
import { Input, type InputProps } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { cn } from "./utils";

interface FormFieldProps extends InputProps {
  id: string;
  label?: string;
  type?: "text" | "email" | "password" | "file" | "textarea";
  placeholder?: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  disabled?: boolean;
  className?: string;
  hint?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  fileButtonText?: string;
  labelClassName?: string;
  accept?: string;
  onFileChange?: (file: File | null) => Promise<void>;
}

export function FormField({
  id,
  label,
  type = "text",
  placeholder,
  registration,
  error,
  disabled = false,
  className = "",
  inputProps,
  textareaProps,
  hint,
  labelClassName,
  fileButtonText = "Choose File",
  accept,
  onFileChange,
}: FormFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;

    if (registration.onChange) registration.onChange(event);
    if (onFileChange) await onFileChange(file);
  };

  if (type === "file") {
    return (
      <div className={`flex flex-col space-y-1 ${className}`}>
        {label && (
          <Label
            htmlFor={id}
            className={cn("text-sm! font-sans! font-medium", labelClassName)}
          >
            {label}
          </Label>
        )}
        {hint && (
          <span className="text-xs !font-normal text-zinc-500">{hint}</span>
        )}
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant={"secondary"}
            onClick={handleFileButtonClick}
            disabled={disabled}
            size={"sm"}
            className="text-xs h-6"
          >
            {fileButtonText}
          </Button>
          <Input
            ref={(e) => {
              fileInputRef.current = e;
              if (registration.ref) {
                registration.ref(e);
              }
            }}
            id={id}
            type="file"
            accept={accept}
            {...inputProps}
            name={registration.name}
            onChange={handleFileChange}
            onBlur={registration.onBlur}
            className="hidden"
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            disabled={disabled}
          />
        </div>
        {error && (
          <p id={`${id}-error`} className="text-xs text-red-500" role="alert">
            {error.message}
          </p>
        )}
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className={`flex flex-col space-y-1 ${className}`}>
        {label && (
          <Label
            htmlFor={id}
            className={cn("text-xs font-sans", labelClassName)}
          >
            {label}
          </Label>
        )}
        {hint && (
          <span className="text-xs !font-normal text-zinc-500">{hint}</span>
        )}
        <Textarea
          id={id}
          placeholder={placeholder}
          {...textareaProps}
          className="text-xs"
          {...registration}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          disabled={disabled}
        />
        {error && (
          <p id={`${id}-error`} className="text-xs text-red-500" role="alert">
            {error.message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      {label && (
        <Label htmlFor={id} className={cn("text-xs font-sans", labelClassName)}>
          {label}
        </Label>
      )}
      <span className="text-xs !font-normal text-zinc-500">{hint}</span>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        {...inputProps}
        className="text-xs h-8"
        {...registration}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        disabled={disabled}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-500" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}
