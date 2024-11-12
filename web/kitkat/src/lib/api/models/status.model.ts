export type Status = {
  user: {
    active: number;
    inactive: number;
  };
  tip: {
    completed: number;
    incomplete: number;
  };
};
