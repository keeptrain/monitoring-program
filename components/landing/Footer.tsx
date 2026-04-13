export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        {/* Brand */}
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            DJPB — KKP
          </span>
          <span className="text-xs text-muted-foreground">
            Direktorat Jenderal Perbendaharaan
          </span>
        </div>

        {/* Copyright */}
        <p className="text-xs text-muted-foreground">
          © {year} Kementerian Kelautan dan Perikanan RI. Hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}
