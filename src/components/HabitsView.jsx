import React, { useState } from 'react'
import { Plus, Trash2, Flame } from 'lucide-react'
import { format, subDays } from 'date-fns'
import { fr } from 'date-fns/locale'

const COLORS = ['#8B5CF6', '#34A853', '#C9A84C', '#3B82F6', '#E05252', '#F59E0B', '#EC4899', '#06B6D4']
const EMOJIS = ['🧘', '💪', '📚', '🏃', '🥗', '💧', '😴', '🎵', '✍️', '🎯', '🌿', '🧠']

// Last 7 days
function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i)
    return { date: format(d, 'yyyy-MM-dd'), label: format(d, 'EEE', { locale: fr }), isToday: i === 6 }
  })
}

function getStreak(completions) {
  let streak = 0
  let d = new Date()
  while (true) {
    const key = format(d, 'yyyy-MM-dd')
    if (completions[key]) { streak++; d = subDays(d, 1) }
    else break
  }
  return streak
}

export default function HabitsView({ habits, onToggleDay, onAdd, onDelete }) {
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ name: '', emoji: '🧘', color: COLORS[0] })
  const days = getLast7Days()
  const todayStr = format(new Date(), 'yyyy-MM-dd')

  const handleAdd = () => {
    if (!form.name.trim()) return
    onAdd(form)
    setForm({ name: '', emoji: EMOJIS[0], color: COLORS[0] })
    setModal(false)
  }

  const totalDoneToday = habits.filter(h => h.completions[todayStr]).length

  return (
    <div>
      <div className="main-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="main-title">Habitudes</div>
            <div className="main-subtitle">
              {totalDoneToday}/{habits.length} aujourd'hui
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setModal(true)}>
            <Plus size={14} /> Nouvelle
          </button>
        </div>
      </div>

      <div className="main-body">
        {/* Day header */}
        {habits.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px', padding: '0 16px' }}>
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', gap: '4px' }}>
              {days.map(d => (
                <div key={d.date} style={{ width: '22px', textAlign: 'center', fontSize: '10px', color: d.isToday ? 'var(--accent-blue)' : 'var(--text-muted)', fontWeight: d.isToday ? '600' : '400' }}>
                  {d.label}
                </div>
              ))}
            </div>
            <div style={{ width: '50px' }} />
          </div>
        )}

        {habits.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '40px' }}>🌱</div>
            <div style={{ fontSize: '16px', fontFamily: 'var(--font-display)' }}>Aucune habitude</div>
            <div className="empty-state-text">Commencez à tracker vos habitudes quotidiennes.</div>
          </div>
        ) : (
          habits.map(habit => {
            const streak = getStreak(habit.completions)
            return (
              <div key={habit.id} className="habit-card">
                <div style={{ fontSize: '20px' }}>{habit.emoji}</div>
                <div className="habit-name">{habit.name}</div>
                <div className="habit-dots">
                  {days.map(d => (
                    <div
                      key={d.date}
                      className={`habit-dot ${habit.completions[d.date] ? 'done' : ''} ${d.isToday && !habit.completions[d.date] ? 'today-empty' : ''}`}
                      style={habit.completions[d.date] ? { background: habit.color, borderColor: habit.color } : {}}
                      onClick={() => onToggleDay(habit.id, d.date)}
                      title={d.label}
                    >
                      {habit.completions[d.date] && '✓'}
                    </div>
                  ))}
                </div>
                {streak > 0 && (
                  <div className="habit-streak">
                    <Flame size={12} />
                    {streak}
                  </div>
                )}
                <button
                  onClick={() => onDelete(habit.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: '4px' }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )
          })
        )}

        {/* Weekly summary */}
        {habits.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <div className="task-group-header" style={{ marginBottom: '12px' }}>
              <span className="task-group-title">Résumé de la semaine</span>
              <div className="task-group-line" />
            </div>
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-number">{habits.filter(h => getStreak(h.completions) > 0).length}</div>
                <div className="stat-label">Séries actives</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {Math.max(...habits.map(h => getStreak(h.completions)), 0)}
                </div>
                <div className="stat-label">Meilleure série</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{totalDoneToday}</div>
                <div className="stat-label">Faites aujourd'hui</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-title">Nouvelle habitude</div>
            <div className="form-group">
              <label className="form-label">Nom</label>
              <input autoFocus className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleAdd()} placeholder="Ex: Méditer 10 min..." />
            </div>
            <div className="form-group">
              <label className="form-label">Emoji</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {EMOJIS.map(em => (
                  <button key={em} onClick={() => setForm(f => ({ ...f, emoji: em }))} style={{ background: form.emoji === em ? 'var(--border)' : 'transparent', border: '1px solid', borderColor: form.emoji === em ? 'var(--text-primary)' : 'var(--border)', borderRadius: '8px', padding: '5px 8px', cursor: 'pointer', fontSize: '18px' }}>
                    {em}
                  </button>
                ))}
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
