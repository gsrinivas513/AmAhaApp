// src/quiz/ui/QuizQuestion.jsx
export default function QuizQuestion({
  question,
  options,
  selected,
  submitted,
  correctAnswer,
  onSelect,
}) {
  return (
    <>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
        {question}
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {options.map((opt, i) => {
          const isSel = selected === opt;
          const correct = submitted && opt === correctAnswer;
          const wrong = submitted && isSel && !correct;

          let bg = "#fff";
          if (!submitted && isSel) bg = "#eef4ff";
          if (correct) bg = "#e8ffed";
          if (wrong) bg = "#ffecec";

          return (
            <button
              key={i}
              onClick={() => !submitted && onSelect(opt)}
              style={{
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid #e6e6e6",
                background: bg,
                textAlign: "left",
                fontSize: 15,
              }}
            >
              <b style={{ marginRight: 8 }}>
                {String.fromCharCode(65 + i)}.
              </b>
              {opt}
            </button>
          );
        })}
      </div>
    </>
  );
}