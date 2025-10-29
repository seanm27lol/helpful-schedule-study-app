import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Timer, TimerStatus } from './types';
import TimerForm from './components/TimerForm';
import TimerList from './components/TimerList';
import TimerDisplay from './components/TimerDisplay';
import Controls from './components/Controls';
import Clock from './components/Clock';
import { NOTIFICATION_SOUND_URL } from './constants';

const App: React.FC = () => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [currentTimerIndex, setCurrentTimerIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState<TimerStatus>(TimerStatus.IDLE);
  const [scheduleStartTime, setScheduleStartTime] = useState<Date | null>(null);
  const [completionLog, setCompletionLog] = useState<{ [timerId: string]: number }>({});
  const [isScrubbing, setIsScrubbing] = useState(false);

  const notificationAudio = useMemo(() => new Audio(NOTIFICATION_SOUND_URL), []);

  const playNotificationSound = useCallback(() => {
    notificationAudio.currentTime = 0;
    notificationAudio.play().catch(e => console.error("Error playing sound:", e));
  }, [notificationAudio]);

  const advanceToNextTimer = useCallback(() => {
    if (currentTimerIndex < timers.length - 1) {
      playNotificationSound();
      const nextIndex = currentTimerIndex + 1;
      setCurrentTimerIndex(nextIndex);
      setTimeLeft(timers[nextIndex].duration);
    } else {
      playNotificationSound();
      setStatus(TimerStatus.COMPLETED);
    }
  }, [currentTimerIndex, timers, playNotificationSound]);

  useEffect(() => {
    if (status === TimerStatus.RUNNING && timeLeft > 0 && !isScrubbing) {
      const interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (status === TimerStatus.RUNNING && timeLeft <= 0) {
      const currentTimerId = timers[currentTimerIndex]?.id;
      if (currentTimerId && !completionLog[currentTimerId]) {
         setCompletionLog(prev => ({ ...prev, [currentTimerId]: Date.now() }));
      }
      advanceToNextTimer();
    }
  }, [status, timeLeft, currentTimerIndex, timers, advanceToNextTimer, isScrubbing, completionLog]);

  const addTimer = (name: string, duration: number) => {
    const newTimer: Timer = { id: crypto.randomUUID(), name, duration };
    setTimers(prev => [...prev, newTimer]);
    if (status === TimerStatus.IDLE && timers.length === 0) {
      setTimeLeft(duration);
    }
  };

  const removeTimer = (id: string) => {
    setTimers(prev => prev.filter(timer => timer.id !== id));
     if (timers.length === 1) {
        handleReset();
    }
  };

  const handleStart = () => {
    if (timers.length > 0) {
      if (status === TimerStatus.IDLE || status === TimerStatus.COMPLETED) {
        setCurrentTimerIndex(0);
        setTimeLeft(timers[0].duration);
        setScheduleStartTime(new Date());
        setCompletionLog({});
      }
      setStatus(TimerStatus.RUNNING);
    }
  };

  const handlePause = () => {
    setStatus(TimerStatus.PAUSED);
  };
  
  const handleTimeAdjust = (newElapsedTime: number) => {
    const currentTimer = timers[currentTimerIndex];
    if (!currentTimer) return;
    const newTimeLeft = Math.max(0, currentTimer.duration - newElapsedTime);
    setTimeLeft(newTimeLeft);
  };

  const handleReset = () => {
    setStatus(TimerStatus.IDLE);
    setCurrentTimerIndex(0);
    setTimeLeft(timers.length > 0 ? timers[0].duration : 0);
    setScheduleStartTime(null);
    setCompletionLog({});
  };

  const totalDuration = useMemo(() => timers.reduce((acc, timer) => acc + timer.duration, 0), [timers]);
  
  const totalTimeElapsed = useMemo(() => {
    if (status === TimerStatus.IDLE) return 0;
    if (status === TimerStatus.COMPLETED) return totalDuration;

    const elapsedInPrevious = timers.slice(0, currentTimerIndex).reduce((acc, timer) => acc + timer.duration, 0);
    const elapsedInCurrent = (timers[currentTimerIndex]?.duration || 0) - timeLeft;
    return elapsedInPrevious + elapsedInCurrent;
  }, [timers, currentTimerIndex, timeLeft, status, totalDuration]);

  const currentTimer = timers.length > 0 ? timers[currentTimerIndex] : null;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
       <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 z-10">
        <Clock />
      </div>
      <div className="w-full max-w-2xl mx-auto flex flex-col">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            Schedule Timer
          </h1>
          <p className="text-slate-400 mt-2">Build your sequence and stay focused.</p>
        </header>

        <main className="flex-grow flex flex-col gap-8">
          <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700">
            {currentTimer ? (
              <TimerDisplay
                timer={currentTimer}
                timeLeft={timeLeft}
                totalDuration={totalDuration}
                totalTimeElapsed={totalTimeElapsed}
                status={status}
                onTimeAdjust={handleTimeAdjust}
                onScrubStart={() => setIsScrubbing(true)}
                onScrubEnd={() => setIsScrubbing(false)}
              />
            ) : (
                <div className="text-center py-16">
                    <h2 className="text-2xl font-semibold text-slate-300">Welcome!</h2>
                    <p className="text-slate-400 mt-2">Add a timer below to get started.</p>
                </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700">
              <TimerForm onAddTimer={addTimer} />
            </div>
            <div className="flex-1 bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700">
              <TimerList
                timers={timers}
                onRemoveTimer={removeTimer}
                currentTimerId={currentTimer?.id}
                status={status}
                scheduleStartTime={scheduleStartTime}
                completionLog={completionLog}
              />
            </div>
          </div>
        </main>

        <footer className="sticky bottom-0 mt-8 py-4 bg-slate-900/80 backdrop-blur-sm">
          <Controls
            status={status}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            hasTimers={timers.length > 0}
          />
        </footer>
      </div>
    </div>
  );
};

export default App;