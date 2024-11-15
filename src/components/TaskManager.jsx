import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, CheckCircle, Circle, ArrowUpDown } from 'lucide-react';

const PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

function TaskManager() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('medium');
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task = {
      id: Date.now().toString(),
      title: newTask.trim(),
      completed: false,
      priority,
      createdAt: Date.now(),
    };

    setTasks([task, ...tasks]);
    setNewTask('');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const filteredAndSortedTasks = tasks
    .filter(task => 
      task.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.createdAt - a.createdAt;
    });

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 space-y-6 transition-all duration-300">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Task Manager</h1>
      
      <form onSubmit={addTask} className="space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
          >
            <Plus size={20} />
            Add
          </button>
        </div>
      </form>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setSortBy(prev => prev === 'createdAt' ? 'priority' : 'createdAt')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
        >
          <ArrowUpDown size={20} />
          {sortBy === 'createdAt' ? 'Sort by Priority' : 'Sort by Date'}
        </button>
      </div>

      <div className="space-y-3">
        {filteredAndSortedTasks.map(task => (
          <div
            key={task.id}
            className={`group flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-indigo-300 transition-all duration-200 ${
              task.completed ? 'bg-gray-50' : 'bg-white'
            }`}
          >
            <button
              onClick={() => toggleComplete(task.id)}
              className="text-gray-400 hover:text-indigo-600 transition-colors duration-200"
            >
              {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
            </button>
            <span className={`flex-1 text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {task.title}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${PRIORITY_COLORS[task.priority]}`}>
              {task.priority}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        {filteredAndSortedTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No tasks found. Add some tasks to get started!
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskManager;