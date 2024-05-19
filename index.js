const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB connection
async function connectToMongoDB(retries = 5) {
    const mongoUri = process.env.MONGO_URL || 'your-fallback-connection-string';
    while (retries) {
        try {
            await mongoose.connect(mongoUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            });
            console.log('Connected to MongoDB');
            break;
        } catch (err) {
            console.error('Error while connecting to MongoDB:', err);
            retries -= 1;
            console.log(`Retries left: ${retries}`);
            if (retries === 0) {
                console.error('Could not connect to MongoDB. Exiting...');
                process.exit(1);
            }
            // Wait 5 seconds before retrying
            await new Promise(res => setTimeout(res, 5000));
        }
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
        await connectToMongoDB();
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
        const users = await User.find();
        res.send(users);
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
app.listen(PORT, async () => {
    await connectToMongoDB();
    console.log(`Server running at PORT ${PORT}`);
});
