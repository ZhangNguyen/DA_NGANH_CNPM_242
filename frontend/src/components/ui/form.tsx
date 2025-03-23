import * as React from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

function Form({ className, ...props }: React.HTMLProps<HTMLFormElement>) {
  return <form className={cn("space-y-4", className)} {...props} />;
}

function FormField({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

function FormItem({ className, ...props }: React.HTMLProps<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1", className)} {...props} />;
}

function FormLabel({ className, ...props }: React.HTMLProps<HTMLLabelElement>) {
  return <label className={cn("text-sm font-medium text-gray-700", className)} {...props} />;
}

function FormControl({
  name,
  children,
  className,
}: {
  name: string;
  children: React.ReactElement;
  className?: string;
}) {
  const { register } = useFormContext();
  return React.cloneElement(children, { ...register(name), className: cn("w-full", className) });
}

export { Form, FormField, FormItem, FormLabel, FormControl };
