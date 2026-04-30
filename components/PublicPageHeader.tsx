interface PublicPageHeaderProps {
  label: string;
  title: string;
  children?: React.ReactNode;
}

export default function PublicPageHeader({
  label,
  title,
  children,
}: PublicPageHeaderProps) {
  return (
    <div className="bg-backdrop-blur-sm z-5 bg-white/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4 sm:px-0">
        <div>
          <h2 className="text-xs font-semibold text-zinc-400 uppercase">
            {label}
          </h2>
          <h1 className="font-bold text-zinc-900">{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
