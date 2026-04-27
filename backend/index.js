require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects'); 
const proposalRoutes = require('./routes/proposals'); 

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes); 
app.use('/api/proposals', proposalRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Backend running!' });
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
});

