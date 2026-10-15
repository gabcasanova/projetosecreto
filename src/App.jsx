import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 text-slate-100">
      <h1 className="text-4xl font-bold tracking-tight">Vite + React + Tailwind</h1>
      <button
        type="button"
        className="rounded-lg bg-violet-600 px-4 py-2 font-medium hover:bg-violet-500"
        onClick={() => setCount((count) => count + 1)}
      >
        Count is {count}
      </button>
      <p className="text-sm text-slate-400">
        Edit <code className="font-mono">src/App.jsx</code> and save to test HMR
      </p>
    </main>
  )
}

export default App
