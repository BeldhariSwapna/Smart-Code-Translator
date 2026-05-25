import { describe, it, expect, vi } from "vitest";

vi.mock("../services/api.js", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("codeService API functions", () => {
  it("imports without error", async () => {
    const mod = await import("../services/codeService.js");
    expect(mod.translateCode).toBeDefined();
    expect(mod.analyzeComplexity).toBeDefined();
    expect(mod.optimizeCode).toBeDefined();
    expect(mod.explainCode).toBeDefined();
    expect(mod.chatWithAI).toBeDefined();
  });
});
