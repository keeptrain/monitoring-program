"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ActionState, login } from "@/features/auth/auth-actions";
import { Loader2Icon } from "lucide-react";

export function LoginForm() {
  const [state, action, isPending] = useActionState<
    ActionState | null,
    FormData
  >(login, null);

  const { errors } = state ?? {};
  const errorsEmail = errors?.email;
  const errorsPassword = errors?.password;
  return (
    <form action={action} className="mt-4 space-y-4">
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          disabled={isPending}
          id="email"
          name="email"
          type="email"
          placeholder="example@domain.com"
          required
          aria-invalid={!!errorsEmail}
        />
        {errorsEmail && <FieldError>{errorsEmail[0]}</FieldError>}
      </Field>
      <Field>
        <div className="flex items-center">
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <a
            href="#"
            className="ml-auto text-xs underline-offset-2 hover:underline"
          >
            Lupa Password?
          </a>
        </div>
        <Input
          disabled={isPending}
          id="password"
          name="password"
          type="password"
          defaultValue={"password123"}
          required
          aria-invalid={!!errorsPassword}
        />
        {errorsPassword && <FieldError>{errorsPassword[0]}</FieldError>}
      </Field>
      <Field>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </Field>
    </form>
  );
}
