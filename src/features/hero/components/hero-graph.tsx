"use client";

import { ArrowRightIcon, PauseIcon, PlayIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { LiveGraph } from "@/features/graph";
import { featuredProjects, projects } from "@/features/projects";
import { Link } from "@/i18n/navigation";
import { motionQueries } from "@/lib/gsap";

/** Time each project stays lit during the tour. */
const TOUR_STEP_MS = 3200;
/** Let the hero's entrance finish before the tour starts. */
const TOUR_DELAY_MS = 2600;
/** More than this and the hero card's labels pile up; /graph shows them all. */
const HERO_PROJECT_COUNT = 10;

/** Featured projects first (the tour opens on them), then the newest ones. */
const heroProjects = [
  ...featuredProjects,
  ...projects.filter((project) => !project.featured),
].slice(0, HERO_PROJECT_COUNT);

/**
 * The hero's graph card contents: the live graph, a guided tour that lights
 * one project after another, and a caption naming the lit project with a real
 * link to it — so the graph says something even to a visitor who never points
 * at it (and on phones, where nothing hovers).
 *
 * The tour stops while the pointer is on the graph, while anything in the card
 * has focus (the caption link must not change under the keyboard), when the
 * pause button is pressed, and entirely under reduced motion.
 */
export function HeroGraph() {
  const t = useTranslations("Hero");
  const tGraph = useTranslations("Graph");
  const rootRef = useRef<HTMLDivElement>(null);

  const [hovered, setHovered] = useState<string | null>(null);
  const [step, setStep] = useState(-1);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(motionQueries.reduced);
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) =>
      setOnScreen(entry.isIntersecting),
    );
    io.observe(el);
    // Focus anywhere in the card (the caption link, the pause button) holds
    // the tour, so a link never changes under the keyboard.
    const onFocusIn = () => setFocused(true);
    const onFocusOut = (event: FocusEvent) => {
      if (!el.contains(event.relatedTarget as Node | null)) setFocused(false);
    };
    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);
    return () => {
      io.disconnect();
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  const touring = !reduced && !paused && !focused && !hovered && onScreen;

  // The first step waits for the hero's entrance; resuming (after a hover,
  // focus or pause) moves on right away.
  const startedRef = useRef(false);
  useEffect(() => {
    if (!touring) return;
    const advance = () => setStep((s) => (s + 1) % heroProjects.length);
    // The interval starts with the first step, not alongside its delay, so
    // the first project stays lit as long as the others.
    let interval: number | undefined;
    const first = window.setTimeout(
      () => {
        advance();
        interval = window.setInterval(advance, TOUR_STEP_MS);
      },
      startedRef.current ? 0 : TOUR_DELAY_MS,
    );
    startedRef.current = true;
    return () => {
      window.clearTimeout(first);
      window.clearInterval(interval);
    };
  }, [touring]);

  const tourProject = !reduced && step >= 0 ? heroProjects[step] : undefined;
  const hoveredProject = heroProjects.find((p) => `p:${p.slug}` === hovered);
  const project = hoveredProject ?? tourProject;

  return (
    <div ref={rootRef} className="absolute inset-0">
      {/* Kept clear of the controls (top) and the caption (bottom). */}
      <div className="absolute inset-x-3 top-14 bottom-20">
        <LiveGraph
          projects={heroProjects}
          activeId={project ? `p:${project.slug}` : null}
          onHoverChange={setHovered}
          paused={paused}
        />
      </div>

      {!reduced && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? t("graphPlay") : t("graphPause")}
          className="absolute top-3 left-3 z-10 inline-flex size-9 items-center justify-center rounded-md border bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary/50 hover:text-primary focus-visible:text-primary"
        >
          {paused ? (
            <PlayIcon className="size-4" />
          ) : (
            <PauseIcon className="size-4" />
          )}
        </button>
      )}

      {/* Caption: the lit project, or what the graph is when nothing is lit. */}
      <div className="absolute inset-x-3 bottom-3 flex min-h-14 items-center gap-3 rounded-lg border bg-background/85 px-4 py-2.5 backdrop-blur-sm">
        {project ? (
          <>
            <div className="min-w-0 flex-1">
              <p className="flex items-baseline gap-2">
                <span className="truncate font-semibold">{project.title}</span>
                {project.year && (
                  <span className="shrink-0 text-muted-foreground text-xs tabular-nums">
                    {project.year}
                  </span>
                )}
              </p>
              <p className="truncate text-muted-foreground text-sm">
                {project.tags.slice(0, 4).join(" · ")}
              </p>
            </div>
            <Link
              href={`/projets/${project.slug}`}
              className="group inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 font-medium text-primary text-sm transition-colors hover:bg-primary/10"
            >
              {t("graphOpen")}
              <span className="sr-only">: {project.title}</span>
              <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </>
        ) : (
          <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-1 text-muted-foreground text-sm">
            <p>{t("graphHint")}</p>
            <p className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary" />
                {tGraph("legendProject")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-muted-foreground" />
                {tGraph("legendTech")}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
