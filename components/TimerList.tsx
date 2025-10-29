import React, { useMemo } from 'react';
import { Timer, TimerStatus } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface TimerListProps {
  timers: Timer[];
  onRemoveTimer: (id: string) => void;
  currentTimerId?: string;
  status: TimerStatus;
  scheduleStartTime: Date | null;
  completionLog: { [timerId: string]: number };
}

const formatDuration = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

const TimerList: React.FC<TimerListProps> = ({ timers, onRemoveTimer, currentTimerId, status, scheduleStartTime, completionLog }) => {
  const scheduleTimes = useMemo(() => {
    if (!scheduleStartTime || status === TimerStatus.IDLE) return {};
    const times: { [timerId: string]: { start: Date; end: Date } } = {};
    let lastEndTime = scheduleStartTime.getTime();

    for (const timer of timers) {
      const startTime = new Date(lastEndTime);
      let endTime;
      if (completionLog[timer.id]) {
        endTime = new Date(completionLog[timer.id]);
      } else {
        endTime = new Date(lastEndTime + timer.duration * 1000);
      }
      times[timer.id] = { start: startTime, end: endTime };
      lastEndTime = endTime.getTime();
    }
    return times;
  }, [timers, scheduleStartTime, status, completionLog]);


  if (timers.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center">
        <h2 className="text-xl font-semibold text-slate-200 mb-4">Your Schedule</h2>
        <p className="text-slate-400">Your timer sequence will appear here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
        <h2 className="text-xl font-semibold text-slate-200 mb-4">Your Schedule</h2>
        <ul className="space-y-3 overflow-y-auto pr-2 flex-grow">
            {timers.map((timer) => {
                const isActive = timer.id === currentTimerId && (status === TimerStatus.RUNNING || status === TimerStatus.PAUSED);
                const times = scheduleTimes[timer.id];
                
                let timeSaved = 0;
                if (times && completionLog[timer.id]) {
                    const actualDuration = (times.end.getTime() - times.start.getTime()) / 1000;
                    if (actualDuration < timer.duration) {
                        timeSaved = timer.duration - actualDuration;
                    }
                }
                const wasCompletedEarly = timeSaved > 1;

                return (
                    <li
                        key={timer.id}
                        className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                            isActive ? 'bg-teal-500/20 ring-2 ring-teal-500' : 'bg-slate-700/50'
                        }`}
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className={`font-medium truncate ${isActive ? 'text-teal-300' : 'text-slate-200'}`}>{timer.name}</span>
                                {times && (
                                    <span className={`text-xs font-mono flex-shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-500'}`}>
                                        {formatTime(times.start)} - {formatTime(times.end)}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${isActive ? 'text-teal-400' : 'text-slate-400'}`}>{formatDuration(timer.duration)}</span>
                                {wasCompletedEarly && (
                                    <span className="text-xs font-medium text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                                        Saved {Math.round(timeSaved)}s
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => onRemoveTimer(timer.id)}
                            className="text-slate-500 hover:text-red-500 transition-colors p-2 ml-2 rounded-full hover:bg-red-500/10 flex-shrink-0"
                            aria-label={`Remove ${timer.name}`}
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </li>
                );
            })}
        </ul>
    </div>
  );
};

export default TimerList;