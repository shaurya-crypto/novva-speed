
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

// app.get('/auth/joinus', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'join-forms.html'));
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
//             termsAccepted: req.body.terms === 'on',
//             status: 'pending'
//         });

//         await application.save();
//         res.sendFile(path.join(__dirname, 'views', 'submision.html'));

//     } catch (error) {
//         console.error('Error saving application:', error);
//         res.status(500).send(`Error: ${error.message}`);
//     }
// });

// app.get('/adminpanel', authenticate, (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'admin.html'));
// });

// app.get('/api/applications', authenticate, async (req, res) => {
//     try {
//         const applications = await FormData.find().sort({ createdAt: -1 });
//         res.json(applications);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.patch('/api/application/:id/status', authenticate, async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { status } = req.body;
//         await FormData.findByIdAndUpdate(id, { status });
//         res.json({ success: true });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.delete('/api/application/:id', authenticate, async (req, res) => {
//     try {
//         await FormData.findByIdAndDelete(req.params.id);
//         res.json({ success: true });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.get('/api/application/allinfo/:id', authenticate, async (req, res) => {
//     try {
//         const application = await FormData.findById(req.params.id);
//         if (!application) {
//             return res.status(404).send('Application not found');
//         }
//         res.json(application);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
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
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const FormData = require('./models/form.model');
const User = require('./models/user.model');

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

app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO + process.env.PASS,
        ttl: 14 * 24 * 60 * 60
    }),
    cookie: {
        maxAge: 14 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}));

const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/signup');
};

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

app.get('/login', (req, res) => {
    if (req.session.userId) return res.redirect('/');
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/signup', (req, res) => {
    if (req.session.userId) return res.redirect('/');
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});


// 1.
app.post('/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            return res.json({ success: false, message: 'Username or Email already taken.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            isAdmin: email === process.env.ADMIN_USER
        });

        await newUser.save();
        res.json({ success: true, redirect: '/' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'Invalid Email or Password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid Email or Password.' });
        }

        req.session.userId = user._id;
        res.json({ success: true, redirect: '/' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


app.get('/auth/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.redirect('/');
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

app.get('/auth/joinus', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'join-forms.html'));
});

app.post('/auth/submit', isAuthenticated, async (req, res) => {
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
        res.sendFile(path.join(__dirname, 'views', 'submission-success.html'));
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

app.get('/api/users', authenticate, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
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

app.get('/auth/check-status', (req, res) => {
    if (req.session.userId) {
        res.json({ loggedIn: true });
    } else {
        res.json({ loggedIn: false });
    }
});

app.get('/api/user/allinfo/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/profile', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'profile.html'));
});

app.get('/api/user/profile', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).select('-password');
        const application = await FormData.findOne({ email: user.email });

        res.json({
            user: user,
            hasSubmitted: !!application,
            applicationData: application
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.use(express.json({ limit: '10mb' }));

app.post('/api/user/update', isAuthenticated, async (req, res) => {
    try {
        const { username, bio, profilePic } = req.body;

        const updateData = { username, bio };

        if (profilePic) {
            updateData.profilePic = profilePic;
        }
        await User.findByIdAndUpdate(req.session.userId, updateData);

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Update failed" });
    }
});

app.delete('/api/user/:id', authenticate, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true });
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