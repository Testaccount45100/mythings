import React, { useState } from 'react'
import { Sun, Inbox, FolderOpen, Target, Repeat } from 'lucide-react'
import { useStore } from './store/useStore'
import TodayView from './components/TodayView'
import InboxView from './components/InboxView'
import ProjectsView from './components/ProjectsView'
import GoalsView from './components/GoalsView'
import HabitsView from './components/HabitsView'

const NAV = [
  { id: 'today', label: "Aujourd'hui", icon: Sun, color: '#F59E0B' },
  { id: 'inbox', label: 'Tâches', icon: Inbox, color: '#3B82F6' },
  { id: 'projects', label: 'Projets', icon: FolderOpen, color: '#8B5CF6' },
  { id: 'goals', label: 'Objectifs', icon: Target, color: '#34A853' },
  { id: 'habits', label: 'Habitudes', icon: Repeat, color: '#E05252' },
]

export default function App() {
  const [view, setView] = useState('today')
  const store = useStore()

  const getBadge = (id) => {
    if (id === 'today') return store.todayTasks.length + store.overdueTasks.length
    if (id === 'inbox') return store.tasks.filter(t => !t.completed).length
    if (id === 'projects') return store.projects.length
    if (id === 'goals') return store.goals.length
    return store.habits.length
  }

  const renderView = () => {
    switch (view) {
      case 'today': return (
        <TodayView
          tasks={store.tasks}
          projects={store.projects}
          todayTasks={store.todayTasks}
          overdueTasks={store.overdueTasks}
          completedToday={store.completedToday}
          onToggle={store.toggleTask}
          onToggleSubtask={store.toggleSubtask}
          onAddTask={store.addTask}
          onUpdateTask={store.updateTask}
          onDeleteTask={store.deleteTask}
        />
      )
      case 'inbox': return (
        <InboxView
          tasks={store.tasks}
          projects={store.projects}
          onToggle={store.toggleTask}
          onToggleSubtask={store.toggleSubtask}
          onAddTask={store.addTask}
          onUpdateTask={store.updateTask}
          onDeleteTask={store.deleteTask}
        />
      )
      case 'projects': return (
        <ProjectsView
          tasks={store.tasks}
          projects={store.projects}
          onToggle={store.toggleTask}
          onToggleSubtask={store.toggleSubtask}
          onAddTask={store.addTask}
          onUpdateTask={store.updateTask}
          onDeleteTask={store.deleteTask}
          onAddProject={store.addProject}
          onDeleteProject={store.deleteProject}
        />
      )
      case 'goals': return (
        <GoalsView
          goals={store.goals}
          onAdd={store.addGoal}
          onUpdate={store.updateGoal}
          onDelete={store.deleteGoal}
        />
      )
      case 'habits': return (
        <HabitsView
          habits={store.habits}
          onToggleDay={store.toggleHabitDay}
          onAdd={store.addHabit}
          onDelete={store.deleteHabit}
        />
      )
      default: return null
    }
  }

  return (
    <div className="app-layout">
      {/* Sidebar desktop */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">My<span>Things</span></div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-title">Navigation</div>
          {NAV.map(item => {
            const Icon = item.icon
            const count = getBadge(item.id)
            return (
              <div
                key={item.id}
                className={`sidebar-item ${view === item.id ? 'active' : ''}`}
                onClick={() => setView(item.id)}
              >
                <div className="sidebar-item-icon" style={{ background: view === item.id ? item.color + '22' : 'transparent' }}>
                  <Icon size={15} color={view === item.id ? item.color : 'var(--text-muted)'} />
                </div>
                <span>{item.label}</span>
                {count > 0 && <span className="sidebar-item-count">{count}</span>}
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Aujourd'hui</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
            <div>✅ {store.completedToday.length} terminées</div>
            <div>📋 {store.todayTasks.length} restantes</div>
            {store.overdueTasks.length > 0 && (
              <div style={{ color: 'var(--accent-red)' }}>⚠ {store.overdueTasks.length} en retard</div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        {renderView()}
      </main>

      {/* Bottom nav mobile */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {NAV.map(item => {
            const Icon = item.icon
            const badge = getBadge(item.id)
            const isActive = view === item.id
            return (
              <div
                key={item.id}
                className={`bottom-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setView(item.id)}
              >
                <div className="bottom-nav-icon-wrap">
                  <Icon
                    size={20}
                    color={isActive ? item.color : 'var(--text-muted)'}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  {badge > 0 && <span className="bottom-nav-badge">{badge > 99 ? '99+' : badge}</span>}
                </div>
                <span className="bottom-nav-label">{item.label}</span>
              </div>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
