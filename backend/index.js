require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
require('./db');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const proposalRoutes = require('./routes/proposals');
const negotiationRoutes = require('./routes/negotiations');
const deliveryRoutes = require('./routes/deliveries');
const scopeChangeRoutes = require('./routes/scopeChanges');
const notificationRoutes = require('./routes/notifications');

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/negotiations', negotiationRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/scope-changes', scopeChangeRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => res.json({ message: 'Backend running!' }));

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
});
