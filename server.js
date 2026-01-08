
// const express = require('express');
// const app = express();
// const mongoose = require('mongoose');
// const path = require('path');
// require('dotenv').config();

// const FormData = require('./models/form.model');

// const PORT = process.env.PORT || 3000;

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use('/public', express.static(path.join(__dirname, 'public')));

// let isConnected = false;

// async function connectToDB() {
//     if (isConnected) return;
//     try {
//         await mongoose.connect(process.env.MONGO + process.env.PASS);
//         isConnected = true;
//         console.log('Connected to MongoDB');
//     } catch (err) {
//         console.error('MongoDB connection error:', err);
//     }
// }

// app.use(async (req, res, next) => {
//     if (!isConnected) {
//         await connectToDB();
//     }
//     next();
// });

// function authenticate(req, res, next) {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//         res.setHeader('WWW-Authenticate', 'Basic realm="Admin Access"');
//         return res.status(401).send('Authentication required.');
//     }

//     const base64Credentials = authHeader.split(' ')[1];
//     const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
//     const [username, password] = credentials.split(':');

//     if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
//         next();
//     } else {
//         res.setHeader('WWW-Authenticate', 'Basic realm="Admin Access"');
//         return res.status(401).send('Invalid Credentials.');
//     }
// }

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'index.html'));
// });

// app.post('/auth/submit', async (req, res) => {
//     try {
//         const application = new FormData({
//             fullName: req.body.fullName,
//             email: req.body.email,
//             phone: req.body.phone,
//             age: req.body.age,
//             city: req.body.city,
//             lang: req.body.lang,

//             educationStatus: req.body.educationStatus,
//             studentClass: req.body.studentClass,
//             collegeCourse: req.body.collegeCourse,
//             collegeYear: req.body.collegeYear,
//             linkedinLink: req.body.linkedinlink,
//             portfolioLink: req.body.portfolioLink,
//             yearsExperience: req.body.yearsExperience,
//             preferredLanguage: req.body.preferredLanguage,

//             weeklyAvailability: req.body.weeklyAvailability,
//             longTermGoal: req.body.longTermGoal,
//             referralSource: req.body.referralSource,

//             timeToLearn: req.body.timetolearn,
//             whyNovaa: req.body.whyNovaa,
//             termsAccepted: req.body.terms === 'on'
//         });

//         await application.save();
//         res.sendFile(path.join(__dirname, 'views', 'submision.html'));

//     } catch (error) {
//         console.error('Error saving application:', error);
//         res.status(500).send(`Error: ${error.message}`);
//     }
// });

// app.get('/admin', authenticate, async (req, res) => {
//     try {
//         const applications = await FormData.find().sort({ createdAt: -1 });
//         res.json(applications);
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });

// app.get('/s', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'submision.html'));
// });

// if (require.main === module) {
//     app.listen(PORT, () => {
//         console.log(`Server is running on http://localhost:${PORT}`);
//     });
// }

// module.exports = app;

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const FormData = require('./models/form.model');

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
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

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Admin Access"');
        return res.status(401).send('Authentication required.');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
        next();
    } else {
        res.setHeader('WWW-Authenticate', 'Basic realm="Admin Access"');
        return res.status(401).send('Invalid Credentials.');
    }
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/auth/joinus', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'join-forms.html'));
});

app.post('/auth/submit', async (req, res) => {
    try {
        const application = new FormData({
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            age: req.body.age,
            city: req.body.city,
            lang: req.body.lang,

            educationStatus: req.body.educationStatus,
            studentClass: req.body.studentClass,
            collegeCourse: req.body.collegeCourse,
            collegeYear: req.body.collegeYear,
            linkedinLink: req.body.linkedinlink,
            portfolioLink: req.body.portfolioLink,
            yearsExperience: req.body.yearsExperience,
            preferredLanguage: req.body.preferredLanguage,

            weeklyAvailability: req.body.weeklyAvailability,
            longTermGoal: req.body.longTermGoal,
            referralSource: req.body.referralSource,

            timeToLearn: req.body.timetolearn,
            whyNovaa: req.body.whyNovaa,
            termsAccepted: req.body.terms === 'on',
            status: 'pending'
        });

        await application.save();
        res.sendFile(path.join(__dirname, 'views', 'submision.html'));

    } catch (error) {
        console.error('Error saving application:', error);
        res.status(500).send(`Error: ${error.message}`);
    }
});

app.get('/adminpanel', authenticate, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

app.get('/api/applications', authenticate, async (req, res) => {
    try {
        const applications = await FormData.find().sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.patch('/api/application/:id/status', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await FormData.findByIdAndUpdate(id, { status });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/application/:id', authenticate, async (req, res) => {
    try {
        await FormData.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/application/allinfo/:id', authenticate, async (req, res) => {
    try {
        const application = await FormData.findById(req.params.id);
        if (!application) {
            return res.status(404).send('Application not found');
        }
        res.json(application);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;