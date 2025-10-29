import React from 'react';
import { TimerStatus } from '../types';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { ResetIcon } from './icons/ResetIcon';

interface ControlsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  hasTimers: boolean;
}

const Controls: React.FC<ControlsProps> = ({ status, onStart, onPause, onReset, hasTimers }) => {
  const isRunning = status === TimerStatus.RUNNING;
  const isPaused = status === TimerStatus.PAUSED;
  const isIdle = status === TimerStatus.IDLE || status === TimerStatus.COMPLETED;

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={onReset}
        disabled={isIdle}
        className="flex items-center justify-center p-4 bg-slate-700 text-slate-300 rounded-full transition-all duration-300 hover:bg-slate-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700"
        aria-label="Reset Schedule"
      >
        <ResetIcon className="w-6 h-6" />
      </button>

      {isRunning ? (
        <button
          onClick={onPause}
          className="flex items-center justify-center w-20 h-20 bg-yellow-500 text-slate-900 rounded-full transition-transform duration-300 transform hover:scale-110 shadow-lg shadow-yellow-500/30"
          aria-label="Pause"
        >
          <PauseIcon className="w-10 h-10" />
        </button>
      ) : (
        <button
          onClick={onStart}
          disabled={!hasTimers}
          className={`flex items-center justify-center w-20 h-20 rounded-full transition-transform duration-300 transform hover:scale-110 ${isPaused ? 'bg-teal-500 shadow-lg shadow-teal-500/30' : 'bg-green-500 shadow-lg shadow-green-500/30'} text-slate-900 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none`}
          aria-label={isPaused ? 'Resume' : 'Start'}
        >
          <PlayIcon className="w-10 h-10 ml-1" />
        </button>
      )}

      {/* Placeholder to keep main button centered */}
      <div className="w-14 h-14"></div>
    </div>
  );
};

export default Controls;