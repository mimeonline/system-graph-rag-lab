"use client";

import { TrackedLink } from "@/components/molecules/tracked-link";
import { StoryChapterThreeVisual } from "@/features/story/molecules/StoryChapterThreeVisual";
import { StoryPerspectiveSwitch } from "@/features/story/molecules/StoryPerspectiveSwitch";
import { StoryProgress } from "@/features/story/molecules/StoryProgress";
import {
    STORY_CHAPTERS,
    type StoryPerspective,
    getPrimaryActionForChapter,
} from "@/features/story/story-flow-model";
import { trackLiteEvent } from "@/lib/analytics-lite";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function GraphRagTechnicalFlow(): React.JSX.Element {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [perspective, setPerspective] = useState<StoryPerspective>("architecture");
  const sectionRef = useRef<HTMLElement>(null);

  const activeChapter = useMemo(() => STORY_CHAPTERS[activeChapterIndex], [activeChapterIndex]);
  const action = useMemo(() => getPrimaryActionForChapter(activeChapterIndex), [activeChapterIndex]);

  const scrollToTop = useCallback(() => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleAdvance = useCallback(() => {
    setActiveChapterIndex((current) => {
      const next = Math.min(current + 1, STORY_CHAPTERS.length - 1);
      if (next !== current) {
        trackLiteEvent("story_chapter_advance", {
          from: current + 1,
          to: next + 1,
          chapter_id: STORY_CHAPTERS[next].id,
          perspective,
        });
      }
      return next;
    });
    setTimeout(scrollToTop, 50);
  }, [perspective, scrollToTop]);

  const handleBack = useCallback(() => {
    setActiveChapterIndex((current) => {
      const prev = Math.max(current - 1, 0);
      if (prev !== current) {
        trackLiteEvent("story_chapter_back", {
          from: current + 1,
          to: prev + 1,
          chapter_id: STORY_CHAPTERS[prev].id,
          perspective,
        });
      }
      return prev;
    });
    setTimeout(scrollToTop, 50);
  }, [perspective, scrollToTop]);

  const handleStepClick = useCallback(
    (index: number) => {
      const next = Math.max(0, Math.min(index, STORY_CHAPTERS.length - 1));
      if (next === activeChapterIndex) {
        return;
      }

      setActiveChapterIndex(next);
      trackLiteEvent("story_chapter_select", {
        from: activeChapterIndex + 1,
        to: next + 1,
        chapter_id: STORY_CHAPTERS[next].id,
        perspective,
      });
      setTimeout(scrollToTop, 50);
    },
    [activeChapterIndex, perspective, scrollToTop],
  );

  const handlePerspectiveChange = useCallback(
    (next: StoryPerspective) => {
      if (next === perspective) {
        return;
      }

      setPerspective(next);
      trackLiteEvent("story_perspective_change", {
        chapter: activeChapter.id,
        perspective: next,
      });
    },
    [activeChapter.id, perspective],
  );

  /* B3: Keyboard navigation */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && activeChapterIndex < STORY_CHAPTERS.length - 1) {
        handleAdvance();
      } else if (e.key === "ArrowLeft" && activeChapterIndex > 0) {
        handleBack();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeChapterIndex, handleAdvance, handleBack]);

  return (
    <section ref={sectionRef} className="space-y-4 rounded-2xl border border-slate-300/80 bg-slate-100/60 p-4 sm:p-5">
      <StoryProgress chapters={STORY_CHAPTERS} activeIndex={activeChapterIndex} onStepClick={handleStepClick} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_330px]">
        {/* Main article with chapter transition animation */}
        <article key={activeChapter.id} className="animate-chapter-enter space-y-4 rounded-xl border border-slate-300/80 bg-white p-4 sm:p-5">
          <header className="space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{`Kapitel ${activeChapterIndex + 1} von ${STORY_CHAPTERS.length}`}</p>
            <h2 className="headline-wrap text-[1.25rem] font-semibold tracking-tight text-slate-950 sm:text-[1.45rem]">{`${activeChapter.label}: ${activeChapter.goal}`}</h2>
          </header>

          {/* A5: Section labels with visual guide – left border accent */}
          <section className="space-y-4 text-sm leading-6 text-slate-700">
            <div className="border-l-2 border-sky-400 pl-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Was in diesem Schritt passiert</p>
              <p className="mt-1">{activeChapter.technicalFlow}</p>
            </div>
            <div className="border-l-2 border-sky-300 pl-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Warum das wichtig ist</p>
              <p className="mt-1">{activeChapter.structuralRelevance}</p>
            </div>
            <div className="border-l-2 border-slate-300 pl-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">So liest du die Visualisierung</p>
              <p className="mt-1">{activeChapter.visualSpec}</p>
            </div>
          </section>

          {/* 3D chapter visual (Three.js) */}
          <StoryChapterThreeVisual chapterId={activeChapter.id} />

          {/* C2: Key insight */}
          <aside className="rounded-lg border border-sky-200/60 bg-sky-50/50 px-4 py-3">
            <p className="text-sm font-medium text-sky-900">
              <span className="mr-1.5">💡</span>
              {activeChapter.keyInsight}
            </p>
          </aside>

          {/* B2: Navigation buttons – Back + Forward */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {activeChapterIndex > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 sm:w-auto"
              >
                ← Zurück
              </button>
            ) : null}

            {action.isDemoLink ? (
              <TrackedLink
                href="/demo"
                label={action.label}
                eventName="story_demo_click"
                payload={{ surface: "graphrag_technical_flow", chapter: activeChapter.id }}
                className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 sm:w-auto"
              />
            ) : (
              <button
                type="button"
                onClick={handleAdvance}
                className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 sm:w-auto"
              >
                {action.label} →
              </button>
            )}
          </div>
        </article>

        {/* Sidebar – Perspektive + Blickwinkel + contextual panels */}
        {/* B1: Sticky on large screens, stretch to article height */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <StoryPerspectiveSwitch perspective={perspective} onChange={handlePerspectiveChange} />

          <section className="rounded-xl border border-slate-300/80 bg-white p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Blickwinkel</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">{activeChapter.perspectiveCopy[perspective]}</p>
          </section>

          {/* Key terms */}
          <section className="rounded-xl border border-slate-300/80 bg-white p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Kernbegriffe</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {activeChapter.keyTerms.map((term) => (
                <span key={term} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                  {term}
                </span>
              ))}
            </div>
          </section>

          {/* Before → After */}
          <section className="rounded-xl border border-slate-300/80 bg-white p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Vorher → Nachher</p>
            <div className="mt-2 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 text-slate-400">○</span>
                <span className="text-slate-500">{activeChapter.beforeAfter.before}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 text-sky-500">●</span>
                <span className="font-medium text-slate-800">{activeChapter.beforeAfter.after}</span>
              </div>
            </div>
          </section>

          {/* Next step hint */}
          <section className="rounded-xl border border-slate-200/80 bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Nächster Schritt</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{activeChapter.nextStepHint}</p>
          </section>
        </aside>
      </div>
    </section>
  );
}
