import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY ?? "" });

export function buildEvaluationPrompt(taskType: string, question: string, answer: string): string {
  return `You are an expert CELPIP writing evaluator. Evaluate the following ${taskType} response using the official CELPIP standards:

Question: ${question}
Answer: ${answer}

For each category, provide:
1. Detailed evaluation of all factors
2. Specific examples from the text
3. Score (0-12) based on CELPIP level descriptors
4. Justification for the score

Categories to evaluate:
1. Content/Coherence:
- Number of ideas
- Quality of ideas
- Organization of ideas
- Examples and supporting details

2. Vocabulary:
- Word choice
- Suitable use of words/phrases
- Range of words/phrases
- Precision and accuracy

3. Readability:
- Format and paragraphing
- Connectors and transitions
- Grammar and sentence structure
- Spelling and punctuation

4. Task Fulfillment:
- Relevance
- Completeness
- Tone
- Word count

For the overall score, round the average score of all the descriptors to the nearest whole number.

Format your response exactly as follows (use these exact labels):

Category: Content/Coherence
Evaluation: [Detailed analysis]
Examples: [From text]
Score: [0-12]
Justification: [Based on level descriptors]

Category: Vocabulary
Evaluation: [Detailed analysis]
Examples: [From text]
Score: [0-12]
Justification: [Based on level descriptors]

Category: Readability
Evaluation: [Detailed analysis]
Examples: [From text]
Score: [0-12]
Justification: [Based on level descriptors]

Category: Task Fulfillment
Evaluation: [Detailed analysis]
Examples: [From text]
Score: [0-12]
Justification: [Based on level descriptors]

Overall Grade: [0-12]
Key Strengths: [List]
Areas for Improvement: [List]`;
}

export async function evaluateWithGroq(taskType: string, question: string, answer: string): Promise<string> {
  const prompt = buildEvaluationPrompt(taskType, question, answer);
  const completion = await client.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    max_tokens: 2000,
  });
  return completion.choices[0]?.message?.content ?? "";
}

export interface ParsedScores {
  scoreOverall: number | null;
  scoreContent: number | null;
  scoreVocabulary: number | null;
  scoreReadability: number | null;
  scoreTaskFulfillment: number | null;
}

export function parseScoresFromEvaluation(text: string): ParsedScores {
  const scores: ParsedScores = {
    scoreOverall: null,
    scoreContent: null,
    scoreVocabulary: null,
    scoreReadability: null,
    scoreTaskFulfillment: null,
  };

  const overallMatch = text.match(/Overall Grade:\s*(\d{1,2})/i);
  if (overallMatch) scores.scoreOverall = Math.min(12, Math.max(0, parseInt(overallMatch[1], 10)));

  const categoryBlocks = text.split(/Category:\s*/i).slice(1);
  for (const block of categoryBlocks) {
    const scoreMatch = block.match(/Score:\s*(\d{1,2})/i);
    const score = scoreMatch ? Math.min(12, Math.max(0, parseInt(scoreMatch[1], 10))) : null;
    if (block.startsWith("Content/Coherence")) scores.scoreContent = score;
    else if (block.startsWith("Vocabulary")) scores.scoreVocabulary = score;
    else if (block.startsWith("Readability")) scores.scoreReadability = score;
    else if (block.startsWith("Task Fulfillment")) scores.scoreTaskFulfillment = score;
  }

  return scores;
}
