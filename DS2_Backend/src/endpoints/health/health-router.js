const express = require('express');
const healthRouter = express.Router();
const ping = require('ping');
const os = require('os');
const si = require('systeminformation');
const healthService = require('./health-service');
const { LAN_IPS } = require('../../../config');

// LAN only application. This is to check if the local container has lost connectivity with the LAN.
const localLanPing = async () => {
   const hosts = [LAN_IPS];
   const numPings = 3;

   const promises = hosts.flatMap(host => {
      return Array.from({ length: numPings }, (_, i) => {
         return new Promise(resolve => ping.sys.probe(host, isAlive => resolve(isAlive)));
      });
   });

   const results = await Promise.all(promises);
   const groupedResults = chunkArray(results, numPings);

   const isNetworkOk = groupedResults.some(hostResults => {
      const successfulPings = hostResults.filter(Boolean).length;
      return successfulPings >= 2;
   });

   const currentTime = new Date().toLocaleString();

   if (isNetworkOk) {
      console.log(`[${currentTime}] - LAN PING - Status: 200`);
   } else {
      console.error(`[${currentTime}] - LAN PING - Status: 500`);
   }
};

// Helper function to chunk an array into smaller arrays
const chunkArray = (array, chunkSize) => {
   return Array.from({ length: Math.ceil(array.length / chunkSize) }, (_, i) => array.slice(i * chunkSize, i * chunkSize + chunkSize));
};

// Provide basic server status to front end.
healthRouter.route('/status').get(async (req, res) => {
   const db = req.app.get('db');

   try {
      // for memory
      const freeMemory = os.freemem() / (1024 * 1024);
      const totalMemory = os.totalmem() / (1024 * 1024);

      // for cpu
      const cpuData = await si.currentLoad();
      const cpuLoad = cpuData.currentLoad;

      const memory = {
         message: freeMemory > 100 ? 'UP' : 'DOWN',
         used: `${totalMemory.toFixed(2) - freeMemory.toFixed(2)}MB`,
         total: `${totalMemory.toFixed(2)}MB`
      };

      const cpu = {
         message: cpuLoad < 90 ? 'UP' : 'DOWN',
         load: `${cpuLoad.toFixed(2)}%`
      };

      const database = {
         message: healthService.dbStatus(db) ? 'UP' : 'DOWN'
      };

      res.send({
         memory,
         cpu,
         database,
         message: 'UP',
         status: 200
      });
   } catch (err) {
      console.log(err);
      res.send({
         message: err.message || 'An error occurred while checking the app health.',
         status: 500
      });
   }
});

module.exports = { healthRouter, localLanPing };
