"use client";

import { useState } from "react";
import type { TierQuiz } from "@/data/quizzes";

// Self-contained belt-promotion test. Themed to the AVT portal (black/gold/green).
// Renders questions, grades on submit, teaches on wrong answers, allows retry,
// and calls onPass() once the student clears the threshold.
export default function TierTest({
  quiz,
  onPass,
  onCancel,
}: {
  quiz: TierQuiz;
  onPass: () => void;
  onCancel?: () => void;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [graded, setGraded] = useState(false);

  const total = quiz.questions.length;
  const answeredCount = Object.keys(answers).length;
  const correct = quiz.questions.reduce(
    (n, q, i) => n + (answers[i] === q.answer ? 1 : 0),
    0,
  );
  const needed = Math.ceil(total * quiz.passFraction);
  const passed = graded && correct >= needed;

  function submit() {
    if (answeredCount < total) return;
    setGraded(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function retry() {
    setAnswers({});
    setGraded(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="tt">
      <style>{css}</style>

      <div className="tt-head">
        <p className="tt-eyebrow">Belt promotion test</p>
        <h2 className="tt-title">{quiz.title}</h2>
        <p className="tt-sub">{quiz.subtitle}</p>
        <p className="tt-meta">
          {total} questions · pass {needed}/{total} · unlocks {quiz.unlocks}
        </p>
      </div>

      {graded && (
        <div className={`tt-result ${passed ? "pass" : "fail"}`}>
          <div className="tt-score">
            {correct}<span>/{total}</span>
          </div>
          {passed ? (
            <>
              <p className="tt-result-title">Belt earned. 🥋</p>
              <p className="tt-result-sub">
                You cleared the test — {quiz.unlocks} is unlocked.
              </p>
              <button className="tt-btn tt-btn-go" onClick={onPass}>
                Continue →
              </button>
            </>
          ) : (
            <>
              <p className="tt-result-title">Not quite — {needed} needed.</p>
              <p className="tt-result-sub">
                Review the explanations below, then run it back. No penalty.
              </p>
              <button className="tt-btn tt-btn-retry" onClick={retry}>
                Retake the test
              </button>
            </>
          )}
        </div>
      )}

      <ol className="tt-list">
        {quiz.questions.map((q, i) => {
          const picked = answers[i];
          const isRight = picked === q.answer;
          return (
            <li key={i} className="tt-q">
              <p className="tt-q-text">{q.q}</p>
              <div className="tt-opts">
                {q.options.map((opt, oi) => {
                  const selected = picked === oi;
                  let state = "";
                  if (graded) {
                    if (oi === q.answer) state = "correct";
                    else if (selected) state = "wrong";
                  } else if (selected) {
                    state = "selected";
                  }
                  return (
                    <button
                      key={oi}
                      type="button"
                      className={`tt-opt ${state}`}
                      disabled={graded}
                      onClick={() =>
                        setAnswers((a) => ({ ...a, [i]: oi }))
                      }
                    >
                      <span className="tt-mark" aria-hidden>
                        {graded && oi === q.answer
                          ? "✓"
                          : graded && selected
                          ? "✕"
                          : selected
                          ? "●"
                          : ""}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {graded && (
                <p className={`tt-explain ${isRight ? "ok" : "no"}`}>
                  {q.explain}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {!graded && (
        <div className="tt-actions">
          {onCancel && (
            <button className="tt-btn tt-btn-ghost" onClick={onCancel}>
              Back
            </button>
          )}
          <button
            className="tt-btn tt-btn-submit"
            onClick={submit}
            disabled={answeredCount < total}
          >
            {answeredCount < total
              ? `Answer all ${total} (${answeredCount}/${total})`
              : "Submit test"}
          </button>
        </div>
      )}
    </div>
  );
}

const css = `
  .tt { --tt-gold:#e8b84b; --tt-green:#1db87e; --tt-red:#c94a2a;
    --tt-card:#111; --tt-border:rgba(255,255,255,0.1); --tt-muted:#8f8f8f;
    max-width:640px; margin:0 auto; color:#fff; }
  .tt-head { text-align:center; margin-bottom:1.5rem; }
  .tt-eyebrow { font-size:.62rem; letter-spacing:.2em; text-transform:uppercase; color:var(--tt-gold); margin-bottom:.5rem; }
  .tt-title { font-size:1.6rem; font-weight:800; letter-spacing:-.02em; margin-bottom:.4rem; }
  .tt-sub { font-size:.9rem; color:var(--tt-muted); line-height:1.5; max-width:440px; margin:0 auto .6rem; }
  .tt-meta { font-size:.7rem; letter-spacing:.05em; text-transform:uppercase; color:var(--tt-muted); }

  .tt-result { text-align:center; border-radius:14px; padding:1.5rem; margin-bottom:1.5rem; border:1px solid var(--tt-border); }
  .tt-result.pass { border-color:rgba(29,184,126,.4); background:rgba(29,184,126,.06); }
  .tt-result.fail { border-color:rgba(201,74,42,.4); background:rgba(201,74,42,.05); }
  .tt-score { font-size:2.6rem; font-weight:800; line-height:1; }
  .tt-score span { font-size:1.3rem; color:var(--tt-muted); }
  .tt-result-title { font-size:1.15rem; font-weight:700; margin-top:.4rem; }
  .tt-result-sub { font-size:.85rem; color:var(--tt-muted); margin:.3rem 0 1rem; line-height:1.5; }

  .tt-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:1rem; }
  .tt-q { background:var(--tt-card); border:1px solid var(--tt-border); border-radius:12px; padding:1rem 1.1rem; }
  .tt-q-text { font-size:.98rem; font-weight:600; margin-bottom:.75rem; line-height:1.4; }
  .tt-opts { display:flex; flex-direction:column; gap:.45rem; }
  .tt-opt { display:flex; align-items:center; gap:.6rem; text-align:left; width:100%; padding:.7rem .85rem;
    font-size:.88rem; color:#ddd; background:rgba(255,255,255,0.02); border:1px solid var(--tt-border);
    border-radius:9px; cursor:pointer; transition:border-color .15s, background .15s, transform .1s; }
  .tt-opt:hover:not(:disabled) { border-color:rgba(232,184,75,.5); transform:translateX(2px); }
  .tt-opt:disabled { cursor:default; }
  .tt-opt.selected { border-color:var(--tt-gold); background:rgba(232,184,75,.08); color:#fff; }
  .tt-opt.correct { border-color:var(--tt-green); background:rgba(29,184,126,.12); color:#fff; }
  .tt-opt.wrong { border-color:var(--tt-red); background:rgba(201,74,42,.12); color:#fff; }
  .tt-mark { width:16px; flex-shrink:0; font-size:.8rem; color:var(--tt-gold); text-align:center; }
  .tt-opt.correct .tt-mark { color:var(--tt-green); }
  .tt-opt.wrong .tt-mark { color:var(--tt-red); }
  .tt-explain { font-size:.8rem; line-height:1.55; margin-top:.7rem; padding:.6rem .8rem; border-radius:8px;
    border-left:2px solid var(--tt-border); background:rgba(255,255,255,0.02); color:var(--tt-muted); }
  .tt-explain.ok { border-left-color:var(--tt-green); }
  .tt-explain.no { border-left-color:var(--tt-red); }

  .tt-actions { display:flex; gap:.6rem; justify-content:center; margin-top:1.5rem; }
  .tt-btn { font-family:inherit; font-weight:700; font-size:.9rem; padding:.85rem 1.6rem; border-radius:100px;
    border:none; cursor:pointer; transition:transform .15s, box-shadow .15s, opacity .15s; }
  .tt-btn:disabled { opacity:.5; cursor:not-allowed; }
  .tt-btn-submit, .tt-btn-go { background:var(--tt-gold); color:#000; }
  .tt-btn-submit:not(:disabled):hover, .tt-btn-go:hover { transform:translateY(-2px); box-shadow:0 10px 30px rgba(232,184,75,.25); }
  .tt-btn-retry { background:var(--tt-card); color:var(--tt-gold); border:1px solid rgba(232,184,75,.4); }
  .tt-btn-ghost { background:transparent; color:var(--tt-muted); border:1px solid var(--tt-border); }
  @media (prefers-reduced-motion: reduce) { .tt-opt, .tt-btn { transition:none; } }
`;
