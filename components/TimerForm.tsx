
import React, { useState } from 'react';

interface TimerFormProps {
  onAddTimer: (name: string, duration: number) => void;
}

const TimerForm: React.FC<TimerFormProps> = ({ onAddTimer }) => {
  const [name, setName] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const min = parseInt(minutes, 10) || 0;
    const sec = parseInt(seconds, 10) || 0;
    const duration = min * 60 + sec;

    if (name.trim() && duration > 0) {
      onAddTimer(name.trim(), duration);
      setName('');
      setMinutes('');
      setSeconds('');
    }
  };

  return (
    <div className="flex flex-col h-full">
        <h2 className="text-xl font-semibold text-slate-200 mb-4">Add New Timer</h2>
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col gap-4">
            <div>
                <label htmlFor="timer-name" className="block text-sm font-medium text-slate-400 mb-1">
                    Activity Name
                </label>
                <input
                    id="timer-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Warm-up"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                    required
                />
            </div>
            <div className="flex items-center gap-4">
                <div className="flex-1">
                     <label htmlFor="timer-minutes" className="block text-sm font-medium text-slate-400 mb-1">
                        Minutes
                    </label>
                    <input
                        id="timer-minutes"
                        type="number"
                        min="0"
                        max="999"
                        value={minutes}
                        onChange={(e) => setMinutes(e.target.value)}
                        placeholder="0"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                    />
                </div>
                 <div className="flex-1">
                     <label htmlFor="timer-seconds" className="block text-sm font-medium text-slate-400 mb-1">
                        Seconds
                    </label>
                    <input
                        id="timer-seconds"
                        type="number"
                        min="0"
                        max="59"
                        value={seconds}
                        onChange={(e) => setSeconds(e.target.value)}
                        placeholder="30"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                    />
                </div>
            </div>
             <div className="mt-auto">
                <button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={!name.trim() || (parseInt(minutes || '0') === 0 && parseInt(seconds || '0') === 0)}
                >
                    Add to Schedule
                </button>
            </div>
        </form>
    </div>
  );
};

export default TimerForm;
