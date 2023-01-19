const log4js = require("log4js");

log4js.configure({
  appenders: {
    infoFile: { type: "console" },
    warnFile: { type: "file", filename: "warn.log" },
    errorFile: { type: "file", filename: "error.log" },
    mylogFile: {
      type: "logLevelFilter",
      appender: "infoFile",
      level: "info",
    },
    myWarnFile: {
      type: "logLevelFilter",
      appender: "warnFile",
      level: "warn",
    },
    myErrorFile: {
      type: "logLevelFilter",
      appender: "errorFile",
      level: "error",
    },
  },
  categories: {
    default: {
      appenders: ["mylogFile", "myWarnFile", "myErrorFile"],
      level: "all",
    },
    myLog: {
      appenders: ["mylogFile", "myWarnFile", "myErrorFile"],
      level: "all",
    },
  },
});

const defaultLogger = log4js.getLogger();
module.exports = defaultLogger;
