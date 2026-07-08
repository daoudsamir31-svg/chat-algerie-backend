const express = require('express');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ====== Routes ======
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('🌍 Chatalgerie API is running!');
});

// ====== Start server with database connection retry ======
const startServer = async () => {
    try {
        await User.createTable();
        console.log('✅ Users table ready');
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        // إعادة المحاولة بعد 5 ثواني
        setTimeout(startServer, 5000);
    }
};

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    startServer();
});
