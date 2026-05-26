import React, { useState } from 'react'
import { Plus, ChevronRight, Trash2, X } from 'lucide-react'
import TaskCard from './TaskCard'
import TaskModal from './TaskModal'

const COLORS = ['#3B82F6', '#8B5CF6', '#34A853', '#E05252', '#F59E0B', '#EC4899', '#06B6D4', '#C9A84C']
const ICONS = ['💼', '🏠', '🎯', '📚', '🚀', '🎨', '💡', '🔧', '❤️', '🌱']

export default function ProjectsView({ tasks, projects, onToggle, onToggleSubtask, onAddTask, onUpdateTask, onDeleteTask, onAddProject, onDeleteProject }) {
  const [selectedProject, setSelectedProject] = useState(null)
  const [taskModal, setTaskModal] = useState(null)
  const [newProjectModal, setNewProjectModal] = useState(false)
  const [newProject, setNewProject] = useState({ name: '', color: COLORS[0], icon: ICONS[0] })

  const projectTasks = (pId) => tasks.filter(t => t.projectId === pId)
  const completedCount = (pId) => projectTasks(pId).filter(t => t.completed).length

  const handleSaveTask = (form) => {
    if (form.id) onUpdateTask(form.id, form)
    else onAddTask({ ...form, projectId: selectedProject })
  }

  const handleAddProject = () => {
    if (!newProject.name.trim()) return
    onAddProject(newProject)
    setNewProject({ name: '', color: COLORS[0], icon: ICONS[0] })
    setNewProjectModal(false)
  }

  const activeProject = projects.find(p => p.id === selectedProject)
  const activeTasks = selectedProject ? projectTasks(selectedProject) : []

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Project list */}
      <div style={{ flex: selectedProject ? '0 0 280px' : '1', borderRight: selectedProject ? '1px solid var(--border)' : 'none', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="main-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="main-title">Projets</div>
            <button className="btn btn-primary" onClick={() => setNewProjectModal(true)} style={{ padding: '8px 12px' }}>
              <Plus size={14} /> Nouveau
            </button>
          </div>
        </div>

        <div className="main-body">
          {projects.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '36px' }}>📁</div>
              <div className="empty-state-text">Aucun projet. Créez-en un pour organiser vos tâches.</div>
            </div>
          ) : (
            projects.map(p => {
              const total = projectTasks(p.id).length
              const done = completedCount(p.id)
              const pct = total > 0 ? Math.round((done / total) * 100) : 0
              return (
                <div
                  key={p.id}
                  className="project-card"
                  onClick={() => setSelectedProject(p.id === selectedProject ? null : p.id)}
                  style={{ borderLeft: `3px solid ${p.color}` }}
                >
                  <div className="project-header">
                    <div className="project-dot" style={{ background: p.color }} />
                    <span style={{ fontSize: '18px' }}>{p.icon}</span>
                    <span className="project-title">{p.name}</span>
                    <ChevronRight size={14} color="var(--text-muted)" />
                  </div>
                  <div className="project-progress-bar">
                    <div style={{ height: '100%', background: p.color, width: `${pct}%`, borderRadius: '10px', transition: 'width 0.4s ease' }} />
                  </div>
                  <div className="project-tasks-count">{done}/{total} tâches · {pct}%</div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Project detail */}
      {selectedProject && activeProject && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="main-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>{activeProject.icon}</span>
                <div className="main-title">{activeProject.name}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-primary" onClick={() => setTaskModal('new')} style={{ padding: '8px 12px' }}>
                  <Plus size={14} /> Tâche
                </button>
                <button className="btn btn-danger" onClick={() => { onDeleteProject(selectedProject); setSelectedProject(null) }} style={{ padding: '8px 10px' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="main-body">
            <div className="quick-add">
              <Plus size={16} color="var(--text-muted)" />
              <input
                placeholder={`Nouvelle tâche dans ${activeProject.name}...`}
                onKeyDown={e => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    onAddTask({ title: e.target.value.trim(), priority: 'medium', projectId: selectedProject, tags: [], subtasks: [], note: '' })
                    e.target.value = ''
                  }
                }}
              />
            </div>

            {activeTasks.filter(t => !t.completed).length === 0 && activeTasks.filter(t => t.completed).length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '36px' }}>{activeProject.icon}</div>
                <div className="empty-state-text">Aucune tâche dans ce projet.</div>
              </div>
            ) : (
              <>
                <div className="task-group">
                  <div className="task-group-header">
                    <span className="task-group-title">En cours</span>
                    <div className="task-group-line" />
                  </div>
                  {activeTasks.filter(t => !t.completed).map(t => (
                    <TaskCard key={t.id} task={t} onToggle={onToggle} onToggleSubtask={onToggleSubtask} onClick={setTaskModal} />
                  ))}
                </div>
                {activeTasks.filter(t => t.completed).length > 0 && (
                  <div className="task-group">
                    <div className="task-group-header">
                      <span className="task-group-title" style={{ color: 'var(--accent-green)' }}>Terminées</span>
                      <div className="task-group-line" />
                    </div>
                    {activeTasks.filter(t => t.completed).map(t => (
                      <TaskCard key={t.id} task={t} onToggle={onToggle} onToggleSubtask={onToggleSubtask} onClick={setTaskModal} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* New project modal */}
      {newProjectModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setNewProjectModal(false)}>
          <div className="modal">
            <div className="modal-title">Nouveau projet</div>
            <div className="form-group">
              <label className="form-label">Nom</label>
              <input autoFocus className="form-input" value={newProject.name} onChange={e => setNewProject(p => ({ ...p, name: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleAddProject()} placeholder="Nom du projet..." />
            </div>
            <div className="form-group">
              <label className="form-label">Icône</label>
              <div className="color-options">
                {ICONS.map(icon => (
                  <button key={icon} onClick={() => setNewProject(p => ({ ...p, icon }))} style={{ background: newProject.icon === icon ? 'var(--border)' : 'transparent', border: '1px solid', borderColor: newProject.icon === icon ? 'var(--text-primary)' : 'var(--border)', borderRadius: '8px', padding: '4px 8px', cursor: 'pointer', fontSize: '16px' }}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Couleur</label>
              <div className="color-options">
                {COLORS.map(c => (
                  <div key={c} className={`color-option ${newProject.color === c ? 'selected' : ''}`} style={{ background: c }} onClick={() => setNewProject(p => ({ ...p, color: c }))} />
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setNewProjectModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={handleAddProject}>Créer</button>
            </div>
          </div>
        </div>
      )}

      {taskModal && (
        <TaskModal
          task={taskModal === 'new' ? null : taskModal}
          projects={projects}
          onSave={handleSaveTask}
          onDelete={onDeleteTask}
          onClose={() => setTaskModal(null)}
        />
      )}
    </div>
  )
}
