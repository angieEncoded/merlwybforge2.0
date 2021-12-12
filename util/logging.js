import 'winston-daily-rotate-file'

import path from 'path'
import winston from 'winston'

const rootpath = path.resolve("./") // Get the root pathname of one directory up
const rootdir = path.join(rootpath, 'logs');
// console.log(rootdir)
// const { createLogger, format, transports, winston } = require('winston');



const transportToFile = new (winston.transports.DailyRotateFile)({
	filename: 'Merlwyb-%DATE%.log',
	dirname: rootdir,
	datePattern: 'YYYY-MM-DD-HH',
	zippedArchive: true,
	maxSize: '10m',
	maxFiles: '300'
})

const logger = winston.createLogger({
	format: winston.format.combine(
		winston.format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss'
		}),
		winston.format.errors({ stack: true }),
		winston.format.splat(),
		winston.format.prettyPrint()
	),
	defaultMeta: { service: 'MerlwybSenpaiDiscordBot' },
	transports: [ // transport caught errors
		// new winston.transports.Console(),
		transportToFile,
	],
	exceptionHandlers: [ // catch uncaught exceptions
		// new winston.transports.Console(),
		transportToFile
	]
})

export default logger