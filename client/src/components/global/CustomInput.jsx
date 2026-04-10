import React from "react";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

/**
 * CustomInput component for react-hook-form
 * @param {Object} props
 * @param {import("react-hook-form").Control} props.control
 * @param {string} props.name
 * @param {string} props.label
 * @param {string} [props.description]
 * @param {boolean} [props.disabled]
 */
export function CustomInput({
  control,
  name,
  label,
  description,
  disabled,
  ...props
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>{label}</FieldLabel>
          <Input {...field} disabled={disabled} {...props} />

          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
