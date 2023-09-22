const express = require('express');
const client = require('prom-client');
const healthRouter = express.Router();

// Create a new counter metric
const numRequests = new client.Counter({
   name: 'num_requests',
   help: 'Number of requests made'
});

// Get metrics
healthRouter.route('/metrics').get(async (req, res) => {
   try {
      // Increment the counter
      numRequests.inc();
      const metrics = await client.register.metrics();
      res.set('Content-Type', client.register.contentType);
      res.end(metrics);
   } catch (error) {
      console.error('Could not get metrics:', error);
      res.status(500).json({ error: 'Failed to retrieve metrics' });
   }
});

module.exports = healthRouter;
