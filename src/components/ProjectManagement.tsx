import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export const ProjectManagement: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Draft Foundation structural lines', category: 'CAD Drawing', status: 'todo', owner: 'Johnathan' },
    { id: '2', title: 'Verify south glass insulation load', category: 'AI Audit', status: 'doing', owner: 'KK OS' },
    { id: '3', title: 'Submit local structural permit forms', category: 'Government Compliance', status: 'done', owner: 'Amara' },
  ]);

  const handleAddTask = () => {
    const title = prompt('Enter task description:');
    if (!title) return;
    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      category: 'General Sprints',
      status: 'todo',
      owner: 'Corporate Partner',
    };
    setTasks([...tasks, newTask]);
  };

  const moveTask = (id: string, nextStatus: 'todo' | 'doing' | 'done') => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
    );
  };

  return (
    <div className="space-y-6 animate-fade-in" id="pm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Project Collaboration & Gantt</h3>
          <p className="text-white/45 text-xs">Coordinate engineering sprints with live team progress bars</p>
        </div>
        <button
          onClick={handleAddTask}
          className="px-4 py-2 rounded-lg bg-accent-cyan hover:bg-accent-cyan/80 text-dark font-bold text-xs flex items-center gap-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Assign Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TODO COLUMN */}
        <div className="glass-card rounded-2xl p-4 border border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-white/50">To Do</span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/60">
              {tasks.filter((t) => t.status === 'todo').length}
            </span>
          </div>

          <div className="space-y-3">
            {tasks
              .filter((t) => t.status === 'todo')
              .map((t) => (
                <div key={t.id} className="p-3 bg-white/5 border border-white/5 hover:border-white/10 rounded-xl space-y-2 transition">
                  <h5 className="text-white text-xs font-semibold">{t.title}</h5>
                  <div className="flex items-center justify-between text-[9px] text-white/40 font-mono">
                    <span>{t.category}</span>
                    <span className="text-accent-cyan">@{t.owner}</span>
                  </div>
                  <button
                    onClick={() => moveTask(t.id, 'doing')}
                    className="w-full py-1 text-[9px] bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/20 text-accent-cyan rounded font-semibold transition"
                  >
                    Start Task
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* DOING COLUMN */}
        <div className="glass-card rounded-2xl p-4 border border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-yellow-400">In Progress</span>
            <span className="text-[10px] bg-yellow-400/10 px-2 py-0.5 rounded text-yellow-400">
              {tasks.filter((t) => t.status === 'doing').length}
            </span>
          </div>

          <div className="space-y-3">
            {tasks
              .filter((t) => t.status === 'doing')
              .map((t) => (
                <div key={t.id} className="p-3 bg-white/5 border border-white/5 hover:border-white/10 rounded-xl space-y-2 transition">
                  <h5 className="text-white text-xs font-semibold">{t.title}</h5>
                  <div className="flex items-center justify-between text-[9px] text-white/40 font-mono">
                    <span>{t.category}</span>
                    <span className="text-yellow-400">@{t.owner}</span>
                  </div>
                  <button
                    onClick={() => moveTask(t.id, 'done')}
                    className="w-full py-1 text-[9px] bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 rounded font-semibold transition"
                  >
                    Complete Task
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* DONE COLUMN */}
        <div className="glass-card rounded-2xl p-4 border border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-green-400">Done</span>
            <span className="text-[10px] bg-green-400/10 px-2 py-0.5 rounded text-green-400">
              {tasks.filter((t) => t.status === 'done').length}
            </span>
          </div>

          <div className="space-y-3">
            {tasks
              .filter((t) => t.status === 'done')
              .map((t) => (
                <div key={t.id} className="p-3 bg-white/5 border border-white/5 hover:border-white/10 rounded-xl space-y-2 opacity-75 transition">
                  <h5 className="text-white text-xs font-semibold line-through">{t.title}</h5>
                  <div className="flex items-center justify-between text-[9px] text-white/30 font-mono">
                    <span>{t.category}</span>
                    <span className="text-green-400">@{t.owner}</span>
                  </div>
                  <button
                    onClick={() => moveTask(t.id, 'todo')}
                    className="w-full py-1 text-[9px] bg-white/5 hover:bg-white/10 border border-white/10 text-white/40 rounded font-semibold transition"
                  >
                    Re-open Task
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProjectManagement;
