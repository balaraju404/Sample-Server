const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB connection
const mongoUri = process.env.MONGO_URL || 'mongodb+srv://gandhambalaraju18:Balaraju%4018@cluster0.zresrux.mongodb.net/balaraju';
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error while connecting to MongoDB:', err);
});

// Define User model
const User = mongoose.model('User', {
    name: String,
    email: String,
});

// Routes
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/users', async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = new User({ name, email });
        await user.save();
        res.status(201).send('User created successfully');
    } catch (err) {
        res.status(400).send('Error creating user: ' + err.message);
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find().lean(); // Use lean() for faster query execution
        res.json(users);
    } catch (err) {
        res.status(500).send('Error fetching users: ' + err.message);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server running at PORT ${PORT}`);
});
