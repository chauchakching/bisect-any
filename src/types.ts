
export type CheckFunc = (k: number) => boolean;

export type Report = {
  totalRounds: number;
  records: Record[];
};

export type Record = {
  goodVal: number;
  badVal: number;
};
