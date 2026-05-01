import { LoginForm } from "./components/login-form";
import { DevQuickLogin } from "./components/dev-quick-login";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export default async function LoginPage() {
  const isDevelopment = process.env.NODE_ENV !== "development";

  return (
    <div className="bg-muted flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="flex flex-col gap-2">
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <div className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="relative flex items-center justify-center">
                    <Button
                      variant="link"
                      size="icon-sm"
                      className="absolute left-0 size-8 p-0"
                      asChild
                    >
                      <Link href="/">
                        <ArrowLeftIcon className="text-muted-foreground size-4" />
                      </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Selamat Datang</h1>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground -mt-4 text-balance">
                      Silahkan login untuk melanjutkan akses aplikasi
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid gap-6">
                  {isDevelopment ? <DevQuickLogin /> : <LoginForm />}
                </div>
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
