export type AdviceBlock = Readonly<{
  kind: "body" | "supplement" | "commonEnd";
  text: string;
  separatorBefore: string;
}>;

export type AdviceParts = readonly AdviceBlock[];

// The closing is a separate block from its creation; no suffix recognition.
export function withCommonEnd(body: string, commonEnd: string): AdviceParts {
  return [
    { kind: "body", text: body, separatorBefore: "" },
    { kind: "commonEnd", text: commonEnd, separatorBefore: "" },
  ];
}

export function withAdviceSupplements(
  parts: AdviceParts,
  supplements: readonly string[],
  commonEnd: string,
): AdviceParts {
  const body = formatAdvice(parts, false).trimEnd();
  return [
    { kind: "body", text: body, separatorBefore: "" },
    ...supplements.map((text): AdviceBlock => ({
      kind: "supplement", text, separatorBefore: "\n\n",
    })),
    { kind: "commonEnd", text: commonEnd, separatorBefore: "\n\n" },
  ];
}

export function formatAdvice(parts: AdviceParts, includeCommonEnd = true): string {
  return parts
    .filter((part) => includeCommonEnd || part.kind !== "commonEnd")
    .map((part) => part.separatorBefore + part.text)
    .join("");
}
