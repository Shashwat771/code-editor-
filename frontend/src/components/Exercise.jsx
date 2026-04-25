import React, { useState } from 'react';

const Exercise = ({ exercise, onSubmit }) => {
  const [selected, setSelected] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [feedback, setFeedback] = useState(null);

  if (!exercise) return null;

  const isQuiz = typeof exercise === 'object' && exercise.question;

  const handleSubmit = (e) => {
    e && e.preventDefault();
    if (isQuiz) {
      // If no correctIndex provided treat this as a non-graded survey
      if (exercise.correctIndex === undefined || exercise.correctIndex === null) {
        setFeedback({ ok: true, text: 'Answer recorded. Thanks!' });
      } else {
        const correct = exercise.correctIndex === selected;
        setFeedback(correct ? { ok: true, text: 'Correct — well done!' } : { ok: false, text: 'Not quite — try again.' });
      }
    } else {
      setFeedback({ ok: true, text: 'Answer submitted. Good job!' });
    }
    if (onSubmit) onSubmit({ isQuiz, selected, answerText });
  };

  return (
    <div className="professional-card exercise-panel p-4 mt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="exercise-title text-lg font-bold">Exercise</h3>
        {isQuiz && <span className="text-sm text-gray-300">Multiple Choice</span>}
      </div>

      <div className="exercise-desc text-sm mb-3">
        {isQuiz ? (
          <div>
            <p className="mb-3">{exercise.question}</p>
            <form onSubmit={handleSubmit}>
              <div className="space-y-2">
                {exercise.options.map((opt, idx) => (
                  <label key={idx} className="flex items-center gap-3 p-3 bg-white/3 rounded-md">
                    <input
                      type="radio"
                      name="exercise_opt"
                      checked={selected === idx}
                      onChange={() => setSelected(idx)}
                      className="w-4 h-4"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button type="submit" className="btnBlue">Submit Answer »</button>
                <button type="button" onClick={() => { setSelected(null); setFeedback(null); setAnswerText(''); }} className="btnBlue bg-gray-600">Reset</button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <p className="mb-3">{exercise}</p>
            <textarea value={answerText} onChange={(e)=>setAnswerText(e.target.value)} placeholder="Write your answer or steps here..." className="w-full p-3 rounded-md bg-white/5 min-h-[90px]" />
            <div className="mt-3 flex items-center gap-3">
              <button onClick={handleSubmit} className="btnBlue">Submit</button>
            </div>
          </div>
        )}

        {feedback && (
          <div className={`mt-3 p-3 rounded-md ${feedback.ok ? 'bg-emerald-600/20 text-emerald-300' : 'bg-red-600/10 text-red-300'}`}>
            {feedback.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercise;
