import React, { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { format } from 'date-fns'
import TaskCard from './TaskCard'
import TaskModal from './TaskModal'

export default function InboxView({ tasks, projects, onToggle, onToggleSubtask, onAddTask, onUpdateTask, onDeleteTask }) {
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // all | today | week | no-date

  const today = format(new Date(), 'yyyy-MM-dd')
  const weekEnd = format(new Date(Date.now() + 7 * 86400000), 'yyyy-MM-dd')

  let filtered = tasks.filter(t => !t.completed)
  if (search) filtered = filtered.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.note?.toLowerCase().includes(search.toLowerCase()))
  if (filter === 'today') filtered = filtered.filter(t => t.dueDate === today)
  if (filter === 'week') filtered = filtered.filter(t => t.dueDate && t.dueDate <= weekEnd)
  if (filter === 'no-date') filtered = filtered.filter(t => !t.dueDate)

  const handleSave = (form) => {
    if (form.id) onUpdateTask(form.id, form)
    else onAddTask(form)
  }

  return (
    <div>
      <div className="main-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="main-title">Toutes les tâches</div>
          <button className="btn btn-primary" onClick={() => setModal('new')} style={{ padding: '8px 12px' }}>
            <Plus size={14} /> Nouvelle
          </button>
        </div>

        {/* Search */}
        <div className="quick-add" style={{ marginTop: '16px', marginBottom: '8px' }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            placeholder="Rechercher une tâche..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
          {[['all', 'Toutes'], ['today', "Aujourd'hui"], ['week', 'Cette semaine'], ['no-date', 'Sans date']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              style={{
                padding: '5px 12px',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: filter === val ? 'var(--accent-blue)' : 'var(--border)',
                background: filter === val ? '#EFF6FF' : 'transparent',
                color: filter === val ? 'var(--accent-blue)' : 'var(--text-muted)',
                fontSize: '12px',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontWeight: filter === val ? '500' : '400',
                transition: 'all 0.15s'
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="main-body">
        <div className="quick-add">
          <Plus size={16} color="var(--text-muted)" />
          <input
            placeholder="Nouvelle tâche (Entrée pour ajouter)..."
            onKeyDown={e => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                onAddTask({ title: e.target.value.trim(), priority: 'medium', tags: [], subtasks: [], note: '' })
                e.target.value = ''
              }
            }}
          />
          <button className="quick-add-btn" onClick={() => setModal('new')}><Plus size={14} /></button>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '36px' }}>{search ? '🔍' : '✅'}</div>
            <div className="empty-state-text">{search ? 'Aucun résultat pour cette recherche.' : 'Aucune tâche dans cette vue.'}</div>
          </div>
        ) : (
          <div className="task-group">
            <div className="task-group-header">
              <span className="task-group-title">{filtered.length} tâche{filtered.length > 1 ? 's' : ''}</span>
              <div className="task-group-line" />
            </div>
            {filtered.map(t => (
              <TaskCard key={t.id} task={t} onToggle={onToggle} onToggleSubtask={onToggleSubtask} onClick={setModal} />
            ))}
          </div>
        )}
      </div>

      {modal && (
        <TaskModal
          task={modal === 'new' ? null : modal}
          projects={projects}
          onSave={handleSave}
          onDelete={onDeleteTask}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
