import { ViewTransition } from "react";

/**
 * Remounts on every navigation between site pages, so its `ViewTransition`
 * plays the page exit/enter (styles in globals.css). `default="none"` keeps it
 * out of unrelated transitions, like the project visual's morph.
 */
export default function SiteTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div className="flex flex-1 flex-col">{children}</div>
    </ViewTransition>
  );
}
