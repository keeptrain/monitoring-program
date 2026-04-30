import { LoginForm } from "./components/login-form";
import { DevQuickLogin } from "./components/dev-quick-login";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export default async function LoginPage() {
  const isDevelopment = process.env.NODE_ENV !== "development";

  return (
    <div className="bg-muted flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="flex flex-col gap-2">
          <Button variant="link" className="w-fit" asChild>
            <Link href="/">
              <ArrowLeftIcon className="mr-1 size-4" />
              Kembali
            </Link>
          </Button>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <div className="p-6 md:p-8">
                <FieldGroup>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Selamat Datang</h1>
                    <p className="text-muted-foreground text-balance">
                      Silahkan login untuk melanjutkan akses aplikasi
                    </p>
                  </div>

                  {isDevelopment ? <DevQuickLogin /> : <LoginForm />}
                </FieldGroup>
              </div>
              <div className="bg-muted hidden items-center justify-center p-10 md:flex">
                <img
                  src="/favicon.webp"
                  alt="Logo"
                  className="size-64 object-contain transition-all hover:scale-105 dark:brightness-[0.8]"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
