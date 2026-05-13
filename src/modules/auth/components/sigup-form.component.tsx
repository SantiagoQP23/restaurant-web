import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="name">Nombres</FieldLabel>
            <Input id="name" type="text" placeholder="John Doe" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="lastname">Apellidos</FieldLabel>
            <Input id="lastname" type="text" placeholder="John Doe" required />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="username">Nombre de usuario</FieldLabel>
            <Input id="username" type="text" placeholder="John Doe" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="phone">Celular</FieldLabel>
            <Input id="phone" type="text" placeholder="John Doe" required />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" required />
          <FieldDescription>
            We&apos;ll use this to contact you. We will not share your email
            with anyone else.
          </FieldDescription>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id="password" type="password" required />
            <FieldDescription>
              Must be at least 8 characters long.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
            <Input id="confirm-password" type="password" required />
            <FieldDescription>Please confirm your password.</FieldDescription>
          </Field>
        </div>
        <Field>
          <Button type="submit">Create Account</Button>
        </Field>
        <Field>
          <FieldDescription className="px-6 text-center">
            Already have an account? <a href="#">Sign in</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
