import { forwardRef } from "react";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const FormField = forwardRef(({ label, error, className, ...props }, ref) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-300 block">
          {label}
        </label>
      )}
      <Input ref={ref} {...props} />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
});

FormField.displayName = "FormField";

export default FormField;