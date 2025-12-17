export default function QuizActions({ submitted, onSubmit, onNext }) {
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
      {!submitted ? (
        <button onClick={onSubmit}
          style={{ background: "#6C63FF", color: "#fff" }}>
          Submit
        </button>
      ) : (
        <button onClick={onNext}
          style={{ background: "#4caf50", color: "#fff" }}>
          Next
        </button>
      )}

      <button onClick={onNext}
        style={{ background: "#f5f6fb" }}>
        Skip
      </button>
    </div>
  );
}