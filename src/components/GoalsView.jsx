import React, { useState } from 'react'
import { Plus, Trash2, ChevronUp, ChevronDown, Target } from 'lucide-react'

const COLORS = ['#C9A84C', '#34A853', '#3B82F6', '#8B5CF6', '#E05252', '#F59E0B', '#EC4899', '#06B6D4']

export default function GoalsView({ goals, onAdd, onUpdate, onDelete }) {
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ title: '', period: 'weekly', target: 5, color: COLORS[0] })

  const weekly = goals.filter(g => g.period === 'weekly')
  const monthly = goals.filter(g => g.period === 'monthly')

  const handleAdd = () => {
    if (!form.title.trim()) return
    onAdd(form)
    setForm({ title: '', period: 'weekly', target: 5, color: COLORS[0] })
    setModal(false)
  }

  const GoalCard = ({ goal }) => {
    const pct = Math.min(100, Math.round((goal.current / goal.target) * 100))
    const done = goal.current >= goal.target
    return (
      <div className="goal-card" style={{ borderLeft: `3px solid ${goal.color}` }}>
        <div className="goal-header">
          <div>
            <div className="goal-title">{goal.title}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
              {goal.current} / {goal.target} {done ? '🎉' : ''}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="goal-period" style={{
              background: goal.period === 'weekly' ? '#EFF6FF' : '#F5F3FF',
              color: goal.period === 'weekly' ? '#3B82F6' : '#8B5CF6'
            }}>
              {goal.period === 'weekly' ? '📅 Semaine' : '📆 Mois'}
            </span>
          </div>
        </div>

        <div className="goal-progress-bar">
          <div className="goal-progress-fill" style={{ width: `${pct}%`, background: done ? 'var(--accent-green)' : goal.color }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
          <span className="goal-tasks-count">{pct}% accompli</span>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              onClick={() => goal.current > 0 && onUpdate(goal.id, { current: goal.current - 1 })}
              style={{ background: 'var(--border-light)', border: 'none', borderRadius: '6px', width: '26px', height: '26px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}
            >
              <ChevronDown size={13} />
            </button>
            <span style={{ fontSize: '14px', fontWeight: '500', minWidth: '20px', textAlign: 'center' }}>{goal.current}</span>
            <button
              onClick={() => onUpdate(goal.id, { current: goal.current + 1 })}
              style={{ background: goal.color, border: 'none', borderRadius: '6px', width: '26px', height: '26px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
            >
              <ChevronUp size={13} />
            </button>
            <button
              onClick={() => onDelete(goal.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: '4px', marginLeft: '4px' }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="main-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="main-title">Objectifs</div>
            <div className="main-subtitle">Semaine & mois</div>
          </div>
          <button className="btn btn-primary" onClick={() => setModal(true)}>
            <Plus size={14} /> Nouvel objectif
          </button>
        </div>
      </div>

      <div className="main-body">
        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-number">{goals.filter(g => g.current >= g.target).length}</div>
            <div className="stat-label">Objectifs atteints</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{weekly.length}</div>
            <div className="stat-label">Cette semaine</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{monthly.length}</div>
            <div className="stat-label">Ce mois</div>
          </div>
        </div>

        {goals.length === 0 ? (
          <div className="empty-state">
            <Target size={40} color="var(--text-muted)" />
            <div style={{ fontSize: '16px', fontFamily: 'var(--font-display)' }}>Aucun objectif</div>
            <div className="empty-state-text">Fixez-vous des objectifs hebdomadaires ou mensuels.</div>
          </div>
        ) : (
          <>
            {weekly.length > 0 && (
              <div className="task-group">
                <div className="task-group-header">
                  <span className="task-group-title">📅 Cette semaine</span>
                  <div className="task-group-line" />
                </div>
                {weekly.map(g => <GoalCard key={g.id} goal={g} />)}
              </div>
            )}
            {monthly.length > 0 && (
              <div className="task-group">
                <div className="task-group-header">
                  <span className="task-group-title">📆 Ce mois</span>
                  <div className="task-group-line" />
                </div>
                {monthly.map(g => <GoalCard key={g.id} goal={g} />)}
              </div>
            )}
          </>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-title">Nouvel objectif</div>
            <div className="form-group">
              <label className="form-label">Titre</label>
              <input autoFocus className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleAdd()} placeholder="Ex: Lire 3 livres ce mois..." />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Période</label>
                <select className="form-select" value={form.period} onChange={e => setForm(f => ({ ...f, period: e.target.value }))}>
                  <option value="weekly">Cette semaine</option>
                  <option value="monthly">Ce mois</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Objectif cible</label>
                <input type="number" min="1" max="100" className="form-input" value={form.target} onChange={e => setForm(f => ({ ...f, target: parseInt(e.target.value) || 1 }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Couleur</label>
              <div className="color-options">
                {COLORS.map(c => (
                  <div key={c} className={`color-option ${form.color === c ? 'selected' : ''}`} style={{ background: c }} onClick={() => setForm(f => ({ ...f, color: c }))} />
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={handleAdd}>Créer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
