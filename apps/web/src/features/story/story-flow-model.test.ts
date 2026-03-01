import { describe, expect, it } from "vitest";
import {
  STORY_CHAPTERS,
  type StoryPerspective,
  getPrimaryActionForChapter,
} from "@/features/story/story-flow-model";

describe("story flow model", () => {
  it("contains exactly five chapters in the expected order", () => {
    expect(STORY_CHAPTERS).toHaveLength(5);
    expect(STORY_CHAPTERS.map((chapter) => chapter.id)).toEqual([
      "question",
      "retrieval",
      "graph",
      "synthesis",
      "action",
    ]);
  });

  it("contains goal, technical flow and structural relevance for each chapter", () => {
    for (const chapter of STORY_CHAPTERS) {
      expect(chapter.goal.length).toBeGreaterThan(0);
      expect(chapter.technicalFlow.length).toBeGreaterThan(0);
      expect(chapter.structuralRelevance.length).toBeGreaterThan(0);
    }
  });

  it("contains perspective copy for architecture, product and governance", () => {
    const perspectives: StoryPerspective[] = ["architecture", "product", "governance"];

    for (const chapter of STORY_CHAPTERS) {
      for (const perspective of perspectives) {
        expect(chapter.perspectiveCopy[perspective].length).toBeGreaterThan(0);
      }
    }
  });

  it("uses three.js only for chapter three and svg for all other chapters", () => {
    expect(STORY_CHAPTERS[2]?.visualMode).toBe("three");

    expect(
      STORY_CHAPTERS.filter((chapter) => chapter.id !== "graph").every((chapter) => chapter.visualMode === "svg"),
    ).toBe(true);
  });

  it("returns Weiter for chapter 1-4 and Zur Demo for chapter 5", () => {
    for (let index = 0; index < 4; index += 1) {
      expect(getPrimaryActionForChapter(index)).toEqual({ label: "Weiter", isDemoLink: false });
    }

    expect(getPrimaryActionForChapter(4)).toEqual({ label: "Zur Demo", isDemoLink: true });
  });
});
