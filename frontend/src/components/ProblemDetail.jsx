import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProblemDetail = ({ problem }) => {
  const navigate = useNavigate();
  if (!problem) return <div className="max-w-3xl mx-auto mt-8 text-gray-300">Problem not found.</div>

  return (
    <div className="max-w-3xl mx-auto my-8">
      <div className="p-6 glass-strong rounded-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{problem.title}</h2>
          <span className="text-sm bg-green-600 text-black px-3 py-1 rounded-full">{problem.difficulty}</span>
        </div>
        <p className="text-gray-300 mt-4">{problem.description}</p>

        <div className="mt-6">
          <h4 className="text-white font-semibold">Examples</h4>
          <div className="mt-2 space-y-2">
            {problem.examples.map((ex, idx) => (
              <div key={idx} className="p-3 bg-black/30 rounded">
                <div className="text-sm text-gray-300">Input: <span className="text-green-300">{ex.input}</span></div>
                <div className="text-sm text-gray-300">Output: <span className="text-green-300">{ex.output}</span></div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-400">{problem.constraints?.join(' · ')}</div>
          <button onClick={() => navigate(`/editior/practice-${problem.id}`)} className='btnBlue !bg-gradient-to-r !from-green-500 !to-green-600 min-w-[120px]'>Solve</button>
        </div>
      </div>
    </div>
  )
}

export default ProblemDetail
