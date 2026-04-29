"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { Loader2Icon, LogInIcon } from "lucide-react";
import { login } from "@/features/auth/auth-actions";

export default function LoginButton() {
  const [isPending, startTransition] = useTransition();
  const handleLogin = () => {
    startTransition(async () => {
      await login();
    });
  };
  return (
    <Button size="sm" onClick={handleLogin} disabled={isPending}>
      {isPending ? (
        <Loader2Icon className="mr-1 size-4 animate-spin" />
      ) : (
        <LogInIcon className="mr-1 size-4" />
      )}
      Masuk
    </Button>
  );
}
