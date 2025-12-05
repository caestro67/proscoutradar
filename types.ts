export interface PlayerData {
  id: string;
  name: string;
  color: string;
  values: number[]; // Must match length of categories
}

export interface ChartConfig {
  categories: string[];
  players: PlayerData[];
  title: string;
}

export interface RadarDataPoint {
  subject: string;
  [playerKey: string]: string | number;
}