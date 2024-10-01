import type { Task } from "./config";

export type Point = {
  id: string;
  task: Task;
  point: number;
  user: string;
  timestamp: string;
};
