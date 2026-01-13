
export interface PlayerData {
  id: string;
  name: string;
  color: string;
  values: number[]; // Must match length of categories
  visible?: boolean;
  image?: string; // Base64 string or URL
  // Technical profile fields
  nationality?: string;
  birthDate?: string;
  position?: string;
  marketValue?: string;
  minutesPlayed?: string; // Total minutes played
  competition?: string; // League or Tournament name
  // Visual technical fields
  heatmapImage?: string; // Base64 string
  pitchPositionImage?: string; // Base64 string
}

export interface ChartConfig {
  categories: string[];
  players: PlayerData[];
  title: string;
  teamLogo?: string; // Base64 string for the club badge
  observations?: string; // Scout's technical notes
}

export interface RadarDataPoint {
  subject: string;
  [playerKey: string]: string | number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface CustomTemplate {
  id: string;
  name: string;
  categories: string[];
}

export interface SavedReport {
  id: string;
  name: string;
  timestamp: number;
  config: ChartConfig;
}
