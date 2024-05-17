const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB connection
async function connectToMongoDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL || 'mongodb+srv://gandhambalaraju18:Balaraju%4018@cluster0.zresrux.mongodb.net/balaraju', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error while connecting to MongoDB:', err);
    }
}

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
        res.status(400).send('Error creating user:', err);
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (err) {
        res.status(500).send('Error fetching users:', err);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
    await connectToMongoDB();
    console.log(`Server running at PORT ${PORT}`);
});
