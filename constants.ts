
import { ChartConfig } from './types';

export const PLAYER_COLORS = [
  '#38bdf8', // Light Blue
  '#f472b6', // Pink
  '#a3e635', // Lime
  '#fbbf24', // Amber
  '#c084fc', // Purple
];

export const COUNTRIES = [
  "Afganistán", "Albania", "Alemania", "Andorra", "Angola", "Antigua y Barbuda", "Arabia Saudita", "Argelia", "Argentina", "Armenia", "Australia", "Austria", "Azerbaiyán",
  "Bahamas", "Bangladés", "Barbados", "Baréin", "Bélgica", "Belice", "Benín", "Bielorrusia", "Birmania", "Bolivia", "Bosnia y Herzegovina", "Botsuana", "Brasil", "Brunéi", "Bulgaria", "Burkina Faso", "Burundi", "Bután",
  "Cabo Verde", "Camboya", "Camerún", "Canadá", "Catar", "Chad", "Chile", "China", "Chipre", "Ciudad del Vaticano", "Colombia", "Comoras", "Corea del Norte", "Corea del Sur", "Costa de Marfil", "Costa Rica", "Croacia", "Cuba",
  "Dinamarca", "Dominica", "Ecuador", "Egipto", "El Salvador", "Emiratos Árabes Unidos", "Eritrea", "Eslovaquia", "Eslovenia", "España", "Estados Unidos", "Estonia", "Etiopía", "Filipinas", "Finlandia", "Fiyi", "Francia",
  "Gabón", "Gambia", "Georgia", "Ghana", "Granada", "Grecia", "Guatemala", "Guyana", "Guinea", "Guinea Ecuatorial", "Guinea-Bisáu", "Haití", "Honduras", "Hungría", "India", "Indonesia", "Irak", "Irán", "Irlanda", "Islandia",
  "Islas Marshall", "Islas Salomón", "Israel", "Italia", "Jamaica", "Japón", "Jordania", "Kazajistán", "Kenia", "Kirguistán", "Kiribati", "Kuwait", "Laos", "Lesoto", "Letonia", "Líbano", "Liberia", "Libia", "Liechtenstein", "Lituania", "Luxemburgo",
  "Macedonia del Norte", "Madagascar", "Malasia", "Malaui", "Maldivas", "Malí", "Malta", "Marruecos", "Mauricio", "Mauritania", "México", "Micronesia", "Moldavia", "Mónaco", "Mongolia", "Montenegro", "Mozambique", "Namibia", "Nauru", "Nepal", "Nicaragua", "Níger", "Nigeria", "Noruega", "Nueva Zelanda",
  "Omán", "Países Bajos", "Pakistán", "Palaos", "Panamá", "Papúa Nueva Guinea", "Paraguay", "Perú", "Polonia", "Portugal", "Reino Unido", "República Centroafricana", "República Checa", "República del Congo", "República Democrática del Congo", "República Dominicana", "Ruanda", "Rumanía", "Rusia",
  "Samoa", "San Cristóbal y Nieves", "San Marino", "San Vicente y las Granadinas", "Santa Lucía", "Santo Tomé y Príncipe", "Senegal", "Serbia", "Seychelles", "Sierra Leona", "Singapur", "Siria", "Somalia", "Sri Lanka", "Sudáfrica", "Sudán", "Sudán del Sur", "Suecia", "Suiza", "Surinam",
  "Tailandia", "Taiwán", "Tanzania", "Tayikistán", "Timor Oriental", "Togo", "Tonga", "Trinidad y Tobago", "Túnez", "Turkmenistán", "Turquía", "Tuvalu", "Ucrania", "Uganda", "Uruguay", "Uzbekistán", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Yibuti", "Zambia", "Zimbabue"
];

export const POSITIONS = [
  "Portero", "Defensa Central", "Líbero", "Lateral Derecho", "Lateral Izquierdo", "Carrilero Derecho", "Carrilero Izquierdo",
  "Pivote", "Mediocentro", "Interior", "Mediapunta", "Extremo Derecho", "Extremo Izquierdo", "Segundo Delantero", "Delantero Centro",
  "Extremo Invertido", "Pivote Organizador", "Falso 9", "Box-to-Box", "Enganche", "Stopper"
];

export const INITIAL_DATA: ChartConfig = {
  title: "ANÁLISIS DE RENDIMIENTO",
  categories: ["Velocidad", "Remate", "Pase", "Dribbling", "Defensa", "Físico"],
  players: [
    {
      id: "1",
      name: "Jugador Modelo",
      color: PLAYER_COLORS[0],
      values: [85, 78, 92, 88, 45, 70],
      visible: true,
      position: "Mediocentro",
      marketValue: "45M €",
      nationality: "España"
    }
  ],
  observations: "Perfil técnico de alta calidad con visión de juego superior."
};

export const ALTERNATIVE_TEMPLATES: Record<string, { categories: string[], values: number[] }> = {
  ATTACK: {
    categories: ["Finalización", "Velocidad", "Dribbling", "Desmarque", "Cabezazo", "Potencia"],
    values: [80, 85, 80, 75, 70, 75]
  },
  DEFENSE: {
    categories: ["Entradas", "Intercepciones", "Posicionamiento", "Fuerza", "Salto", "Agresividad"],
    values: [85, 80, 90, 85, 75, 80]
  },
  POSSESSION: {
    categories: ["Pase Corto", "Pase Largo", "Visión", "Control", "Agilidad", "Resistencia"],
    values: [90, 85, 88, 92, 80, 85]
  }
};
