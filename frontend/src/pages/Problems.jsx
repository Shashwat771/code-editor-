import React from 'react'
// no routing params needed; list always rendered
import problems from '../data/problemsData'
import ProblemList from '../components/ProblemList'
const Problems = () => {
  // Always show the list view; clicking "Solve" goes straight to the editor.
  return <ProblemList problems={problems} />
}

export default Problems
