import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { format, startOfWeek, isToday, isPast, parseISO } from 'date-fns'

const STORAGE_KEY = 'mythings_data'

const DEFAULT_DATA = {
  tasks: [
    {
      id: uuidv4(), title: 'Bienvenue dans MyThings 🎉', completed: false,
      note: 'Clique sur cette tâche pour voir les détails et ajouter des sous-tâches.',
      priority: 'medium', projectId: null, dueDate: format(new Date(), 'yyyy-MM-dd'),
      tags: ['perso'], subtasks: [], createdAt: new Date().toISOString()
    },
    {
      id: uuidv4(), title: 'Configurer mes premiers projets', completed: false,
      note: '', priority: 'high', projectId: null, dueDate: format(new Date(), 'yyyy-MM-dd'),
      tags: ['travail'], subtasks: [
        { id: uuidv4(), title: 'Créer un projet', completed: false },
        { id: uuidv4(), title: 'Ajouter des tâches au projet', completed: false }
      ], createdAt: new Date().toISOString()
    }
  ],
  projects: [
    { id: uuidv4(), name: 'Personnel', color: '#3B82F6', icon: '🏠', createdAt: new Date().toISOString() },
    { id: uuidv4(), name: 'Travail', color: '#8B5CF6', icon: '💼', createdAt: new Date().toISOString() }
  ],
  goals: [
    {
      id: uuidv4(), title: 'Lire 2 livres ce mois', period: 'monthly',
      target: 2, current: 0, color: '#C9A84C', createdAt: new Date().toISOString()
    },
    {
      id: uuidv4(), title: 'Faire 3 sessions de sport cette semaine', period: 'weekly',
      target: 3, current: 1, color: '#34A853', createdAt: new Date().toISOString()
    }
  ],
  habits: [
    {
      id: uuidv4(), name: 'Méditation', emoji: '🧘', color: '#8B5CF6',
      completions: {}, createdAt: new Date().toISOString()
    },
    {
      id: uuidv4(), name: 'Sport', emoji: '💪', color: '#34A853',
      completions: {}, createdAt: new Date().toISOString()
    },
    {
      id: uuidv4(), name: 'Lecture', emoji: '📚', color: '#C9A84C',
      completions: {}, createdAt: new Date().toISOString()
    }
  ]
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_DATA
    return JSON.parse(raw)
  } catch { return DEFAULT_DATA }
}

function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

export function useStore() {
  const [data, setData] = useState(loadData)

  const update = useCallback((updater) => {
    setData(prev => {
      const next = updater(prev)
      saveData(next)
      return next
    })
  }, [])

  // TASKS
  const addTask = useCallback((task) => {
    update(prev => ({
      ...prev,
      tasks: [{ id: uuidv4(), completed: false, subtasks: [], tags: [], createdAt: new Date().toISOString(), ...task }, ...prev.tasks]
    }))
  }, [update])

  const updateTask = useCallback((id, changes) => {
    update(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === id ? { ...t, ...changes } : t) }))
  }, [update])

  const deleteTask = useCallback((id) => {
    update(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }))
  }, [update])

  const toggleTask = useCallback((id) => {
    update(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t) }))
  }, [update])

  const toggleSubtask = useCallback((taskId, subtaskId) => {
    update(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId
        ? { ...t, subtasks: t.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s) }
        : t)
    }))
  }, [update])

  const addSubtask = useCallback((taskId, title) => {
    update(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId
        ? { ...t, subtasks: [...(t.subtasks || []), { id: uuidv4(), title, completed: false }] }
        : t)
    }))
  }, [update])

  // PROJECTS
  const addProject = useCallback((project) => {
    update(prev => ({ ...prev, projects: [...prev.projects, { id: uuidv4(), createdAt: new Date().toISOString(), ...project }] }))
  }, [update])

  const deleteProject = useCallback((id) => {
    update(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
      tasks: prev.tasks.map(t => t.projectId === id ? { ...t, projectId: null } : t)
    }))
  }, [update])

  // GOALS
  const addGoal = useCallback((goal) => {
    update(prev => ({ ...prev, goals: [...prev.goals, { id: uuidv4(), current: 0, createdAt: new Date().toISOString(), ...goal }] }))
  }, [update])

  const updateGoal = useCallback((id, changes) => {
    update(prev => ({ ...prev, goals: prev.goals.map(g => g.id === id ? { ...g, ...changes } : g) }))
  }, [update])

  const deleteGoal = useCallback((id) => {
    update(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }))
  }, [update])

  // HABITS
  const addHabit = useCallback((habit) => {
    update(prev => ({ ...prev, habits: [...prev.habits, { id: uuidv4(), completions: {}, createdAt: new Date().toISOString(), ...habit }] }))
  }, [update])

  const toggleHabitDay = useCallback((habitId, dateStr) => {
    update(prev => ({
      ...prev,
      habits: prev.habits.map(h => h.id === habitId
        ? { ...h, completions: { ...h.completions, [dateStr]: !h.completions[dateStr] } }
        : h)
    }))
  }, [update])

  const deleteHabit = useCallback((id) => {
    update(prev => ({ ...prev, habits: prev.habits.filter(h => h.id !== id) }))
  }, [update])

  // Derived
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const todayTasks = data.tasks.filter(t => t.dueDate === todayStr && !t.completed)
  const overdueTasks = data.tasks.filter(t => t.dueDate && t.dueDate < todayStr && !t.completed)
  const completedToday = data.tasks.filter(t => t.completed && t.dueDate === todayStr)

  return {
    tasks: data.tasks, projects: data.projects, goals: data.goals, habits: data.habits,
    todayTasks, overdueTasks, completedToday,
    addTask, updateTask, deleteTask, toggleTask, toggleSubtask, addSubtask,
    addProject, deleteProject,
    addGoal, updateGoal, deleteGoal,
    addHabit, toggleHabitDay, deleteHabit
  }
}
