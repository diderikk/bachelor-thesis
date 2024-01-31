import pino from "pino";

const levels = {
  http: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

const pinoConfig = {
  customLevels: levels, // our defined levels
  useOnlyCustomLevels: true,
  base: undefined,
  transport: {
    target: "pino-pretty", // formatting
    options: {
      colorize: true, // Adds colors to format
	  levelFirst: true, 
    	translateTime: "yyyy-dd-mm, h:MM:ss TT", // Time formatting
    },
  },
};

const logger = pino(pinoConfig);
export default logger;
