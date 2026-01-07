const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const formData = require('./models/form.model');

PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));


mongoose.connect(process.env.MONGO + process.env.PASS, {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/auth/joinus', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'join-forms.html'));
});

app.post('/auth/submit', async (req, res) => {
    try {
        console.log("Received Data:", req.body);

        const application = new formData({
            //  1: Identity
            fullName: req.body.fullName,
            age: req.body.age,
            email: req.body.email,
            city: req.body.city,
            discordUsername: req.body.discordUsername,

            // 2: Neural Alignment
            primarySkillset: req.body.primarySkillset,
            startupIdea: req.body.startupIdea,
            portfolioLink: req.body.portfolioLink,
            yearsExperience: req.body.yearsExperience,
            preferredLanguage: req.body.preferredLanguage,

            //  3: Operational Capacity
            weeklyAvailability: req.body.weeklyAvailability,
            workStyle: req.body.workStyle,
            biggestWeakness: req.body.biggestWeakness,
            longTermGoal: req.body.longTermGoal,
            referralSource: req.body.referralSource,

            //  4: Final Protocol
            whyNovaa: req.body.whyNovaa,
            termsAccepted: req.body.terms === 'on'
        });

        await application.save();
        res.sendFile(path.join(__dirname, 'views', 'submission-success.html'));

    } catch (error) {
        console.error('Error saving application:', error);
        res.status(500).send(`Error: ${error.message}`);
    }
});

app.get('/admin', async (req, res) => {
    try {
        const applications = await formData.find();
        res.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).send(`Error: ${error.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});