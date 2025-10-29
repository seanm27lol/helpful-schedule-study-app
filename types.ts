
export interface Timer {
  id: string;
  name: string;
  duration: number; // in seconds
}

export enum TimerStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
}
