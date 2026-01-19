const express = require('express');
const { updateAndPrintErrors } = require('../utils/error_tracker');
const telemetryRouterCreate = require('../routes/telemetry.publish.js');
const telemetryRouterRead = require('../routes/telemetry.read.js');
const telemetryRouterDelete = require('../routes/telemetry.delete.js');

const app = express();
app.use(express.json());

// Routes
app.use('/telemetry', telemetryRouterCreate);   // Send to RabbitMQ operations (Create and Update)
app.use('/telemetry', telemetryRouterRead);     // Read Operations
app.use('/telemetry', telemetryRouterDelete);   // Delete Operations



// Health check
app.get('/', (req, res) => {
    res.send('Server is running. Send a POST to /telemetry to see results.');
});

// Error handling middleware
app.use((err, req, res, next) => {
    updateAndPrintErrors(false);
    if (err instanceof SyntaxError && 'body' in err) {
        console.error('Bad JSON:', err.message);
        return res.status(400).send({ error: 'Invalid JSON' });
    }
    res.status(500).send({ error: 'Something went wrong' });
});

module.exports = app;
