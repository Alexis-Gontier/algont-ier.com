import { notFound } from "next/navigation";

// Any unmatched path under a locale (e.g. /fr/does-not-exist) renders the
// localized not-found page.
export default function CatchAllPage() {
  notFound();
}
