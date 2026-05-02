export default function TotalIncomingProposals({ value }: { value: number }) {
  return (
    <div className="flex flex-col items-center justify-center border border-zinc-200 bg-zinc-50 lg:col-span-2">
      <p className="text-muted-foreground mb-6 text-xs font-bold uppercase">
        Jumlah Proposal Masuk
      </p>
      <div className="relative flex items-center justify-center">
        <div className="flex size-35 flex-col items-center justify-center border border-zinc-200 bg-white">
          <span className="text-4xl leading-none font-bold text-zinc-900">
            {value}
          </span>
          <span className="text-foreground-muted mt-1 text-xs font-semibold uppercase">
            Proposal
          </span>
        </div>
      </div>
    </div>
  );
}
