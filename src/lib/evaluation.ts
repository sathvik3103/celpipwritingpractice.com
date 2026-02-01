type EvaluationCategory = {
  title: string;
  evaluation?: string;
  examples?: string;
  score?: string;
  justification?: string;
};

type EvaluationOverall = {
  grade?: string;
  strengths?: string;
  improvements?: string;
};

type EvaluationParseResult = {
  categories: EvaluationCategory[];
  overall?: EvaluationOverall;
};

const categoryLabels: Record<string, keyof EvaluationCategory> = {
  Evaluation: "evaluation",
  Examples: "examples",
  Score: "score",
  Justification: "justification",
};

const overallLabels: Record<string, keyof EvaluationOverall> = {
  "Overall Grade": "grade",
  "Key Strengths": "strengths",
  "Areas for Improvement": "improvements",
};

function appendValue<T extends Record<string, string | undefined>>(
  target: T,
  key: keyof T,
  value: string
) {
  if (!value) return;
  (target as Record<string, string | undefined>)[key as string] = target[key] ? `${target[key]}\n${value}` : value;
}

export function parseEvaluationRaw(raw: string): EvaluationParseResult | null {
  const lines = raw.split(/\r?\n/);
  const categories: EvaluationCategory[] = [];
  let overall: EvaluationOverall | undefined;
  let currentCategory: EvaluationCategory | null = null;
  let currentLabel: { target: "category" | "overall"; key: string } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (currentLabel?.target === "category" && currentCategory) {
        appendValue(currentCategory, currentLabel.key as keyof EvaluationCategory, "");
      } else if (currentLabel?.target === "overall" && overall) {
        appendValue(overall, currentLabel.key as keyof EvaluationOverall, "");
      }
      continue;
    }

    if (trimmed.startsWith("Category:")) {
      if (currentCategory) categories.push(currentCategory);
      const title = trimmed.replace("Category:", "").trim();
      currentCategory = { title };
      currentLabel = null;
      continue;
    }

    const labelMatch = trimmed.match(/^([A-Za-z /]+):\s*(.*)$/);
    if (labelMatch) {
      const label = labelMatch[1].trim();
      const rest = labelMatch[2].trim();
      if (label in categoryLabels && currentCategory) {
        currentLabel = { target: "category", key: categoryLabels[label] };
        appendValue(currentCategory, categoryLabels[label], rest);
        continue;
      }
      if (label in overallLabels) {
        overall ??= {};
        currentLabel = { target: "overall", key: overallLabels[label] };
        appendValue(overall, overallLabels[label], rest);
        continue;
      }
    }

    if (currentLabel?.target === "category" && currentCategory) {
      appendValue(currentCategory, currentLabel.key as keyof EvaluationCategory, trimmed);
    } else if (currentLabel?.target === "overall") {
      overall ??= {};
      appendValue(overall, currentLabel.key as keyof EvaluationOverall, trimmed);
    }
  }

  if (currentCategory) categories.push(currentCategory);

  if (categories.length === 0 && !overall) return null;
  return { categories, overall };
}
