import { useState, useEffect, useRef } from 'react'

// ─── Design Tokens (injected as a style tag) ──────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:          #080c10;
      --bg2:         #0d1117;
      --bg3:         #161b22;
      --border:      #21262d;
      --border2:     #30363d;
      --text:        #e6edf3;
      --muted:       #7d8590;
      --dim:         #484f58;
      --low:         #3fb950;
      --low-bg:      #0d2119;
      --low-border:  #196127;
      --med:         #d29922;
      --med-bg:      #2d1f03;
      --med-border:  #7d4e00;
      --high:        #f85149;
      --high-bg:     #2d0b0b;
      --high-border: #a1261d;
      --accent:      #58a6ff;
      --accent2:     #1f6feb;
      --mono:        'Space Mono', monospace;
      --sans:        'DM Sans', sans-serif;
      --radius:      6px;
      --radius-lg:   10px;
    }

    html { font-size: 16px; }

    body {
      font-family: var(--sans);
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg2); }
    ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }
    .fade-up { animation: fadeUp 0.4s ease both; }
  `}</style>
)

// ─── Constants ────────────────────────────────────────────────────────────────
const LEVEL_CONFIG = {
  low:    { color: 'var(--low)',  bg: 'var(--low-bg)',  border: 'var(--low-border)',  label: 'LOW RISK',    icon: '▲' },
  medium: { color: 'var(--med)', bg: 'var(--med-bg)',  border: 'var(--med-border)',  label: 'MEDIUM RISK', icon: '◆' },
  high:   { color: 'var(--high)', bg: 'var(--high-bg)', border: 'var(--high-border)', label: 'HIGH RISK',   icon: '■' },
}

const TODAY = new Date().toISOString().split('T')[0]

const INITIAL_FORM = {
  release_name:       'v2.1.0',
  release_date:       TODAY,
  deployment_env:     'production',
  change_size:        'medium',
  test_coverage:      78,
  previous_incidents: 1,
  team_size:          4,
  changed_components: 'auth, payment',
  has_rollback_plan:  true,
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page,    setPage]    = useState('assess')
  const [history, setHistory] = useState([])

  function addToHistory(result) {
    setHistory(prev => [result, ...prev].slice(0, 20))
  }

  return (
    <>
      <GlobalStyles />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header page={page} setPage={setPage} />
        <main style={{
          flex: 1, maxWidth: 1100, margin: '0 auto',
          padding: '2rem 1.5rem', width: '100%'
        }}>
          {page === 'assess'  && <AssessPage  onResult={addToHistory} />}
          {page === 'history' && <HistoryPage history={history} />}
        </main>
        <footer style={{
          borderTop: '1px solid var(--border)',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: 'var(--muted)',
          fontFamily: 'var(--mono)'
        }}>
          <span>RELEASE RISK ASSESSOR v1.0.0</span>
          <span>CSE3253 DevOps [PE6] · 2025-2026</span>
        </footer>
      </div>
    </>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ page, setPage }) {
  return (
    <header style={{
      background: 'var(--bg2)',
      borderBottom: '1px solid var(--border)',
      padding: '0.85rem 2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
          stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4" stroke="var(--low)" strokeWidth="1.5"/>
        </svg>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.02em' }}>
            Release Risk Assessor
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'var(--mono)', letterSpacing: '0.05em' }}>
            CSE3253 DevOps [PE6]
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', gap: '0.25rem', marginLeft: 'auto' }}>
        {[
          { id: 'assess',  label: '⬡ Assess' },
          { id: 'history', label: '≡ History' },
        ].map(({ id, label }) => (
          <button key={id} onClick={() => setPage(id)} style={{
            background:   page === id ? 'rgba(31,111,235,0.1)' : 'transparent',
            border:       `1px solid ${page === id ? 'var(--accent2)' : 'transparent'}`,
            color:        page === id ? 'var(--accent)' : 'var(--muted)',
            padding:      '0.4rem 0.9rem',
            borderRadius: 'var(--radius)',
            fontFamily:   'var(--mono)',
            fontSize:     '0.78rem',
            cursor:       'pointer',
            letterSpacing:'0.04em',
            transition:   'all 0.15s',
          }}>
            {label}
          </button>
        ))}
      </nav>

      {/* Status */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        fontFamily: 'var(--mono)', fontSize: '0.68rem',
        color: 'var(--low)', letterSpacing: '0.08em'
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--low)', display: 'inline-block',
          animation: 'pulse 2s ease infinite',
          boxShadow: '0 0 4px var(--low)'
        }} />
        SYSTEM ONLINE
      </div>
    </header>
  )
}

// ─── Assess Page ──────────────────────────────────────────────────────────────
function AssessPage({ onResult }) {
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  async function handleSubmit(payload) {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res  = await fetch('/api/assess', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Assessment failed')
      setResult(data)
      onResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(300px, 420px) 1fr',
      gap: '2rem',
      alignItems: 'start',
    }}>
      <div>
        <SectionLabel text="// INPUT PARAMETERS" />
        <RiskForm onSubmit={handleSubmit} loading={loading} />
      </div>

      <div>
        <SectionLabel text="// RISK ANALYSIS OUTPUT" />
        {error && (
          <div style={{
            border: '1px solid var(--high-border)', background: 'var(--high-bg)',
            borderRadius: 'var(--radius)', padding: '0.75rem 1rem', marginBottom: '1rem',
            fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--high)'
          }}>
            ERROR: {error}
          </div>
        )}
        {!result && !loading && !error && <EmptyState />}
        {loading && <LoadingState />}
        {result  && <ResultPanel result={result} />}
      </div>
    </div>
  )
}

function SectionLabel({ text }) {
  return (
    <div style={{
      fontFamily: 'var(--mono)', fontSize: '0.7rem',
      color: 'var(--dim)', letterSpacing: '0.08em', marginBottom: '0.75rem'
    }}>
      {text}
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{
      border: '1px dashed var(--border2)', borderRadius: 'var(--radius-lg)',
      padding: '4rem 2rem', textAlign: 'center', color: 'var(--muted)',
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.3 }}>◈</div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
        AWAITING ASSESSMENT INPUT
      </div>
      <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.6 }}>
        Fill in the form and click Assess
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div style={{
      border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
      padding: '4rem 2rem', textAlign: 'center',
    }}>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: '0.8rem',
        color: 'var(--accent)', letterSpacing: '0.1em',
        animation: 'pulse 1.2s ease infinite'
      }}>
        ANALYSING RISK FACTORS...
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '1.5rem' }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
            animation: `pulse 1.2s ease ${i * 0.15}s infinite`
          }} />
        ))}
      </div>
    </div>
  )
}

// ─── Risk Form ────────────────────────────────────────────────────────────────
function RiskForm({ onSubmit, loading }) {
  const [form, setForm] = useState(INITIAL_FORM)

  function set(key, val) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({
      ...form,
      test_coverage:      parseFloat(form.test_coverage),
      previous_incidents: parseInt(form.previous_incidents),
      team_size:          parseInt(form.team_size),
      changed_components: form.changed_components.split(',').map(s => s.trim()).filter(Boolean),
    })
  }

  const coverageColor = form.test_coverage >= 80
    ? 'var(--low)' : form.test_coverage >= 60
    ? 'var(--med)' : 'var(--high)'

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '1.5rem',
      display: 'flex', flexDirection: 'column', gap: '0.75rem',
    }}>

      {/* Release Info */}
      <Fieldset legend="Release Info">
        <Field label="Release Name">
          <Input value={form.release_name} onChange={v => set('release_name', v)}
            placeholder="v2.1.0" required />
        </Field>
        <Field label="Release Date">
          <Input type="date" value={form.release_date}
            onChange={v => set('release_date', v)} required />
        </Field>
        <Field label="Changed Components">
          <Input value={form.changed_components}
            onChange={v => set('changed_components', v)}
            placeholder="auth, payment, ui" />
        </Field>
      </Fieldset>

      {/* Deployment */}
      <Fieldset legend="Deployment">
        <Field label="Environment">
          <select value={form.deployment_env} onChange={e => set('deployment_env', e.target.value)}
            style={selectStyle}>
            <option value="development">Development</option>
            <option value="staging">Staging</option>
            <option value="production">Production</option>
          </select>
        </Field>

        <Field label="Change Size">
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {['small','medium','large'].map(opt => (
              <button type="button" key={opt}
                onClick={() => set('change_size', opt)}
                style={{
                  flex: 1, padding: '0.4rem', cursor: 'pointer',
                  borderRadius: 'var(--radius)', fontFamily: 'var(--mono)',
                  fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em',
                  transition: 'all 0.15s',
                  background:   form.change_size === opt ? 'rgba(88,166,255,0.12)' : 'transparent',
                  border:       `1px solid ${form.change_size === opt ? 'var(--accent)' : 'var(--border2)'}`,
                  color:        form.change_size === opt ? 'var(--accent)' : 'var(--muted)',
                }}>
                {opt}
              </button>
            ))}
          </div>
        </Field>
      </Fieldset>

      {/* Risk Factors */}
      <Fieldset legend="Risk Factors">
        <Field label={`Test Coverage — ${form.test_coverage}%`}>
          <div style={{ position: 'relative', padding: '6px 0' }}>
            <div style={{
              position: 'absolute', top: '50%', left: 0, right: 0,
              height: 4, background: 'var(--border2)', borderRadius: 2,
              transform: 'translateY(-50%)', zIndex: 1, pointerEvents: 'none'
            }}>
              <div style={{
                height: '100%', borderRadius: 2,
                width: `${form.test_coverage}%`,
                background: coverageColor,
                transition: 'width 0.1s, background 0.3s'
              }} />
            </div>
            <input type="range" min="0" max="100"
              value={form.test_coverage}
              onChange={e => set('test_coverage', e.target.value)}
              style={{
                width: '100%', position: 'relative', zIndex: 2,
                WebkitAppearance: 'none', appearance: 'none',
                background: 'transparent', cursor: 'pointer', height: 16,
              }} />
          </div>
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <Field label="Previous Incidents">
            <Input type="number" min="0" value={form.previous_incidents}
              onChange={v => set('previous_incidents', v)} />
          </Field>
          <Field label="Team Size">
            <Input type="number" min="1" value={form.team_size}
              onChange={v => set('team_size', v)} />
          </Field>
        </div>

        {/* Toggle */}
        <div onClick={() => set('has_rollback_plan', !form.has_rollback_plan)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.7rem',
            cursor: 'pointer', padding: '0.5rem 0',
            fontSize: '0.85rem', color: 'var(--text)', userSelect: 'none'
          }}>
          <div style={{
            width: 36, height: 20, borderRadius: 10,
            background: form.has_rollback_plan ? 'var(--low)' : 'var(--border2)',
            position: 'relative', transition: 'background 0.2s', flexShrink: 0,
          }}>
            <div style={{
              position: 'absolute', top: 2, left: 2, width: 16, height: 16,
              borderRadius: '50%', background: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              transition: 'transform 0.2s',
              transform: form.has_rollback_plan ? 'translateX(16px)' : 'translateX(0)',
            }} />
          </div>
          <span>Has Rollback Plan</span>
          <span style={{
            marginLeft: 'auto', fontSize: '0.7rem', fontFamily: 'var(--mono)',
            color: form.has_rollback_plan ? 'var(--low)' : 'var(--high)'
          }}>
            {form.has_rollback_plan ? 'YES' : 'NO'}
          </span>
        </div>
      </Fieldset>

      {/* Submit */}
      <button type="submit" disabled={loading} style={{
        background: loading ? 'var(--border2)' : 'var(--accent2)',
        color: 'var(--text)', border: 'none',
        padding: '0.75rem 1.25rem', borderRadius: 'var(--radius)',
        fontFamily: 'var(--mono)', fontSize: '0.82rem', fontWeight: 700,
        letterSpacing: '0.08em', cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', transition: 'all 0.15s',
        opacity: loading ? 0.6 : 1,
      }}>
        <span>{loading ? 'ANALYSING...' : 'RUN RISK ASSESSMENT'}</span>
        {!loading && <span style={{ marginLeft: 'auto' }}>→</span>}
      </button>
    </form>
  )
}

// ─── Result Panel ─────────────────────────────────────────────────────────────
function ResultPanel({ result }) {
  const cfg = LEVEL_CONFIG[result.overall_level] || LEVEL_CONFIG.medium

  return (
    <div className="fade-up" style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
    }}>
      {/* Hero */}
      <div style={{
        padding: '1.5rem',
        borderBottom: `1px solid ${cfg.border}`,
        background: cfg.bg,
      }}>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <ScoreRing score={result.overall_score} color={cfg.color} />
          <div>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: '1rem', fontWeight: 700,
              letterSpacing: '0.08em', color: cfg.color, marginBottom: '0.35rem'
            }}>
              {cfg.icon} {cfg.label}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.5, maxWidth: 380 }}>
              {result.summary}
            </div>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: '0.65rem',
              color: 'var(--dim)', letterSpacing: '0.06em', marginTop: '0.5rem'
            }}>
              assessed {new Date(result.assessed_at).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Factors */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '0.65rem',
          letterSpacing: '0.12em', color: 'var(--dim)', marginBottom: '1rem'
        }}>
          RISK FACTOR BREAKDOWN
        </div>
        {result.factors.map((f, i) => (
          <FactorRow key={f.name} factor={f} delay={i * 60} />
        ))}
      </div>

      {/* Recommendations */}
      <div style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '0.65rem',
          letterSpacing: '0.12em', color: 'var(--dim)', marginBottom: '1rem'
        }}>
          RECOMMENDATIONS
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {result.recommendations.map((r, i) => (
            <div key={i} style={{
              display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
              fontSize: '0.82rem', color: 'var(--text)',
              padding: '0.5rem 0.75rem', background: 'var(--bg3)',
              borderRadius: 'var(--radius)', borderLeft: '2px solid var(--accent2)',
              lineHeight: 1.5,
            }}>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: '0.65rem',
                color: 'var(--accent)', fontWeight: 700,
                flexShrink: 0, marginTop: 2
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score, color }) {
  const r    = 28
  const circ = 2 * Math.PI * r
  const dash = circ * (1 - score / 100)

  return (
    <svg width="80" height="80" viewBox="0 0 80 80" style={{ flexShrink: 0 }}>
      <circle cx="40" cy="40" r={r} fill="none"
        stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
      <circle cx="40" cy="40" r={r} fill="none"
        stroke={color} strokeWidth="5"
        strokeDasharray={circ}
        strokeDashoffset={dash}
        strokeLinecap="round"
        transform="rotate(-90 40 40)"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <text x="40" y="40" textAnchor="middle" dominantBaseline="central"
        fill={color} fontSize="16" fontFamily="Space Mono, monospace" fontWeight="700">
        {score}
      </text>
    </svg>
  )
}

// ─── Factor Row ───────────────────────────────────────────────────────────────
function FactorRow({ factor, delay }) {
  const cfg    = LEVEL_CONFIG[factor.level] || LEVEL_CONFIG.medium
  const barRef = useRef(null)

  useEffect(() => {
    const pct = Math.min(100, Math.max(0, Math.abs(factor.score) / 25 * 100))
    const t   = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = `${pct}%`
    }, delay + 100)
    return () => clearTimeout(t)
  }, [factor.score, delay])

  return (
    <div style={{
      padding: '0.6rem 0',
      borderBottom: '1px solid var(--border)',
      animation: `fadeUp 0.4s ease ${delay}ms both`,
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '0.35rem'
      }}>
        <span style={{ fontSize: '0.83rem', fontWeight: 500, color: 'var(--text)' }}>
          {factor.name}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: '0.62rem', fontWeight: 700,
            letterSpacing: '0.08em', padding: '0.15rem 0.45rem',
            borderRadius: 3, border: `1px solid ${cfg.border}`,
            background: cfg.bg, color: cfg.color,
          }}>
            {factor.level.toUpperCase()}
          </span>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: '0.78rem',
            color: cfg.color, minWidth: 28, textAlign: 'right'
          }}>
            {factor.score > 0 ? `+${factor.score}` : factor.score}
          </span>
        </div>
      </div>

      <div style={{
        height: 3, background: 'var(--border)',
        borderRadius: 2, overflow: 'hidden', marginBottom: '0.35rem'
      }}>
        <div ref={barRef} style={{
          height: '100%', width: '0%',
          background: cfg.color, borderRadius: 2,
          transition: 'width 0.6s ease'
        }} />
      </div>

      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.4 }}>
        {factor.recommendation}
      </div>
    </div>
  )
}

// ─── History Page ─────────────────────────────────────────────────────────────
function HistoryPage({ history }) {
  if (history.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '5rem 2rem', textAlign: 'center',
        border: '1px dashed var(--border2)', borderRadius: 'var(--radius-lg)',
      }}>
        <div style={{ fontSize: '3rem', opacity: 0.15, marginBottom: '1.25rem' }}>◈</div>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '0.8rem',
          letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: '0.5rem'
        }}>
          NO ASSESSMENT HISTORY
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--dim)' }}>
          Run your first assessment to see results here.
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: '0.7rem',
        color: 'var(--dim)', letterSpacing: '0.08em', marginBottom: '1.25rem'
      }}>
        // ASSESSMENT LOG — {history.length} RECORD{history.length !== 1 ? 'S' : ''}
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1rem',
      }}>
        {history.map((r, i) => <HistoryCard key={i} result={r} index={i} />)}
      </div>
    </div>
  )
}

function HistoryCard({ result, index }) {
  const cfg  = LEVEL_CONFIG[result.overall_level] || LEVEL_CONFIG.medium
  const circ = 2 * Math.PI * 20
  const dash = circ * (1 - result.overall_score / 100)

  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '1.25rem',
      animation: `fadeUp 0.35s ease ${index * 50}ms both`,
      transition: 'border-color 0.15s, transform 0.15s',
      cursor: 'default',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)';  e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>
            {result.release_name}
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
            {result.release_date}
          </div>
        </div>
        <svg width="52" height="52" viewBox="0 0 52 52">
          <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4"/>
          <circle cx="26" cy="26" r="20" fill="none" stroke={cfg.color} strokeWidth="4"
            strokeDasharray={circ} strokeDashoffset={dash}
            strokeLinecap="round" transform="rotate(-90 26 26)"/>
          <text x="26" y="26" textAnchor="middle" dominantBaseline="central"
            fill={cfg.color} fontSize="11" fontFamily="Space Mono, monospace" fontWeight="700">
            {result.overall_score}
          </text>
        </svg>
      </div>

      <div style={{
        fontFamily: 'var(--mono)', fontSize: '0.7rem', fontWeight: 700,
        letterSpacing: '0.1em', color: cfg.color, marginBottom: '0.75rem'
      }}>
        {cfg.label}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
        {result.factors.map(f => {
          const fc = LEVEL_CONFIG[f.level] || LEVEL_CONFIG.medium
          return (
            <span key={f.name} style={{
              fontFamily: 'var(--mono)', fontSize: '0.6rem',
              padding: '0.15rem 0.45rem', borderRadius: 3,
              border: `1px solid ${fc.color}40`, color: fc.color,
              letterSpacing: '0.04em',
            }}>
              {f.name.replace(' (30d)', '')}
            </span>
          )
        })}
      </div>

      <div style={{
        fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--dim)',
        letterSpacing: '0.04em', borderTop: '1px solid var(--border)',
        paddingTop: '0.6rem', marginTop: '0.25rem',
      }}>
        {new Date(result.assessed_at).toLocaleString()}
      </div>
    </div>
  )
}

// ─── Shared UI Primitives ─────────────────────────────────────────────────────
const inputStyle = {
  width: '100%', background: 'var(--bg)', border: '1px solid var(--border2)',
  color: 'var(--text)', padding: '0.45rem 0.7rem', borderRadius: 'var(--radius)',
  fontFamily: 'var(--mono)', fontSize: '0.82rem', outline: 'none',
  transition: 'border-color 0.15s',
}

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer', WebkitAppearance: 'none', appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%237d8590'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.6rem center',
  paddingRight: '2rem',
}

function Input({ type = 'text', value, onChange, placeholder, required, min }) {
  return (
    <input type={type} value={value} placeholder={placeholder}
      required={required} min={min}
      onChange={e => onChange(e.target.value)}
      style={inputStyle}
      onFocus={e  => e.target.style.borderColor = 'var(--accent)'}
      onBlur={e   => e.target.style.borderColor = 'var(--border2)'}
    />
  )
}

function Fieldset({ legend, children }) {
  return (
    <fieldset style={{
      border: '1px solid var(--border)', borderRadius: 'var(--radius)',
      padding: '1rem', marginBottom: '0.75rem',
    }}>
      <legend style={{
        fontFamily: 'var(--mono)', fontSize: '0.68rem', letterSpacing: '0.1em',
        color: 'var(--accent)', textTransform: 'uppercase', padding: '0 0.4rem',
      }}>
        {legend}
      </legend>
      {children}
    </fieldset>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{
        display: 'block', fontSize: '0.72rem', fontFamily: 'var(--mono)',
        color: 'var(--muted)', letterSpacing: '0.06em',
        marginBottom: '0.35rem', textTransform: 'uppercase',
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}
