import React from 'react';
import { Timer, TimerStatus } from '../types';

interface TimerDisplayProps {
  timer: Timer;
  timeLeft: number;
  totalDuration: number;
  totalTimeElapsed: number;
  status: TimerStatus;
  onTimeAdjust: (newElapsedTime: number) => void;
  onScrubStart: () => void;
  onScrubEnd: () => void;
}

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const TimerDisplay: React.FC<TimerDisplayProps> = ({ 
  timer, 
  timeLeft, 
  totalDuration, 
  totalTimeElapsed, 
  status,
  onTimeAdjust,
  onScrubStart,
  onScrubEnd,
}) => {
  const currentProgress = timer.duration > 0 ? ((timer.duration - timeLeft) / timer.duration) * 100 : 0;
  const totalProgress = totalDuration > 0 ? (totalTimeElapsed / totalDuration) * 100 : 0;

  let statusText = "Ready to start";
  if (status === TimerStatus.RUNNING) statusText = "In Progress...";
  if (status === TimerStatus.PAUSED) statusText = "Paused";
  if (status === TimerStatus.COMPLETED) statusText = "Schedule Complete!";

  const isAdjustable = status === TimerStatus.RUNNING || status === TimerStatus.PAUSED;
  const sliderStyle = { '--progress': `${currentProgress}%` } as React.CSSProperties;
  
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-teal-400 mb-2">
        {status === TimerStatus.COMPLETED ? 'Finished' : 'Current Activity'}
      </h2>
      <p className="text-3xl sm:text-4xl font-bold text-slate-100 truncate max-w-full px-4">
        {timer.name}
      </p>
      
      <div className="my-6">
        <p className="text-6xl sm:text-8xl font-mono font-extrabold text-white tracking-tighter">
          {formatTime(timeLeft)}
        </p>
      </div>

      <div className="w-full max-w-md px-4 space-y-2">
         {isAdjustable && (
          <div className="py-2">
            <input
              type="range"
              min="0"
              max={timer.duration}
              value={timer.duration - timeLeft}
              onChange={(e) => onTimeAdjust(parseInt(e.target.value, 10))}
              onMouseDown={onScrubStart}
              onMouseUp={onScrubEnd}
              onTouchStart={onScrubStart}
              onTouchEnd={onScrubEnd}
              className="w-full"
              style={sliderStyle}
              aria-label="Adjust timer progress"
            />
          </div>
        )}
        <div className="space-y-4 pt-2">
            <div>
                <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-teal-500 transition-all duration-500 ease-out"
                        style={{ width: `${currentProgress}%` }}
                    ></div>
                </div>
                <p className="text-xs text-slate-400 mt-1 text-right">Activity Progress</p>
            </div>
            <div>
                <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-500 ease-out"
                        style={{ width: `${totalProgress}%` }}
                    ></div>
                </div>
                <p className="text-xs text-slate-400 mt-1 text-right">Total Progress</p>
            </div>
        </div>
      </div>
       <p className="text-slate-400 mt-6 text-sm">{statusText}</p>
    </div>
  );
};

export default TimerDisplay;