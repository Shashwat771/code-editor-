import React from 'react'
import { Link } from 'react-router-dom'

const ProblemList = ({ problems }) => {
  return (
    <div className="max-w-4xl mx-auto my-8">
      <h2 className="text-3xl font-bold gradient-text mb-4">Practice Problems</h2>
      <p className="text-gray-300 mb-6">Sharpen your coding skills with these curated problems</p>

      <div className="space-y-4">
        {problems.map(p => (
          <Link key={p.id} to={`/editior/practice-${p.id}`} className="block p-6 rounded-xl glass-strong hover:scale-[1.01] transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">{p.title} <span className="ml-3 text-xs bg-green-600 text-black px-2 py-0.5 rounded-full">{p.difficulty}</span></h3>
                <p className="text-gray-300 mt-2">{p.short}</p>
                <div className="mt-3 flex gap-2 text-xs text-gray-400">
                  {p.tags.map(t => <span key={t} className="px-2 py-1 rounded bg-white/5">{t}</span>)}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-black font-semibold rounded-md shadow hover:scale-[1.02] transition-transform">Solve →</button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ProblemList
