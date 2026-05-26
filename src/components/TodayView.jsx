import React, { useState } from 'react'
import { Plus, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import TaskCard from './TaskCard'
import TaskModal from './TaskModal'

export default function TodayView({ tasks, projects, todayTasks, overdueTasks, completedToday, onToggle, onToggleSubtask, onAddTask, onUpdateTask, onDeleteTask }) {
  const [modal, setModal] = useState(null) // null | 'new' | task object
  const today = new Date()

  const handleSave = (form) => {
    if (form.id) {
      onUpdateTask(form.id, form)
    } else {
      onAddTask({ ...form, dueDate: format(today, 'yyyy-MM-dd') })
    }
  }

  const completionRate = (todayTasks.length + completedToday.length) > 0
    ? Math.round((completedToday.length / (todayTasks.length + completedToday.length)) * 100)
    : 0

  return (
    <div>
      <div className="main-header">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '400' }}>
              {format(today, 'EEEE d MMMM yyyy', { locale: fr })}
            </div>
            <div className="main-title">Aujourd'hui</div>
          </div>
          {completionRate > 0 && (
            <div style={{ textAlign: 'right', marginBottom: '4px' }}>
              <div style={{ fontSize: '22px', fontFamily: 'var(--font-display)', fontWeight: '500', color: completionRate === 100 ? 'var(--accent-green)' : 'var(--text-primary)' }}>
                {completionRate}%
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>accompli</div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div style={{ height: '3px', background: 'var(--border-light)', borderRadius: '10px', marginTop: '12px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${completionRate}%`,
            background: completionRate === 100 ? 'var(--accent-green)' : 'var(--accent-blue)',
            borderRadius: '10px',
            transition: 'width 0.5s ease'
          }} />
        </div>
      </div>

      <div className="main-body">
        {/* Quick add */}
        <div className="quick-add">
          <Plus size={16} color="var(--text-muted)" />
          <input
            placeholder="Nouvelle tâche pour aujourd'hui..."
            onKeyDown={e => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                onAddTask({ title: e.target.value.trim(), priority: 'medium', dueDate: format(today, 'yyyy-MM-dd'), tags: [], subtasks: [], note: '' })
                e.target.value = ''
              }
            }}
          />
          <button className="quick-add-btn" onClick={() => setModal('new')}>
            <Plus size={14} />
          </button>
        </div>

        {/* Overdue */}
        {overdueTasks.length > 0 && (
          <div className="task-group">
            <div className="task-group-header">
              <span className="task-group-title" style={{ color: 'var(--accent-red)' }}>⚠ En retard</span>
              <div className="task-group-line" />
              <span style={{ fontSize: '11px', color: 'var(--accent-red)' }}>{overdueTasks.length}</span>
            </div>
            {overdueTasks.map(t => (
              <TaskCard key={t.id} task={t} onToggle={onToggle} onToggleSubtask={onToggleSubtask} onClick={setModal} />
            ))}
          </div>
        )}

        {/* Today tasks */}
        <div className="task-group">
          <div className="task-group-header">
            <span className="task-group-title">À faire</span>
            <div className="task-group-line" />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{todayTasks.length}</span>
          </div>
          {todayTasks.length === 0 && overdueTasks.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '40px' }}>✨</div>
              <div style={{ fontSize: '16px', fontFamily: 'var(--font-display)', fontWeight: '400' }}>Journée libre !</div>
              <div className="empty-state-text">Toutes les tâches sont terminées ou ajoutez-en une nouvelle.</div>
            </div>
          ) : (
            todayTasks.map(t => (
              <TaskCard key={t.id} task={t} onToggle={onToggle} onToggleSubtask={onToggleSubtask} onClick={setModal} />
            ))
          )}
        </div>

        {/* Completed */}
        {completedToday.length > 0 && (
          <div className="task-group">
            <div className="task-group-header">
              <CheckCircle size={12} color="var(--accent-green)" />
              <span className="task-group-title" style={{ color: 'var(--accent-green)' }}>Terminées</span>
              <div className="task-group-line" />
              <span style={{ fontSize: '11px', color: 'var(--accent-green)' }}>{completedToday.length}</span>
            </div>
            {completedToday.map(t => (
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
