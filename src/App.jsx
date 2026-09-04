import { useMemo, useState } from 'react'

const teams = [
  { id: 'A', name: 'TEAM A', accent: 'border-cyan-400 bg-cyan-400/10 text-cyan-100' },
  { id: 'B', name: 'TEAM B', accent: 'border-fuchsia-400 bg-fuchsia-400/10 text-fuchsia-100' },
]

const actions = [
  { id: 'two', label: '+2', detail: 'POINTS', voice: 'two points, made', tone: 'bg-slate-800 hover:bg-slate-700' },
  { id: 'three', label: '+3', detail: 'POINTS', voice: 'three points, made', tone: 'bg-slate-800 hover:bg-slate-700' },
  { id: 'freeThrow', label: 'FT', detail: 'FREE THROW', voice: 'free throw, made', tone: 'bg-slate-800 hover:bg-slate-700' },
  { id: 'foul', label: 'F', detail: 'FOUL', voice: 'foul', tone: 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-100 ring-1 ring-inset ring-amber-400/40' },
]

function speak(text) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = 0.9
  utterance.pitch = 1
  window.speechSynthesis.speak(utterance)
}

export default function App() {
  const [entries, setEntries] = useState([])
  const [lastAction, setLastAction] = useState('Ready for a new play.')

  const scores = useMemo(
    () => entries.reduce((result, entry) => ({
      ...result,
      [entry.team]: result[entry.team] + (entry.action.id === 'two' ? 2 : entry.action.id === 'three' ? 3 : entry.action.id === 'freeThrow' ? 1 : 0),
    }), { A: 0, B: 0 }),
    [entries],
  )

  function recordAction(team, action) {
    const entry = { id: crypto.randomUUID(), team, action, timestamp: new Date() }
    const text = `${team}, ${action.voice}`
    setEntries((current) => [...current, entry])
    setLastAction(text)
    speak(text)
  }

  function correctLastEntry() {
    if (!entries.length) {
      setLastAction('No entries to cancel.')
      speak('No entries to cancel')
      return
    }
    setEntries((current) => current.slice(0, -1))
    setLastAction('Correction, cancel last entry')
    speak('Correction, cancel last entry')
  }

  return (
    <main className="min-h-screen bg-[#090d1a] text-white selection:bg-cyan-300 selection:text-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:py-8">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-bold tracking-[0.24em] text-cyan-300">LIVE SPORTS CAPTURE</p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">TAP-BOARD</h1>
          </div>
          <div className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300">
            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />LIVE INPUT
          </div>
        </header>

        <section aria-labelledby="training-title" className="mb-6 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-panel">
          <div className="flex items-center justify-between px-4 py-3 sm:px-5">
            <div>
              <h2 id="training-title" className="font-bold">Training simulator</h2>
              <p className="text-sm text-slate-400">Watch the game and capture every play in real time.</p>
            </div>
            <span className="hidden rounded-md bg-cyan-400/10 px-2.5 py-1 text-xs font-bold text-cyan-300 sm:block">PRACTICE MODE</span>
          </div>
          <div className="aspect-video bg-black">
            <iframe
              className="h-full w-full"
              src="https://www.youtube-nocookie.com/embed/Nh3VSwZUd1E"
              title="Basketball training video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </section>

        <section aria-label="Current score" className="mb-6 grid grid-cols-2 gap-3">
          {teams.map((team) => (
            <div key={team.id} className={`rounded-xl border p-4 ${team.accent}`}>
              <p className="text-xs font-bold tracking-[0.18em] opacity-75">{team.name}</p>
              <p className="mt-1 text-4xl font-black tabular-nums">{scores[team.id]}</p>
            </div>
          ))}
        </section>

        <section aria-label="Action capture controls" className="grid gap-5 lg:grid-cols-2">
          {teams.map((team) => (
            <article key={team.id} className="rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-panel sm:p-5">
              <h2 className={`mb-4 rounded-xl border px-4 py-3 text-center text-xl font-black tracking-wider ${team.accent}`}>{team.name}</h2>
              <div className="grid grid-cols-2 gap-3">
                {actions.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => recordAction(team.id, action)}
                    className={`min-h-28 rounded-xl px-3 py-4 text-center font-black shadow-lg transition active:scale-[0.97] focus:outline-none focus:ring-4 focus:ring-cyan-300/40 ${action.tone}`}
                  >
                    <span className="block text-4xl leading-none">{action.label}</span>
                    <span className="mt-2 block text-xs tracking-[0.14em]">{action.detail}</span>
                  </button>
                ))}
              </div>
            </article>
          ))}
        </section>

        <button type="button" onClick={correctLastEntry} className="mt-5 flex min-h-16 w-full items-center justify-center gap-3 rounded-xl bg-rose-500 px-4 text-base font-black tracking-wide text-white shadow-lg shadow-rose-950/30 transition hover:bg-rose-400 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-rose-300/50">
          <span aria-hidden="true" className="text-2xl">↶</span> CORRECTION / CANCEL
        </button>

        <section aria-live="polite" aria-atomic="true" className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-panel sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold">Last recorded action</h2>
            <span className="text-xs font-semibold tracking-[0.12em] text-slate-500">EVENT LOG</span>
          </div>
          <p className="mt-3 rounded-xl bg-slate-800 px-4 py-4 text-lg font-semibold text-cyan-100">{lastAction}</p>
          {entries.length > 0 && <p className="mt-3 text-sm text-slate-400">{entries.length} captured {entries.length === 1 ? 'event' : 'events'} in this session.</p>}
        </section>
      </div>
    </main>
  )
}
