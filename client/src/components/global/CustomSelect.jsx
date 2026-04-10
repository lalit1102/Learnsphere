import React from "react";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

/**
 * CustomSelect component for react-hook-form
 * @param {Object} props
 * @param {import("react-hook-form").Control} props.control
 * @param {string} props.name
 * @param {string} props.label
 * @param {string} [props.placeholder]
 * @param {Array<{label: string, value: string}>} props.options
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.loading]
 */
export function CustomSelect({
  control,
  name,
  label,
  placeholder = "Select...",
  options,
  disabled,
  loading = false,
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Select
            onValueChange={field.onChange}
            // Handle empty strings gracefully so placeholder shows
            value={field.value || undefined}
            disabled={disabled}
          >
            <SelectTrigger id={name}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {loading && <SelectItem value="loading">Loading...</SelectItem>}
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
