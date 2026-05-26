import React, { useState } from 'react'
import { Check, ChevronDown, ChevronRight } from 'lucide-react'

const PRIORITY_COLORS = { high: '#E05252', medium: '#F59E0B', low: '#34A853' }
const TAG_COLORS = {
  perso: { bg: '#EFF6FF', color: '#3B82F6' },
  travail: { bg: '#F5F3FF', color: '#8B5CF6' },
  urgent: { bg: '#FEF2F2', color: '#E05252' },
  'idée': { bg: '#FFFBEB', color: '#F59E0B' },
  suivi: { bg: '#F0FDF4', color: '#34A853' },
  lecture: { bg: '#FFF7ED', color: '#EA580C' }
}

export default function TaskCard({ task, onToggle, onToggleSubtask, onClick }) {
  const [expanded, setExpanded] = useState(false)
  const hasSubtasks = task.subtasks && task.subtasks.length > 0
  const completedSubs = hasSubtasks ? task.subtasks.filter(s => s.completed).length : 0

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      {task.priority && (
        <div className="task-priority" style={{ background: PRIORITY_COLORS[task.priority] }} />
      )}

      <div
        className={`task-checkbox ${task.completed ? 'checked' : ''}`}
        onClick={e => { e.stopPropagation(); onToggle(task.id) }}
      >
        {task.completed && <Check size={11} color="white" strokeWidth={3} />}
      </div>

      <div className="task-body" onClick={() => onClick(task)}>
        <div className={`task-title ${task.completed ? 'struck' : ''}`}>
          {task.title}
        </div>

        {task.note && (
          <div className="task-note-preview">{task.note}</div>
        )}

        {(task.tags?.length > 0 || hasSubtasks) && (
          <div className="task-meta">
            {task.tags?.map(tag => (
              <span
                key={tag}
                className="task-tag"
                style={TAG_COLORS[tag] ? { background: TAG_COLORS[tag].bg, color: TAG_COLORS[tag].color } : { background: 'var(--border-light)', color: 'var(--text-muted)' }}
              >
                {tag}
              </span>
            ))}
            {hasSubtasks && (
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {completedSubs}/{task.subtasks.length} sous-tâches
              </span>
            )}
          </div>
        )}
      </div>

      {hasSubtasks && (
        <button
          onClick={e => { e.stopPropagation(); setExpanded(!expanded) }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: '2px' }}
        >
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
      )}

      {hasSubtasks && expanded && (
        <div className="subtask-list" style={{ width: '100%', marginTop: '8px' }}>
          {task.subtasks.map(s => (
            <div key={s.id} className="subtask-item">
              <div
                className={`subtask-checkbox ${s.completed ? 'checked' : ''}`}
                onClick={e => { e.stopPropagation(); onToggleSubtask(task.id, s.id) }}
              >
                {s.completed && <Check size={8} color="white" strokeWidth={3} />}
              </div>
              <span style={{ textDecoration: s.completed ? 'line-through' : 'none', flex: 1 }}>{s.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
