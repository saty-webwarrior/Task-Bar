import React from 'react';
import TaskManager from './components/TaskManager';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <TaskManager />
      </div>
    </div>
  );
}

export default App;