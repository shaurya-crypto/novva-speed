// const express = require('express');
// const app = express();
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const path = require('path');
// require('dotenv').config();

// const formData = require('./models/form.model');

// PORT = process.env.PORT || 3000;

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/public', express.static(path.join(__dirname, 'public')));
// app.set('views', path.join(__dirname, 'views'));


// // mongoose.connect(process.env.MONGO + process.env.PASS, {
// // }).then(() => {
// //     console.log('Connected to MongoDB');
// // }).catch(err => {
// //     console.error('MongoDB connection error:', err);
// // });


// let isconnected = false;

// async function connectedtoDB() {
//     if (isconnected) {
//         return;
//     }
//     try {
//         await mongoose.connect(process.env.MONGO + process.env.PASS, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });
//         isconnected = true;
//         console.log('Connected to MongoDB');
//     } catch (err) {
//         console.error('MongoDB connection error:', err);
//     }
// }

// app.use(async (req, res, next) => {
//     if (!isconnected) {
//         await connectedtoDB();
//     }
//     next();
// });


// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'index.html'));
// });

// app.get('/auth/joinus', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'join-forms.html'));
// });

// app.post('/auth/submit', async (req, res) => {
//     try {
//         console.log("Received Data:", req.body);

//         const application = new formData({
//             //  1: Identity
//             fullName: req.body.fullName,
//             email: req.body.email,
//             phone: req.body.phone,
//             age: req.body.age,
//             city: req.body.city,
//             discordUsername: req.body.discordUsername,

//             // 2: Neural Alignment
//             primarySkillset: req.body.primarySkillset,
//             startupIdea: req.body.startupIdea,
//             portfolioLink: req.body.portfolioLink,
//             yearsExperience: req.body.yearsExperience,
//             preferredLanguage: req.body.preferredLanguage,

//             //  3: Operational Capacity
//             weeklyAvailability: req.body.weeklyAvailability,
//             workStyle: req.body.workStyle,
//             biggestWeakness: req.body.biggestWeakness,
//             longTermGoal: req.body.longTermGoal,
//             referralSource: req.body.referralSource,

//             //  4: Final Protocol
//             whyNovaa: req.body.whyNovaa,
//             termsAccepted: req.body.terms === 'on'
//         });

//         await application.save();
//         res.sendFile(path.join(__dirname, 'views', 'submission-success.html'));

//     } catch (error) {
//         console.error('Error saving application:', error);
//         res.status(500).send(`Error: ${error.message}`);
//     }
// });

// app.get('/admin', async (req, res) => {
//     try {
//         const applications = await formData.find();
//         res.json(applications);
//     } catch (error) {
//         console.error('Error fetching applications:', error);
//         res.status(500).send(`Error: ${error.message}`);
//     }
// });

// // app.listen(PORT, () => {
// //     console.log(`Server is running on http://localhost:${PORT}`);
// // });
// if (require.main === module) {
//     app.listen(PORT, () => {
//         console.log(`Server is running on http://localhost:${PORT}`);
//     });
// }

// module.exports = app;

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const FormData = require('./models/form.model');

const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));


let isConnected = false;

async function connectToDB() {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGO + process.env.PASS);
        isConnected = true;
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}


app.use(async (req, res, next) => {
    if (!isConnected) {
        await connectToDB();
    }
    next();
});


//route

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/auth/joinus', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'join-forms.html'));
});

app.post('/auth/submit', async (req, res) => {
    try {
        console.log("Received Application:", req.body);

        const application = new FormData({
            //  1
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            age: req.body.age,
            city: req.body.city,
            lang: req.body.lang,

            // 2
            educationStatus: req.body.educationStatus,
            studentClass: req.body.studentClass,
            collegeCourse: req.body.collegeCourse,
            collegeYear: req.body.collegeYear,
            linkedinLink: req.body.linkedinlink,
            portfolioLink: req.body.portfolioLink,
            yearsExperience: req.body.yearsExperience,
            preferredLanguage: req.body.preferredLanguage,

            // 3
            weeklyAvailability: req.body.weeklyAvailability,
            longTermGoal: req.body.longTermGoal,
            referralSource: req.body.referralSource,

            //4
            timeToLearn: req.body.timetolearn,
            whyNovaa: req.body.whyNovaa,
            termsAccepted: req.body.terms === 'on'
        });

        await application.save();
        res.sendFile(path.join(__dirname, 'views', 'submission-success.html'));

    } catch (error) {
        console.error('Error saving application:', error);
        res.status(500).send(`
            <h1>Submission Failed</h1>
            <p>Error: ${error.message}</p>
            <p>Please check that all required fields are filled and try again.</p>
        `);
    }
});


app.get('/admin', async (req, res) => {
    try {
        const applications = await FormData.find().sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;