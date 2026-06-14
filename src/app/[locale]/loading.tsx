// Static on purpose: special files (loading/not-found) don't receive `params`,
// so calling next-intl here would force dynamic rendering. The label is sr-only.
export default function Loading() {
  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <output
        className="block size-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground"
        aria-label="Loading"
      />
    </main>
  );
}
