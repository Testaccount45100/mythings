import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'

const PRIORITIES = [
  { value: 'high', label: 'Haute', color: '#E05252' },
  { value: 'medium', label: 'Moyenne', color: '#F59E0B' },
  { value: 'low', label: 'Basse', color: '#34A853' },
]

const TAGS = ['perso', 'travail', 'urgent', 'idée', 'suivi', 'lecture']

export default function TaskModal({ task, projects, onSave, onDelete, onClose }) {
  const isNew = !task?.id
  const [form, setForm] = useState({
    title: '',
    note: '',
    priority: 'medium',
    projectId: null,
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    tags: [],
    subtasks: [],
    ...task
  })
  const [newSubtask, setNewSubtask] = useState('')

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const toggleTag = (tag) => {
    set('tags', form.tags.includes(tag)
      ? form.tags.filter(t => t !== tag)
      : [...form.tags, tag])
  }

  const addSubtask = () => {
    if (!newSubtask.trim()) return
    set('subtasks', [...form.subtasks, { id: uuidv4(), title: newSubtask.trim(), completed: false }])
    setNewSubtask('')
  }

  const removeSubtask = (id) => set('subtasks', form.subtasks.filter(s => s.id !== id))

  const handleSave = () => {
    if (!form.title.trim()) return
    onSave(form)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">{isNew ? 'Nouvelle tâche' : 'Modifier la tâche'}</div>

        <div className="form-group">
          <label className="form-label">Titre</label>
          <input
            className="form-input"
            autoFocus
            value={form.title}
            onChange={e => set('title', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="Nom de la tâche..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Note</label>
          <textarea
            className="form-textarea"
            value={form.note}
            onChange={e => set('note', e.target.value)}
            placeholder="Ajouter une note..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Priorité</label>
            <select className="form-select" value={form.priority} onChange={e => set('priority', e.target.value)}>
              {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Échéance</label>
            <input type="date" className="form-input" value={form.dueDate || ''} onChange={e => set('dueDate', e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Projet</label>
          <select className="form-select" value={form.projectId || ''} onChange={e => set('projectId', e.target.value || null)}>
            <option value="">Aucun projet</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Tags</label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: form.tags.includes(tag) ? 'var(--accent-blue)' : 'var(--border)',
                  background: form.tags.includes(tag) ? '#EFF6FF' : 'transparent',
                  color: form.tags.includes(tag) ? 'var(--accent-blue)' : 'var(--text-muted)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  transition: 'all 0.15s'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Sous-tâches</label>
          {form.subtasks.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ flex: 1, fontSize: '13px', color: s.completed ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: s.completed ? 'line-through' : 'none' }}>{s.title}</span>
              <button onClick={() => removeSubtask(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                <X size={14} />
              </button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <input
              className="form-input"
              value={newSubtask}
              onChange={e => setNewSubtask(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSubtask()}
              placeholder="Ajouter une sous-tâche..."
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" onClick={addSubtask} style={{ padding: '8px 10px' }}>
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="modal-actions">
          {!isNew && (
            <button className="btn btn-danger" onClick={() => { onDelete(task.id); onClose() }}>
              <Trash2 size={14} /> Supprimer
            </button>
          )}
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={handleSave}>
            {isNew ? 'Créer' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  )
}
