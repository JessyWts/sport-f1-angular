export type Race = {
  id: number;
  competition: Competition;
  circuit: Circuit;
  season: number;
  type: string;
  laps: Laps;
  fastest_lap: FastestLap;
  distance: string;
  timezone: string;
  date: Date;
  weather: null;
  status: string;
};

export type Circuit = {
  id: number;
  name: string;
  image: string;
};

export type Competition = {
  id: number;
  name: string;
  location: Location;
};

export type Location = {
  country: string;
  city: string;
};

export type FastestLap = {
  driver: Driver;
  time: string;
};

export type Driver = {
  id: number;
};

export type Laps = {
  current: null;
  total: number;
};

export interface ApiResponse {
  get: string;
  parameters: any;
  errors: any[];
  results: number;
  response: any; // C'est ici que se trouve le tableau de courses
}
