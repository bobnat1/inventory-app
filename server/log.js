const winston = require('winston');
const { combine, timestamp, json } = winston.format;
require('winston-syslog').Syslog;

let logger;
const logLocation = (process.env.LOG_LOCATION|| '').toLowerCase();
const remoteIP = process.env.REMOTE_IP;

if (logLocation === "remote"){
  logger = winston.createLogger({
    level: 'info',   
    format: combine(timestamp(), json()),
    transports: [new winston.transports.Syslog({
      host: remoteIP, // Change this if rsyslog is on another server
      port: 514, // Default syslog port (UDP)
      protocol: "udp4", // Use "tcp4" if using TCP
      app_name: "inventory-app", // Identifies logs from this application
      facility: "local0", // Facility to use (local0–local7 for application logs)
      localhost: "inventory-app-server", // Override default hostname
      debug: true,
    })],
    
  });

} else {
  logger = winston.createLogger({
    level: 'info',
    format: combine(timestamp(), json()),
    transports: [new winston.transports.File({
      filename: '/var/log/inventory_app.log',
    })],
  });
}
module.exports = logger;