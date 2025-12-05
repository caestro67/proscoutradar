import { ChartConfig } from './types';

// Palette for multiple players
export const PLAYER_COLORS = [
  '#38bdf8', // Light Blue
  '#f472b6', // Pink
  '#a3e635', // Lime
  '#fbbf24', // Amber
  '#c084fc', // Purple
];

// Based on the user's Python script example
export const INITIAL_DATA: ChartConfig = {
  title: "Player Possession Impact",
  categories: [
    "Touches",
    "Touches (Def Pen)",
    "Touches (Def 3rd)",
    "Touches (Mid 3rd)",
    "Touches (Att 3rd)",
    "Touches (Att Pen)",
    "Total Carry Dist",
    "Prog Carry Dist",
    "Carries Final 3rd",
    "Carries Pen Area"
  ],
  players: [
    {
      id: 'p1',
      name: 'Jugador A',
      color: PLAYER_COLORS[0],
      values: [76, 34, 95, 59, 40, 91, 71, 79, 1, 98]
    }
  ]
};

export const ALTERNATIVE_TEMPLATES = {
  POSSESSION: {
    categories: [
      "Touches",
      "Touches (Def Pen)",
      "Touches (Def 3rd)",
      "Touches (Mid 3rd)",
      "Touches (Att 3rd)",
      "Touches (Att Pen)",
      "Total Carry Dist",
      "Prog Carry Dist",
      "Carries Final 3rd",
      "Carries Pen Area"
    ],
    values: [76, 34, 95, 59, 40, 91, 71, 79, 1, 98]
  },
  ATTACK: {
    categories: ["Goals", "Shots", "SoT", "SoT %", "G/Sh", "xG", "SCA", "GCA"],
    values: [11, 80, 70, 65, 75, 85, 85, 85] // Default dummy values
  },
  DEFENSE: {
    categories: ["Tackles", "Tkl Won", "Int", "Blocks", "Clearances", "Aerials Won", "% Aerials", "Recoveries"],
    values: [60, 55, 70, 80, 45, 90, 85, 65]
  }
};