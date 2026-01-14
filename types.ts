export interface Participant {
  id: string;
  name: string;
}

export enum AppView {
  INPUT = 'INPUT',
  LUCKY_DRAW = 'LUCKY_DRAW',
  GROUPING = 'GROUPING'
}

export interface Group {
  id: string;
  name: string;
  members: Participant[];
}
