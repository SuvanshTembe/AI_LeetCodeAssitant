import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5055;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

if (!GEMINI_API_KEY) {
  // eslint-disable-next-line no-console
  console.warn('[WARN] GEMINI_API_KEY is not set. Requests will fail.');
}
// eslint-disable-next-line no-console
console.log(`[INFO] Using Gemini model: ${GEMINI_MODEL}`);

// Strong CORS for browser preflight from https://leetcode.com
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Max-Age', '86400');
  // Needed for Chrome Private Network Access when calling localhost from https
  res.header('Access-Control-Allow-Private-Network', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  return next();
});
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '1mb' }));

// Serve React app static files
app.use(express.static(path.join(__dirname, '../public')));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/review', async (req, res) => {
  const { code = '', language = '' } = req.body || {};
  if (!code) return res.status(400).json({ error: 'Missing code' });
  try {
    const prompt = buildReviewPrompt(code, language);
    const review = await callGeminiText(prompt);
    res.json({ review });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Review failed', e);
    res.status(500).json({ error: 'Gemini review failed' });
  }
});

app.post('/api/complexity', async (req, res) => {
  const { code = '', language = '' } = req.body || {};
  if (!code) return res.status(400).json({ error: 'Missing code' });
  try {
    let parsed;
    if (!GEMINI_API_KEY) {
      parsed = heuristicComplexity(code, language, 'No GEMINI_API_KEY set; using heuristic.');
    } else {
      const prompt = buildComplexityPrompt(code, language);
      const responseText = await callGeminiText(prompt);
      parsed = safeParseComplexity(responseText);
      if (!parsed?.complexity?.time) {
        parsed = heuristicComplexity(code, language, 'Gemini response unparsable; using heuristic.');
      }
    }
    res.json(parsed);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Complexity failed', e);
    const fallback = heuristicComplexity(req.body.code || '', req.body.language || '', `Error: ${e?.message || e}`);
    res.status(200).json(fallback);
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${PORT}`);
});

function buildReviewPrompt(code, language) {
  return `“You are a LeetCode mentor focused on guided reasoning, not answers. Follow the user’s chosen approach and help them succeed within it when feasible. If their approach is fundamentally incapable of solving the problem, clearly explain why and then present a viable conceptual direction. Otherwise, never replace their approach with a canonical one.

Behavior:

Diagnose from code, errors, and pass/fail counts; infer likely logic gaps, edge/corner cases, complexity issues, and API misuse.

Respond with short hints, probing questions, and conceptual nudges; avoid final algorithms, pseudocode, or full code.

Keep hints minimal-first; escalate only if repeated attempts still fail.

Prioritize teaching why something fails/succeeds over giving what to write.

Assume an intermediate user: concise, technical, respectful tone.

Escalation policy:

Hints: point to specific assumptions, edge cases, or invariant violations to examine.

Guidance: identify concrete failure modes or test patterns; suggest targeted checks or micro-refactors aligned with the user’s approach.

Redirect: only if the approach cannot work, explain the flaw and outline the correct concept at a high level.

Final Solution: provide complete code only on explicit request after multiple failed attempts; label as ‘Final Solution’.

Hard constraints:

Do not reveal full solution logic, step-by-step algorithm, or code unless stage 4 is reached.

Do not switch approaches when the user’s path can solve the problem.

Keep outputs brief, structured, and actionable.”

Implementation notes:

Include this as system_instruction when creating the GenerativeModel.

Keep total prompt+instructions within model token limits

Context:

Programming language: ${language}.

User’s code is provided below solely as context for analysis and hinting. Do not perform a formal “code review” unless explicitly requested.

Code:
${code}`;
}

function buildComplexityPrompt(code, language) {
  return `Given the following ${language || 'code'} submission for a LeetCode problem, analyze and return STRICT JSON with the following shape:
{
  "summary": string, // plain english one paragraph
  "complexity": {
    "time": string, // e.g. O(n log n)
    "space": string, // e.g. O(n)
    "explanation": string // brief explanation of dominant terms
  }
}
Do not include backticks or extra text before/after JSON.

Code:\n\n${code}`;
}

async function callGeminiText(prompt) {
  // Supports Gemini 1.5 text endpoint via Google AI Studio REST
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ]
  };
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Gemini HTTP ${resp.status}: ${text}`);
  }
  const data = await resp.json();
  const candidate = data.candidates && data.candidates[0];
  const parts = candidate && candidate.content && candidate.content.parts;
  const text = parts && parts.map((p) => p.text).join('\n');
  if (!text) throw new Error('Empty Gemini response');
  return text.trim();
}

function safeParseComplexity(text) {
  try {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    const json = JSON.parse(text.slice(start, end + 1));
    return {
      summary: String(json.summary || ''),
      complexity: {
        time: String(json?.complexity?.time || ''),
        space: String(json?.complexity?.space || ''),
        explanation: String(json?.complexity?.explanation || '')
      }
    };
  } catch (e) {
    return {
      summary: 'Failed to parse complexity response.',
      complexity: { time: '', space: '', explanation: '' },
      raw: text
    };
  }
}

function heuristicComplexity(code, language, reason) {
  try {
    const lower = String(code || '').toLowerCase();
    const hasSort = /\bsort\s*\(/.test(lower) || /std::sort|Arrays\.sort|Collections\.sort/.test(code);
    const loops = (code.match(/\bfor\b|\bwhile\b/g) || []).length;

    // crude nested loop detection: two loops within 200 chars
    let nested = false;
    const loopRegex = /(for|while)[\s\S]{0,200}(for|while)/m;
    if (loopRegex.test(code)) nested = true;

    let time = 'O(1)';
    if (hasSort) time = 'O(n log n)';
    else if (nested || loops >= 2) time = 'O(n²)';
    else if (loops === 1) time = 'O(n)';

    let space = 'O(1)';
    const spaceHints = /(new\s+|push_back\(|append\(|add\(|resize\(|vector<|ArrayList<|std::vector<|map<|unordered_map<|HashMap<)/;
    if (spaceHints.test(code)) space = 'O(n)';

    return {
      summary: reason || 'Heuristic estimate based on code patterns.',
      complexity: {
        time,
        space,
        explanation: 'Estimated from loops, sorting calls, and data structure usage.'
      }
    };
  } catch (e) {
    return {
      summary: 'Heuristic failed.',
      complexity: { time: '', space: '', explanation: '' },
      error: String(e)
    };
  }
}


