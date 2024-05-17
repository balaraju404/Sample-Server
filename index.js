const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URL || 'mongodb+srv://gandhambalaraju18:Balaraju%4018@cluster0.zresrux.mongodb.net/balaraju')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
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

app.post('/users', (req, res) => {
    const { name, email } = req.body;
    const user = new User({ name, email });

    user.save()
        .then(() => {
            res.status(201).send('User created successfully');
        })
        .catch((err) => {
            res.status(400).send('Error creating user:', err);
        });
});

app.get('/users', (req, res) => {
    User.find()
        .then((users) => {
            res.send(users);
        })
        .catch((err) => {
            res.status(500).send('Error fetching users:', err);
        });
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
