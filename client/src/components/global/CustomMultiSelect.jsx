import React from "react";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";

/**
 * CustomMultiSelect component for react-hook-form
 * @param {Object} props
 * @param {import("react-hook-form").Control} props.control
 * @param {string} props.name
 * @param {string} props.label
 * @param {string} [props.placeholder]
 * @param {Array<{label: string, value: string}>} props.options
 * @param {boolean} [props.loading]
 * @param {boolean} [props.disabled]
 */
export function CustomMultiSelect({
  control,
  name,
  label,
  placeholder = "Select options...",
  options,
  loading = false,
  disabled,
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="w-full">
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <MultiSelect
            onValuesChange={field.onChange}
            values={field.value || []} // Ensure it is always an array
          >
            <MultiSelectTrigger
              className="w-full"
              id={name}
              disabled={disabled || loading}
            >
              <MultiSelectValue placeholder={placeholder} />
            </MultiSelectTrigger>
            <MultiSelectContent>
              <MultiSelectGroup>
                {loading ? (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    Loading options...
                  </div>
                ) : options.length === 0 ? (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    No options available
                  </div>
                ) : (
                  options.map((option) => (
                    <MultiSelectItem key={option.value} value={option.value}>
                      {option.label}
                    </MultiSelectItem>
                  ))
                )}
              </MultiSelectGroup>
            </MultiSelectContent>
          </MultiSelect>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
