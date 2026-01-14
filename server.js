

// // // // // // // const express = require('express');
// // // // // // // const app = express();
// // // // // // // const mongoose = require('mongoose');
// // // // // // // const path = require('path');
// // // // // // // const session = require('express-session');
// // // // // // // const MongoStore = require('connect-mongo');
// // // // // // // const bcrypt = require('bcryptjs');
// // // // // // // const passport = require('passport');
// // // // // // // const GoogleStrategy = require('passport-google-oauth20').Strategy;
// // // // // // // require('dotenv').config();

// // // // // // // const FormData = require('./models/form.model');
// // // // // // // const User = require('./models/user.model');
// // // // // // // const Project = require('./models/project.model');

// // // // // // // const PORT = process.env.PORT || 3000;

// // // // // // // app.use(express.urlencoded({ extended: true }));
// // // // // // // app.use(express.json({ limit: '10mb' }));
// // // // // // // app.use('/public', express.static(path.join(__dirname, 'public')));

// // // // // // // let isConnected = false;

// // // // // // // async function connectToDB() {
// // // // // // //     if (isConnected) return;
// // // // // // //     try {
// // // // // // //         await mongoose.connect(process.env.MONGO + process.env.PASS);
// // // // // // //         isConnected = true;
// // // // // // //         console.log('Connected to MongoDB');
// // // // // // //     } catch (err) {
// // // // // // //         console.error('MongoDB connection error:', err);
// // // // // // //     }
// // // // // // // }

// // // // // // // app.use(async (req, res, next) => {
// // // // // // //     if (!isConnected) {
// // // // // // //         await connectToDB();
// // // // // // //     }
// // // // // // //     next();
// // // // // // // });

// // // // // // // app.use(session({
// // // // // // //     secret: process.env.SESSION_SECRET || 'supersecretkey',
// // // // // // //     resave: false,
// // // // // // //     saveUninitialized: false,
// // // // // // //     store: MongoStore.create({
// // // // // // //         mongoUrl: process.env.MONGO + process.env.PASS,
// // // // // // //         ttl: 14 * 24 * 60 * 60
// // // // // // //     }),
// // // // // // //     cookie: {
// // // // // // //         maxAge: 14 * 24 * 60 * 60 * 1000,
// // // // // // //         httpOnly: true
// // // // // // //     }
// // // // // // // }));

// // // // // // // app.use(passport.initialize());

// // // // // // // passport.use(new GoogleStrategy({
// // // // // // //     clientID: process.env.GOOGLE_CLIENT_ID,
// // // // // // //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// // // // // // //     callbackURL: "/auth/google/callback",
// // // // // // //     proxy: true,
// // // // // // //     passReqToCallback: true
// // // // // // // },
// // // // // // //     async (req, accessToken, refreshToken, profile, done) => {
// // // // // // //         try {
// // // // // // //             let user = await User.findOne({ googleId: profile.id });
// // // // // // //             if (user) return done(null, user);

// // // // // // //             user = await User.findOne({ email: profile.emails[0].value });
// // // // // // //             if (user) {
// // // // // // //                 user.googleId = profile.id;
// // // // // // //                 if (user.profilePic.includes("flaticon")) {
// // // // // // //                     user.profilePic = profile.photos[0].value;
// // // // // // //                 }
// // // // // // //                 await user.save();
// // // // // // //                 return done(null, user);
// // // // // // //             }

// // // // // // //             if (req.session.authIntent === 'login') {
// // // // // // //                 return done(null, false, { message: 'signup_required' });
// // // // // // //             }

// // // // // // //             let newUsername = profile.displayName;
// // // // // // //             const checkUser = await User.findOne({ username: newUsername });
// // // // // // //             if (checkUser) {
// // // // // // //                 newUsername += Math.floor(1000 + Math.random() * 9000);
// // // // // // //             }

// // // // // // //             const roleToAssign = req.session.tempRole || 'talent';
// // // // // // //             const newUser = new User({
// // // // // // //                 username: newUsername,
// // // // // // //                 email: profile.emails[0].value,
// // // // // // //                 googleId: profile.id,
// // // // // // //                 profilePic: profile.photos[0].value,
// // // // // // //                 role: roleToAssign,
// // // // // // //                 isAdmin: false
// // // // // // //             });
// // // // // // //             await newUser.save();

// // // // // // //             delete req.session.tempRole;
// // // // // // //             delete req.session.authIntent;

// // // // // // //             return done(null, newUser);
// // // // // // //         } catch (err) {
// // // // // // //             return done(err, null);
// // // // // // //         }
// // // // // // //     }));

// // // // // // // app.get('/auth/google',
// // // // // // //     (req, res, next) => {
// // // // // // //         req.session.tempRole = req.query.role || 'talent';
// // // // // // //         req.session.authIntent = req.query.intent || 'signup';
// // // // // // //         req.session.save((err) => {
// // // // // // //             if (err) console.error(err);
// // // // // // //             next();
// // // // // // //         });
// // // // // // //     },
// // // // // // //     passport.authenticate('google', { scope: ['profile', 'email'] })
// // // // // // // );

// // // // // // // app.get('/auth/google/callback', (req, res, next) => {
// // // // // // //     passport.authenticate('google', { session: false }, (err, user, info) => {
// // // // // // //         if (err) return next(err);
// // // // // // //         if (!user) {
// // // // // // //             if (info && info.message === 'signup_required') {
// // // // // // //                 return res.redirect('/signup?msg=signup_first');
// // // // // // //             }
// // // // // // //             return res.redirect('/login?error=auth_failed');
// // // // // // //         }
// // // // // // //         req.session.userId = user._id;
// // // // // // //         delete req.session.authIntent;
// // // // // // //         res.redirect('/dashboard');
// // // // // // //     })(req, res, next);
// // // // // // // });

// // // // // // // const isAuthenticated = (req, res, next) => {
// // // // // // //     if (req.session.userId) {
// // // // // // //         return next();
// // // // // // //     }
// // // // // // //     res.redirect('/login');
// // // // // // // };

// // // // // // // function authenticate(req, res, next) {
// // // // // // //     const authHeader = req.headers.authorization;
// // // // // // //     if (!authHeader || !authHeader.startsWith('Basic ')) {
// // // // // // //         return res.status(401).json({ error: 'Authentication required' });
// // // // // // //     }

// // // // // // //     const base64Credentials = authHeader.split(' ')[1];
// // // // // // //     if (!base64Credentials) {
// // // // // // //         return res.status(401).json({ error: 'Invalid format' });
// // // // // // //     }

// // // // // // //     try {
// // // // // // //         const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
// // // // // // //         const index = credentials.indexOf(':');
// // // // // // //         if (index === -1) return res.status(401).json({ error: 'Invalid credentials format' });

// // // // // // //         const username = credentials.substring(0, index);
// // // // // // //         const password = credentials.substring(index + 1);

// // // // // // //         if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
// // // // // // //             next();
// // // // // // //         } else {
// // // // // // //             return res.status(401).json({ error: 'Invalid credentials' });
// // // // // // //         }
// // // // // // //     } catch (e) {
// // // // // // //         return res.status(400).json({ error: 'Bad Request' });
// // // // // // //     }
// // // // // // // }

// // // // // // // app.get('/', (req, res) => {
// // // // // // //     res.sendFile(path.join(__dirname, 'views', 'index.html'));
// // // // // // // });

// // // // // // // app.get('/login', (req, res) => {
// // // // // // //     if (req.session.userId) return res.redirect('/dashboard');
// // // // // // //     res.sendFile(path.join(__dirname, 'views', 'login.html'));
// // // // // // // });

// // // // // // // app.get('/signup', (req, res) => {
// // // // // // //     if (req.session.userId) return res.redirect('/dashboard');
// // // // // // //     res.sendFile(path.join(__dirname, 'views', 'signup.html'));
// // // // // // // });

// // // // // // // app.get('/more-info', (req, res) => {
// // // // // // //     res.sendFile(path.join(__dirname, 'views', 'more-info.html'));
// // // // // // // });

// // // // // // // app.post('/auth/register', async (req, res) => {
// // // // // // //     try {
// // // // // // //         const { username, email, password, role } = req.body;
// // // // // // //         const existingUser = await User.findOne({ $or: [{ email }, { username }] });
// // // // // // //         if (existingUser) return res.json({ success: false, message: 'Username or Email taken.' });

// // // // // // //         const hashedPassword = await bcrypt.hash(password, 10);
// // // // // // //         const newUser = new User({
// // // // // // //             username,
// // // // // // //             email,
// // // // // // //             password: hashedPassword,
// // // // // // //             role: role || 'talent',
// // // // // // //             isAdmin: false
// // // // // // //         });

// // // // // // //         await newUser.save();
// // // // // // //         req.session.userId = newUser._id;
// // // // // // //         res.json({ success: true, redirect: '/dashboard' });
// // // // // // //     } catch (error) {
// // // // // // //         res.status(500).json({ success: false, message: error.message });
// // // // // // //     }
// // // // // // // });

// // // // // // // app.post('/auth/login', async (req, res) => {
// // // // // // //     try {
// // // // // // //         const { email, password } = req.body;
// // // // // // //         const user = await User.findOne({ email });
// // // // // // //         if (!user) return res.json({ success: false, message: 'Invalid Email.' });
// // // // // // //         if (!user.password) return res.json({ success: false, message: 'Please login with Google.' });

// // // // // // //         const isMatch = await bcrypt.compare(password, user.password);
// // // // // // //         if (!isMatch) return res.json({ success: false, message: 'Invalid Password.' });

// // // // // // //         req.session.userId = user._id;
// // // // // // //         res.json({ success: true, redirect: '/dashboard' });
// // // // // // //     } catch (error) {
// // // // // // //         res.status(500).json({ success: false, message: error.message });
// // // // // // //     }
// // // // // // // });

// // // // // // // app.get('/auth/logout', (req, res) => {
// // // // // // //     req.session.destroy(err => {
// // // // // // //         if (err) return res.redirect('/');
// // // // // // //         res.clearCookie('connect.sid');
// // // // // // //         res.redirect('/login');
// // // // // // //     });
// // // // // // // });

// // // // // // // app.get('/auth/check-status', (req, res) => {
// // // // // // //     if (req.session.userId) {
// // // // // // //         res.json({ loggedIn: true });
// // // // // // //     } else {
// // // // // // //         res.json({ loggedIn: false });
// // // // // // //     }
// // // // // // // });

// // // // // // // app.get('/dashboard', isAuthenticated, async (req, res) => {
// // // // // // //     try {
// // // // // // //         const user = await User.findById(req.session.userId);
// // // // // // //         if (!user) return res.redirect('/login');
// // // // // // //         if (user.role === 'client') {
// // // // // // //             res.sendFile(path.join(__dirname, 'views', 'client-dashboard.html'));
// // // // // // //         } else {
// // // // // // //             res.sendFile(path.join(__dirname, 'views', 'profile.html'));
// // // // // // //         }
// // // // // // //     } catch (err) {
// // // // // // //         res.redirect('/login');
// // // // // // //     }
// // // // // // // });

// // // // // // // app.get('/profile', isAuthenticated, (req, res) => {
// // // // // // //     res.sendFile(path.join(__dirname, 'views', 'profile.html'));
// // // // // // // });

// // // // // // // app.get('/auth/joinus', isAuthenticated, (req, res) => {
// // // // // // //     res.sendFile(path.join(__dirname, 'views', 'join-forms.html'));
// // // // // // // });

// // // // // // // app.get('/api/user/profile', isAuthenticated, async (req, res) => {
// // // // // // //     try {
// // // // // // //         const user = await User.findById(req.session.userId).select('-password');
// // // // // // //         const application = await FormData.findOne({ email: user.email });
// // // // // // //         res.json({
// // // // // // //             user: user,
// // // // // // //             hasSubmitted: !!application,
// // // // // // //             applicationData: application
// // // // // // //         });
// // // // // // //     } catch (error) {
// // // // // // //         res.status(500).json({ error: error.message });
// // // // // // //     }
// // // // // // // });

// // // // // // // app.post('/api/user/update', isAuthenticated, async (req, res) => {
// // // // // // //     try {
// // // // // // //         const { username, bio, profilePic } = req.body;
// // // // // // //         const updateData = { username, bio };
// // // // // // //         if (profilePic) updateData.profilePic = profilePic;
// // // // // // //         await User.findByIdAndUpdate(req.session.userId, updateData);
// // // // // // //         res.json({ success: true });
// // // // // // //     } catch (error) {
// // // // // // //         res.status(500).json({ success: false, message: "Update failed" });
// // // // // // //     }
// // // // // // // });

// // // // // // // app.get('/api/client/dashboard', isAuthenticated, async (req, res) => {
// // // // // // //     try {
// // // // // // //         const user = await User.findById(req.session.userId).select('-password');
// // // // // // //         const projects = await Project.find({ clientId: user._id }).sort({ createdAt: -1 });
// // // // // // //         res.json({ user, projects });
// // // // // // //     } catch (error) {
// // // // // // //         res.status(500).json({ error: error.message });
// // // // // // //     }
// // // // // // // });

// // // // // // // app.post('/api/client/project', isAuthenticated, async (req, res) => {
// // // // // // //     try {
// // // // // // //         const newProject = new Project({
// // // // // // //             clientId: req.session.userId,
// // // // // // //             title: req.body.title,
// // // // // // //             description: req.body.description,
// // // // // // //             status: 'pending'
// // // // // // //         });
// // // // // // //         await newProject.save();
// // // // // // //         res.json({ success: true });
// // // // // // //     } catch (error) {
// // // // // // //         res.status(500).json({ error: error.message });
// // // // // // //     }
// // // // // // // });

// // // // // // // app.post('/auth/submit', isAuthenticated, async (req, res) => {
// // // // // // //     try {
// // // // // // //         const application = new FormData({
// // // // // // //             fullName: req.body.fullName,
// // // // // // //             email: req.body.email,
// // // // // // //             phone: req.body.phone,
// // // // // // //             age: req.body.age,
// // // // // // //             city: req.body.city,
// // // // // // //             lang: req.body.lang,

// // // // // // //             educationStatus: req.body.educationStatus,
// // // // // // //             studentClass: req.body.studentClass,
// // // // // // //             collegeCourse: req.body.collegeCourse,
// // // // // // //             collegeYear: req.body.collegeYear,

// // // // // // //             linkedinLink: req.body.linkedinlink,
// // // // // // //             portfolioLink: req.body.portfolioLink,

// // // // // // //             motive: req.body.motive,
// // // // // // //             department: req.body.department,
// // // // // // //             preferredLanguage: req.body.preferredLanguage,
// // // // // // //             prTeam: req.body.prTeam,
// // // // // // //             otherDepartment: req.body.otherDepartment,

// // // // // // //             weeklyAvailability: req.body.weeklyAvailability,
// // // // // // //             longTermGoal: req.body.longTermGoal,
// // // // // // //             referralSource: req.body.referralSource,

// // // // // // //             timeToLearn: req.body.timetolearn,
// // // // // // //             whyNovaa: req.body.whyNovaa,
// // // // // // //             termsAccepted: req.body.terms === 'on',
// // // // // // //             status: 'pending'
// // // // // // //         });
// // // // // // //         await application.save();
// // // // // // //         res.sendFile(path.join(__dirname, 'views', 'submision.html'));
// // // // // // //     } catch (error) {
// // // // // // //         res.status(500).send(`Error: ${error.message}`);
// // // // // // //     }
// // // // // // // });

// // // // // // // app.get('/adminpanel', (req, res) => {
// // // // // // //     res.sendFile(path.join(__dirname, 'views', 'admin.html'));
// // // // // // // });

// // // // // // // app.get('/api/applications', authenticate, async (req, res) => {
// // // // // // //     try {
// // // // // // //         const applications = await FormData.find().sort({ createdAt: -1 });
// // // // // // //         res.json(applications);
// // // // // // //     } catch (error) {
// // // // // // //         res.status(500).json({ error: error.message });
// // // // // // //     }
// // // // // // // });

// // // // // // // app.get('/api/users', authenticate, async (req, res) => {
// // // // // // //     try {
// // // // // // //         const users = await User.find().select('-password').sort({ createdAt: -1 });
// // // // // // //         res.json(users);
// // // // // // //     } catch (error) {
// // // // // // //         res.status(500).json({ error: error.message });
// // // // // // //     }
// // // // // // // });

// // // // // // // app.patch('/api/application/:id/status', authenticate, async (req, res) => {
// // // // // // //     try {
// // // // // // //         const { id } = req.params;
// // // // // // //         const { status } = req.body;
// // // // // // //         await FormData.findByIdAndUpdate(id, { status });
// // // // // // //         res.json({ success: true });
// // // // // // //     } catch (error) {
// // // // // // //         res.status(500).json({ error: error.message });
// // // // // // //     }
// // // // // // // });

// // // // // // // app.delete('/api/application/:id', authenticate, async (req, res) => {
// // // // // // //     try {
// // // // // // //         await FormData.findByIdAndDelete(req.params.id);
// // // // // // //         res.json({ success: true });
// // // // // // //     } catch (error) {
// // // // // // //         res.status(500).json({ error: error.message });
// // // // // // //     }
// // // // // // // });

// // // // // // // app.delete('/api/user/:id', authenticate, async (req, res) => {
// // // // // // //     try {
// // // // // // //         await User.findByIdAndDelete(req.params.id);
// // // // // // //         res.json({ success: true });
// // // // // // //     } catch (error) {
// // // // // // //         res.status(500).json({ error: error.message });
// // // // // // //     }
// // // // // // // });

// // // // // // // app.get('/api/application/allinfo/:id', authenticate, async (req, res) => {
// // // // // // //     try {
// // // // // // //         const application = await FormData.findById(req.params.id);
// // // // // // //         if (!application) return res.status(404).send('Application not found');
// // // // // // //         res.json(application);
// // // // // // //     } catch (error) {
// // // // // // //         res.status(500).json({ error: error.message });
// // // // // // //     }
// // // // // // // });

// // // // // // // app.get('/api/user/allinfo/:id', authenticate, async (req, res) => {
// // // // // // //     try {
// // // // // // //         const user = await User.findById(req.params.id);
// // // // // // //         if (!user) return res.status(404).send('User not found');
// // // // // // //         res.json(user);
// // // // // // //     } catch (error) {
// // // // // // //         res.status(500).json({ error: error.message });
// // // // // // //     }
// // // // // // // });

// // // // // // // app.get('/api/admin/projects', authenticate, async (req, res) => {
// // // // // // //     try {
// // // // // // //         const projects = await Project.find().sort({ createdAt: -1 });
// // // // // // //         res.json(projects);
// // // // // // //     } catch (error) {
// // // // // // //         res.status(500).json({ error: error.message });
// // // // // // //     }
// // // // // // // });

// // // // // // // app.get('/api/admin/project/:id', authenticate, async (req, res) => {
// // // // // // //     try {
// // // // // // //         const project = await Project.findById(req.params.id);
// // // // // // //         if (!project) return res.status(404).send('Project not found');
// // // // // // //         res.json(project);
// // // // // // //     } catch (error) {
// // // // // // //         res.status(500).json({ error: error.message });
// // // // // // //     }
// // // // // // // });

// // // // // // // app.patch('/api/admin/project/:id', authenticate, async (req, res) => {
// // // // // // //     try {
// // // // // // //         const { assignedTeam, status } = req.body;
// // // // // // //         await Project.findByIdAndUpdate(req.params.id, { assignedTeam, status });
// // // // // // //         res.json({ success: true });
// // // // // // //     } catch (error) {
// // // // // // //         res.status(500).json({ error: error.message });
// // // // // // //     }
// // // // // // // });

// // // // // // // app.delete('/api/admin/project/:id', authenticate, async (req, res) => {
// // // // // // //     try {
// // // // // // //         await Project.findByIdAndDelete(req.params.id);
// // // // // // //         res.json({ success: true });
// // // // // // //     } catch (error) {
// // // // // // //         res.status(500).json({ error: error.message });
// // // // // // //     }
// // // // // // // });

// // // // // // // if (require.main === module) {
// // // // // // //     app.listen(PORT, () => {
// // // // // // //         console.log(`Server is running on http://localhost:${PORT}`);
// // // // // // //     });
// // // // // // // }

// // // // // // // module.exports = app;


// // // // // // const express = require('express');
// // // // // // const app = express();
// // // // // // const mongoose = require('mongoose');
// // // // // // const path = require('path');
// // // // // // const session = require('express-session');
// // // // // // const MongoStore = require('connect-mongo');
// // // // // // const passport = require('passport');
// // // // // // const GoogleStrategy = require('passport-google-oauth20').Strategy;
// // // // // // const bcrypt = require('bcryptjs');
// // // // // // require('dotenv').config();

// // // // // // const FormData = require('./models/form.model');
// // // // // // const User = require('./models/user.model');
// // // // // // const Project = require('./models/project.model');

// // // // // // const PORT = process.env.PORT || 3000;

// // // // // // app.use(express.urlencoded({ extended: true }));
// // // // // // app.use(express.json({ limit: '10mb' }));
// // // // // // app.use('/public', express.static(path.join(__dirname, 'public')));

// // // // // // let isConnected = false;
// // // // // // async function connectToDB() {
// // // // // //     if (isConnected) return;
// // // // // //     try {
// // // // // //         await mongoose.connect(process.env.MONGO + process.env.PASS);
// // // // // //         isConnected = true;
// // // // // //         console.log('Connected to MongoDB');
// // // // // //     } catch (err) {
// // // // // //         console.error('MongoDB error:', err);
// // // // // //     }
// // // // // // }
// // // // // // app.use(async (req, res, next) => { if (!isConnected) await connectToDB(); next(); });

// // // // // // app.use(session({
// // // // // //     secret: process.env.SESSION_SECRET || 'supersecretkey',
// // // // // //     resave: false,
// // // // // //     saveUninitialized: false,
// // // // // //     store: MongoStore.create({ mongoUrl: process.env.MONGO + process.env.PASS, ttl: 14 * 24 * 60 * 60 }),
// // // // // //     cookie: { maxAge: 14 * 24 * 60 * 60 * 1000, httpOnly: true }
// // // // // // }));

// // // // // // app.use(passport.initialize());

// // // // // // passport.use(new GoogleStrategy({
// // // // // //     clientID: process.env.GOOGLE_CLIENT_ID,
// // // // // //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// // // // // //     callbackURL: "/auth/google/callback",
// // // // // //     proxy: true
// // // // // // }, async (accessToken, refreshToken, profile, done) => {
// // // // // //     try {
// // // // // //         let user = await User.findOne({ googleId: profile.id });
// // // // // //         if (user) return done(null, user);

// // // // // //         user = await User.findOne({ email: profile.emails[0].value });
// // // // // //         if (user) {
// // // // // //             user.googleId = profile.id;
// // // // // //             await user.save();
// // // // // //             return done(null, user);
// // // // // //         }

// // // // // //         const newUser = new User({
// // // // // //             username: profile.displayName,
// // // // // //             email: profile.emails[0].value,
// // // // // //             googleId: profile.id,
// // // // // //             profilePic: profile.photos[0].value,
// // // // // //             role: 'talent',
// // // // // //             isAdmin: false
// // // // // //         });
// // // // // //         await newUser.save();
// // // // // //         return done(null, newUser);
// // // // // //     } catch (err) { return done(err, null); }
// // // // // // }));

// // // // // // app.get('/auth/google', (req, res, next) => {
// // // // // //     req.session.tempRole = req.query.role || 'talent';
// // // // // //     req.session.authIntent = req.query.intent || 'signup';
// // // // // //     req.session.save(() => next());
// // // // // // }, passport.authenticate('google', { scope: ['profile', 'email'] }));

// // // // // // app.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), (req, res) => {
// // // // // //     req.session.userId = req.user._id;
// // // // // //     res.redirect('/dashboard');
// // // // // // });

// // // // // // const isAuthenticated = (req, res, next) => {
// // // // // //     if (req.session.userId) return next();
// // // // // //     res.redirect('/login');
// // // // // // };

// // // // // // function authenticate(req, res, next) {
// // // // // //     const authHeader = req.headers.authorization;
// // // // // //     if (!authHeader || !authHeader.startsWith('Basic ')) return res.status(401).json({ error: 'Auth required' });
// // // // // //     const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64').toString('ascii').split(':');
// // // // // //     if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) return next();
// // // // // //     return res.status(401).json({ error: 'Invalid credentials' });
// // // // // // }

// // // // // // app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
// // // // // // app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
// // // // // // app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'views', 'signup.html')));
// // // // // // app.get('/adminpanel', (req, res) => res.sendFile(path.join(__dirname, 'views', 'admin.html')));
// // // // // // app.get('/about-us', (req, res) => res.sendFile(path.join(__dirname, 'views', 'more-info.html')));


// // // // // // app.get('/dashboard', isAuthenticated, async (req, res) => {
// // // // // //     try {
// // // // // //         const user = await User.findById(req.session.userId);
// // // // // //         if (!user) return res.redirect('/login');
// // // // // //         res.sendFile(path.join(__dirname, 'views', user.role === 'client' ? 'client-dashboard.html' : 'profile.html'));
// // // // // //     } catch (err) { res.redirect('/login'); }
// // // // // // });

// // // // // // app.get('/profile', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'views', 'profile.html')));
// // // // // // app.get('/auth/joinus', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'views', 'join-forms.html')));

// // // // // // app.get('/api/user/profile', isAuthenticated, async (req, res) => {
// // // // // //     try {
// // // // // //         const user = await User.findById(req.session.userId).select('-password');
// // // // // //         const application = await FormData.findOne({ email: user.email });
// // // // // //         res.json({ user, hasSubmitted: !!application, applicationData: application });
// // // // // //     } catch (error) { res.status(500).json({ error: error.message }); }
// // // // // // });

// // // // // // app.post('/api/user/update', isAuthenticated, async (req, res) => {
// // // // // //     try {
// // // // // //         await User.findByIdAndUpdate(req.session.userId, req.body);
// // // // // //         res.json({ success: true });
// // // // // //     } catch (error) { res.status(500).json({ success: false }); }
// // // // // // });

// // // // // // app.post('/auth/register', async (req, res) => {
// // // // // //     try {
// // // // // //         const { username, email, password, role } = req.body;
// // // // // //         const existingUser = await User.findOne({ $or: [{ email }, { username }] });
// // // // // //         if (existingUser) return res.json({ success: false, message: 'Taken' });
// // // // // //         const hashedPassword = await bcrypt.hash(password, 10);
// // // // // //         const newUser = new User({ username, email, password: hashedPassword, role: role || 'talent', isAdmin: false });
// // // // // //         await newUser.save();
// // // // // //         req.session.userId = newUser._id;
// // // // // //         res.json({ success: true, redirect: '/dashboard' });
// // // // // //     } catch (error) { res.status(500).json({ success: false }); }
// // // // // // });

// // // // // // app.post('/auth/login', async (req, res) => {
// // // // // //     try {
// // // // // //         const { email, password } = req.body;
// // // // // //         const user = await User.findOne({ email });
// // // // // //         if (!user) return res.json({ success: false, message: 'Invalid Email' });
// // // // // //         if (!user.password) return res.json({ success: false, message: 'Use Google' });
// // // // // //         const isMatch = await bcrypt.compare(password, user.password);
// // // // // //         if (!isMatch) return res.json({ success: false, message: 'Invalid Password' });
// // // // // //         req.session.userId = user._id;
// // // // // //         res.json({ success: true, redirect: '/dashboard' });
// // // // // //     } catch (error) { res.status(500).json({ success: false }); }
// // // // // // });

// // // // // // app.get('/auth/logout', (req, res) => {
// // // // // //     req.session.destroy(() => {
// // // // // //         res.clearCookie('connect.sid');
// // // // // //         res.redirect('/login');
// // // // // //     });
// // // // // // });

// // // // // // app.get('/auth/check-status', (req, res) => {
// // // // // //     res.json({ loggedIn: !!req.session.userId });
// // // // // // });

// // // // // // app.post('/auth/submit', isAuthenticated, async (req, res) => {
// // // // // //     try {
// // // // // //         const submissionData = req.body;
// // // // // //         submissionData.termsAccepted = submissionData.terms === 'on';

// // // // // //         if (typeof submissionData.preferredLanguage === 'string') {
// // // // // //             submissionData.preferredLanguage = submissionData.preferredLanguage
// // // // // //                 .split(',')
// // // // // //                 .map(lang => lang.trim())
// // // // // //                 .filter(lang => lang.length > 0);
// // // // // //         }
// // // // // //         submissionData.status = 'pending';


// // // // // //         await FormData.findOneAndUpdate(
// // // // // //             { email: submissionData.email },
// // // // // //             { $set: submissionData },
// // // // // //             { upsert: true, new: true, setDefaultsOnInsert: true }
// // // // // //         );

// // // // // //         res.sendFile(path.join(__dirname, 'views', 'submission-success.html'));
// // // // // //     } catch (e) {
// // // // // //         console.error("Submission Error:", e);
// // // // // //         res.status(500).send("Error submitting application: " + e.message);
// // // // // //     }
// // // // // // });

// // // // // // app.get('/api/applications', authenticate, async (req, res) => {
// // // // // //     const apps = await FormData.find().sort({ createdAt: -1 });
// // // // // //     res.json(apps);
// // // // // // });

// // // // // // app.get('/api/users', authenticate, async (req, res) => {
// // // // // //     const users = await User.find().sort({ createdAt: -1 });
// // // // // //     res.json(users);
// // // // // // });

// // // // // // app.get('/api/admin/projects', authenticate, async (req, res) => {
// // // // // //     const projects = await Project.find().sort({ createdAt: -1 });
// // // // // //     res.json(projects);
// // // // // // });

// // // // // // app.patch('/api/application/:id/card-details', authenticate, async (req, res) => {
// // // // // //     try {
// // // // // //         await FormData.findByIdAndUpdate(req.params.id, {
// // // // // //             assignedRole: req.body.assignedRole,
// // // // // //             assignedTeam: req.body.assignedTeam,
// // // // // //             assignedLeader: req.body.assignedLeader,
// // // // // //             assignedPost: req.body.assignedPost,
// // // // // //             adminMessage: req.body.adminMessage,
// // // // // //             assignedWork: req.body.assignedWork
// // // // // //         });
// // // // // //         res.json({ success: true });
// // // // // //     } catch (error) { res.status(500).json({ error: error.message }); }
// // // // // // });

// // // // // // app.patch('/api/application/:id/status', authenticate, async (req, res) => {
// // // // // //     try {
// // // // // //         await FormData.findByIdAndUpdate(req.params.id, { status: req.body.status });
// // // // // //         res.json({ success: true });
// // // // // //     } catch (error) { res.status(500).json({ error: error.message }); }
// // // // // // });

// // // // // // app.delete('/api/application/:id', authenticate, async (req, res) => {
// // // // // //     await FormData.findByIdAndDelete(req.params.id);
// // // // // //     res.json({ success: true });
// // // // // // });

// // // // // // app.delete('/api/user/:id', authenticate, async (req, res) => {
// // // // // //     await User.findByIdAndDelete(req.params.id);
// // // // // //     res.json({ success: true });
// // // // // // });

// // // // // // app.get('/api/application/allinfo/:id', authenticate, async (req, res) => {
// // // // // //     const app = await FormData.findById(req.params.id);
// // // // // //     res.json(app);
// // // // // // });

// // // // // // app.get('/api/user/allinfo/:id', authenticate, async (req, res) => {
// // // // // //     const user = await User.findById(req.params.id);
// // // // // //     res.json(user);
// // // // // // });

// // // // // // app.get('/api/admin/project/:id', authenticate, async (req, res) => {
// // // // // //     const project = await Project.findById(req.params.id);
// // // // // //     res.json(project);
// // // // // // });

// // // // // // app.patch('/api/admin/project/:id', authenticate, async (req, res) => {
// // // // // //     await Project.findByIdAndUpdate(req.params.id, req.body);
// // // // // //     res.json({ success: true });
// // // // // // });

// // // // // // app.delete('/api/admin/project/:id', authenticate, async (req, res) => {
// // // // // //     await Project.findByIdAndDelete(req.params.id);
// // // // // //     res.json({ success: true });
// // // // // // });

// // // // // // if (require.main === module) {
// // // // // //     app.listen(PORT, () => {
// // // // // //         console.log(`Server running on http://localhost:${PORT}`);
// // // // // //     });
// // // // // // }

// // // // // // module.exports = app;

// // // // // const express = require('express');
// // // // // const app = express();
// // // // // const mongoose = require('mongoose');
// // // // // const path = require('path');
// // // // // const session = require('express-session');
// // // // // const MongoStore = require('connect-mongo');
// // // // // const passport = require('passport');
// // // // // const GoogleStrategy = require('passport-google-oauth20').Strategy;
// // // // // const bcrypt = require('bcryptjs');
// // // // // require('dotenv').config();

// // // // // const FormData = require('./models/form.model');
// // // // // const User = require('./models/user.model');
// // // // // const Project = require('./models/project.model');

// // // // // const PORT = process.env.PORT || 3000;

// // // // // app.use(express.urlencoded({ extended: true }));
// // // // // app.use(express.json({ limit: '10mb' }));
// // // // // app.use('/public', express.static(path.join(__dirname, 'public')));

// // // // // let isConnected = false;
// // // // // async function connectToDB() {
// // // // //     if (isConnected) return;
// // // // //     try {
// // // // //         await mongoose.connect(process.env.MONGO + process.env.PASS);
// // // // //         isConnected = true;
// // // // //         console.log('Connected to MongoDB');
// // // // //     } catch (err) {
// // // // //         console.error('MongoDB error:', err);
// // // // //     }
// // // // // }
// // // // // app.use(async (req, res, next) => { if (!isConnected) await connectToDB(); next(); });

// // // // // app.use(session({
// // // // //     secret: process.env.SESSION_SECRET || 'supersecretkey',
// // // // //     resave: false,
// // // // //     saveUninitialized: false,
// // // // //     store: MongoStore.create({ mongoUrl: process.env.MONGO + process.env.PASS, ttl: 14 * 24 * 60 * 60 }),
// // // // //     cookie: { maxAge: 14 * 24 * 60 * 60 * 1000, httpOnly: true }
// // // // // }));

// // // // // app.use(passport.initialize());

// // // // // passport.use(new GoogleStrategy({
// // // // //     clientID: process.env.GOOGLE_CLIENT_ID,
// // // // //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// // // // //     callbackURL: "/auth/google/callback",
// // // // //     proxy: true
// // // // // }, async (accessToken, refreshToken, profile, done) => {
// // // // //     try {
// // // // //         let user = await User.findOne({ googleId: profile.id });
// // // // //         if (user) return done(null, user);

// // // // //         user = await User.findOne({ email: profile.emails[0].value });
// // // // //         if (user) {
// // // // //             user.googleId = profile.id;
// // // // //             await user.save();
// // // // //             return done(null, user);
// // // // //         }

// // // // //         const newUser = new User({
// // // // //             username: profile.displayName,
// // // // //             email: profile.emails[0].value,
// // // // //             googleId: profile.id,
// // // // //             profilePic: profile.photos[0].value,
// // // // //             role: 'talent',
// // // // //             isAdmin: false
// // // // //         });
// // // // //         await newUser.save();
// // // // //         return done(null, newUser);
// // // // //     } catch (err) { return done(err, null); }
// // // // // }));

// // // // // app.get('/auth/google', (req, res, next) => {
// // // // //     req.session.tempRole = req.query.role || 'talent';
// // // // //     req.session.authIntent = req.query.intent || 'signup';
// // // // //     req.session.save(() => next());
// // // // // }, passport.authenticate('google', { scope: ['profile', 'email'] }));

// // // // // app.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), (req, res) => {
// // // // //     req.session.userId = req.user._id;
// // // // //     res.redirect('/dashboard');
// // // // // });

// // // // // const isAuthenticated = (req, res, next) => {
// // // // //     if (req.session.userId) return next();
// // // // //     res.redirect('/login');
// // // // // };

// // // // // function authenticate(req, res, next) {
// // // // //     const authHeader = req.headers.authorization;
// // // // //     if (!authHeader || !authHeader.startsWith('Basic ')) return res.status(401).json({ error: 'Auth required' });
// // // // //     const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64').toString('ascii').split(':');
// // // // //     if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) return next();
// // // // //     return res.status(401).json({ error: 'Invalid credentials' });
// // // // // }

// // // // // app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
// // // // // app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
// // // // // app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'views', 'signup.html')));
// // // // // app.get('/adminpanel', (req, res) => res.sendFile(path.join(__dirname, 'views', 'admin.html')));
// // // // // app.get('/about-us', (req, res) => res.sendFile(path.join(__dirname, 'views', 'more-info.html')));


// // // // // app.get('/dashboard', isAuthenticated, async (req, res) => {
// // // // //     try {
// // // // //         const user = await User.findById(req.session.userId);
// // // // //         if (!user) return res.redirect('/login');
// // // // //         res.sendFile(path.join(__dirname, 'views', user.role === 'client' ? 'client-dashboard.html' : 'profile.html'));
// // // // //     } catch (err) { res.redirect('/login'); }
// // // // // });

// // // // // app.get('/profile', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'views', 'profile.html')));

// // // // // // --- UPDATED: Prevent Blocked Users from accessing the form ---
// // // // // app.get('/auth/joinus', isAuthenticated, async (req, res) => {
// // // // //     try {
// // // // //         const user = await User.findById(req.session.userId);
// // // // //         const existingApp = await FormData.findOne({ email: user.email });

// // // // //         if (existingApp && existingApp.status === 'blocked') {
// // // // //             return res.send(`
// // // // //                 <h1 style="color: red; text-align: center; margin-top: 50px; font-family: sans-serif;">Access Denied</h1>
// // // // //                 <p style="text-align: center; font-family: sans-serif;">Your account has been blocked by the admin.</p>
// // // // //                 <div style="text-align: center;"><a href="/profile">Go Back to Profile</a></div>
// // // // //             `);
// // // // //         }
// // // // //         res.sendFile(path.join(__dirname, 'views', 'join-forms.html'));
// // // // //     } catch (err) {
// // // // //         res.redirect('/profile');
// // // // //     }
// // // // // });

// // // // // app.get('/api/user/profile', isAuthenticated, async (req, res) => {
// // // // //     try {
// // // // //         const user = await User.findById(req.session.userId).select('-password');
// // // // //         const application = await FormData.findOne({ email: user.email });
// // // // //         res.json({ user, hasSubmitted: !!application, applicationData: application });
// // // // //     } catch (error) { res.status(500).json({ error: error.message }); }
// // // // // });

// // // // // app.post('/api/user/update', isAuthenticated, async (req, res) => {
// // // // //     try {
// // // // //         await User.findByIdAndUpdate(req.session.userId, req.body);
// // // // //         res.json({ success: true });
// // // // //     } catch (error) { res.status(500).json({ success: false }); }
// // // // // });

// // // // // app.post('/auth/register', async (req, res) => {
// // // // //     try {
// // // // //         const { username, email, password, role } = req.body;
// // // // //         const existingUser = await User.findOne({ $or: [{ email }, { username }] });
// // // // //         if (existingUser) return res.json({ success: false, message: 'Taken' });
// // // // //         const hashedPassword = await bcrypt.hash(password, 10);
// // // // //         const newUser = new User({ username, email, password: hashedPassword, role: role || 'talent', isAdmin: false });
// // // // //         await newUser.save();
// // // // //         req.session.userId = newUser._id;
// // // // //         res.json({ success: true, redirect: '/dashboard' });
// // // // //     } catch (error) { res.status(500).json({ success: false }); }
// // // // // });

// // // // // app.post('/auth/login', async (req, res) => {
// // // // //     try {
// // // // //         const { email, password } = req.body;
// // // // //         const user = await User.findOne({ email });
// // // // //         if (!user) return res.json({ success: false, message: 'Invalid Email' });
// // // // //         if (!user.password) return res.json({ success: false, message: 'Use Google' });
// // // // //         const isMatch = await bcrypt.compare(password, user.password);
// // // // //         if (!isMatch) return res.json({ success: false, message: 'Invalid Password' });
// // // // //         req.session.userId = user._id;
// // // // //         res.json({ success: true, redirect: '/dashboard' });
// // // // //     } catch (error) { res.status(500).json({ success: false }); }
// // // // // });

// // // // // app.get('/auth/logout', (req, res) => {
// // // // //     req.session.destroy(() => {
// // // // //         res.clearCookie('connect.sid');
// // // // //         res.redirect('/login');
// // // // //     });
// // // // // });

// // // // // app.get('/auth/check-status', (req, res) => {
// // // // //     res.json({ loggedIn: !!req.session.userId });
// // // // // });

// // // // // // --- UPDATED: Prevent Blocked Users from Submitting ---
// // // // // app.post('/auth/submit', isAuthenticated, async (req, res) => {
// // // // //     try {
// // // // //         const submissionData = req.body;

// // // // //         // Check if user is blocked BEFORE updating
// // // // //         const existingApp = await FormData.findOne({ email: submissionData.email });
// // // // //         if (existingApp && existingApp.status === 'blocked') {
// // // // //             return res.status(403).send("Your account is blocked. You cannot submit forms.");
// // // // //         }

// // // // //         submissionData.termsAccepted = submissionData.terms === 'on';

// // // // //         if (typeof submissionData.preferredLanguage === 'string') {
// // // // //             submissionData.preferredLanguage = submissionData.preferredLanguage
// // // // //                 .split(',')
// // // // //                 .map(lang => lang.trim())
// // // // //                 .filter(lang => lang.length > 0);
// // // // //         }

// // // // //         // Reset status to pending so admin sees the new submission (unless blocked, handled above)
// // // // //         submissionData.status = 'pending';

// // // // //         await FormData.findOneAndUpdate(
// // // // //             { email: submissionData.email },
// // // // //             { $set: submissionData },
// // // // //             { upsert: true, new: true, setDefaultsOnInsert: true }
// // // // //         );

// // // // //         res.sendFile(path.join(__dirname, 'views', 'submission-success.html'));
// // // // //     } catch (e) {
// // // // //         console.error("Submission Error:", e);
// // // // //         res.status(500).send("Error submitting application: " + e.message);
// // // // //     }
// // // // // });

// // // // // app.get('/api/applications', authenticate, async (req, res) => {
// // // // //     const apps = await FormData.find().sort({ createdAt: -1 });
// // // // //     res.json(apps);
// // // // // });

// // // // // app.get('/api/users', authenticate, async (req, res) => {
// // // // //     const users = await User.find().sort({ createdAt: -1 });
// // // // //     res.json(users);
// // // // // });

// // // // // app.get('/api/admin/projects', authenticate, async (req, res) => {
// // // // //     const projects = await Project.find().sort({ createdAt: -1 });
// // // // //     res.json(projects);
// // // // // });

// // // // // app.patch('/api/application/:id/card-details', authenticate, async (req, res) => {
// // // // //     try {
// // // // //         await FormData.findByIdAndUpdate(req.params.id, {
// // // // //             assignedRole: req.body.assignedRole,
// // // // //             assignedTeam: req.body.assignedTeam,
// // // // //             assignedLeader: req.body.assignedLeader,
// // // // //             assignedPost: req.body.assignedPost,
// // // // //             adminMessage: req.body.adminMessage,
// // // // //             assignedWork: req.body.assignedWork
// // // // //         });
// // // // //         res.json({ success: true });
// // // // //     } catch (error) { res.status(500).json({ error: error.message }); }
// // // // // });

// // // // // app.patch('/api/application/:id/status', authenticate, async (req, res) => {
// // // // //     try {
// // // // //         await FormData.findByIdAndUpdate(req.params.id, { status: req.body.status });
// // // // //         res.json({ success: true });
// // // // //     } catch (error) { res.status(500).json({ error: error.message }); }
// // // // // });

// // // // // app.delete('/api/application/:id', authenticate, async (req, res) => {
// // // // //     await FormData.findByIdAndDelete(req.params.id);
// // // // //     res.json({ success: true });
// // // // // });

// // // // // app.delete('/api/user/:id', authenticate, async (req, res) => {
// // // // //     await User.findByIdAndDelete(req.params.id);
// // // // //     res.json({ success: true });
// // // // // });

// // // // // app.get('/api/application/allinfo/:id', authenticate, async (req, res) => {
// // // // //     const app = await FormData.findById(req.params.id);
// // // // //     res.json(app);
// // // // // });

// // // // // app.get('/api/user/allinfo/:id', authenticate, async (req, res) => {
// // // // //     const user = await User.findById(req.params.id);
// // // // //     res.json(user);
// // // // // });

// // // // // app.get('/api/admin/project/:id', authenticate, async (req, res) => {
// // // // //     const project = await Project.findById(req.params.id);
// // // // //     res.json(project);
// // // // // });

// // // // // app.patch('/api/admin/project/:id', authenticate, async (req, res) => {
// // // // //     await Project.findByIdAndUpdate(req.params.id, req.body);
// // // // //     res.json({ success: true });
// // // // // });

// // // // // app.delete('/api/admin/project/:id', authenticate, async (req, res) => {
// // // // //     await Project.findByIdAndDelete(req.params.id);
// // // // //     res.json({ success: true });
// // // // // });

// // // // // if (require.main === module) {
// // // // //     app.listen(PORT, () => {
// // // // //         console.log(`Server running on http://localhost:${PORT}`);
// // // // //     });
// // // // // }

// // // // // module.exports = app;

// // // // const express = require('express');
// // // // const app = express();
// // // // const mongoose = require('mongoose');
// // // // const path = require('path');
// // // // const session = require('express-session');
// // // // const MongoStore = require('connect-mongo');
// // // // const passport = require('passport');
// // // // const GoogleStrategy = require('passport-google-oauth20').Strategy;
// // // // const bcrypt = require('bcryptjs');
// // // // require('dotenv').config();

// // // // const FormData = require('./models/form.model');
// // // // const User = require('./models/user.model');
// // // // const Project = require('./models/project.model');

// // // // const PORT = process.env.PORT || 3000;

// // // // app.use(express.urlencoded({ extended: true }));
// // // // app.use(express.json({ limit: '10mb' }));
// // // // app.use('/public', express.static(path.join(__dirname, 'public')));

// // // // let isConnected = false;
// // // // async function connectToDB() {
// // // //     if (isConnected) return;
// // // //     try {
// // // //         await mongoose.connect(process.env.MONGO + process.env.PASS);
// // // //         isConnected = true;
// // // //         console.log('Connected to MongoDB');
// // // //     } catch (err) {
// // // //         console.error('MongoDB error:', err);
// // // //     }
// // // // }
// // // // app.use(async (req, res, next) => { if (!isConnected) await connectToDB(); next(); });

// // // // app.use(session({
// // // //     secret: process.env.SESSION_SECRET || 'supersecretkey',
// // // //     resave: false,
// // // //     saveUninitialized: false,
// // // //     store: MongoStore.create({ mongoUrl: process.env.MONGO + process.env.PASS, ttl: 14 * 24 * 60 * 60 }),
// // // //     cookie: { maxAge: 14 * 24 * 60 * 60 * 1000, httpOnly: true }
// // // // }));

// // // // app.use(passport.initialize());

// // // // passport.use(new GoogleStrategy({
// // // //     clientID: process.env.GOOGLE_CLIENT_ID,
// // // //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// // // //     callbackURL: "/auth/google/callback",
// // // //     proxy: true
// // // // }, async (accessToken, refreshToken, profile, done) => {
// // // //     try {
// // // //         let user = await User.findOne({ googleId: profile.id });
// // // //         if (user) return done(null, user);

// // // //         user = await User.findOne({ email: profile.emails[0].value });
// // // //         if (user) {
// // // //             user.googleId = profile.id;
// // // //             await user.save();
// // // //             return done(null, user);
// // // //         }

// // // //         const newUser = new User({
// // // //             username: profile.displayName,
// // // //             email: profile.emails[0].value,
// // // //             googleId: profile.id,
// // // //             profilePic: profile.photos[0].value,
// // // //             role: 'talent',
// // // //             isAdmin: false
// // // //         });
// // // //         await newUser.save();
// // // //         return done(null, newUser);
// // // //     } catch (err) { return done(err, null); }
// // // // }));

// // // // app.get('/auth/google', (req, res, next) => {
// // // //     req.session.tempRole = req.query.role || 'talent';
// // // //     req.session.authIntent = req.query.intent || 'signup';
// // // //     req.session.save(() => next());
// // // // }, passport.authenticate('google', { scope: ['profile', 'email'] }));

// // // // app.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), (req, res) => {
// // // //     req.session.userId = req.user._id;
// // // //     res.redirect('/dashboard');
// // // // });

// // // // const isAuthenticated = (req, res, next) => {
// // // //     if (req.session.userId) return next();
// // // //     res.redirect('/login');
// // // // };

// // // // function authenticate(req, res, next) {
// // // //     const authHeader = req.headers.authorization;
// // // //     if (!authHeader || !authHeader.startsWith('Basic ')) return res.status(401).json({ error: 'Auth required' });
// // // //     const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64').toString('ascii').split(':');
// // // //     if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) return next();
// // // //     return res.status(401).json({ error: 'Invalid credentials' });
// // // // }

// // // // app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
// // // // app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
// // // // app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'views', 'signup.html')));
// // // // app.get('/adminpanel', (req, res) => res.sendFile(path.join(__dirname, 'views', 'admin.html')));
// // // // app.get('/about-us', (req, res) => res.sendFile(path.join(__dirname, 'views', 'more-info.html')));


// // // // app.get('/dashboard', isAuthenticated, async (req, res) => {
// // // //     try {
// // // //         const user = await User.findById(req.session.userId);
// // // //         if (!user) return res.redirect('/login');
// // // //         res.sendFile(path.join(__dirname, 'views', user.role === 'client' ? 'client-dashboard.html' : 'profile.html'));
// // // //     } catch (err) { res.redirect('/login'); }
// // // // });

// // // // app.get('/profile', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'views', 'profile.html')));

// // // // app.get('/auth/joinus', isAuthenticated, async (req, res) => {
// // // //     try {
// // // //         const user = await User.findById(req.session.userId);
// // // //         const existingApp = await FormData.findOne({ email: user.email });

// // // //         if (existingApp && existingApp.status === 'blocked') {
// // // //             return res.send(`
// // // //                 <h1 style="color: red; text-align: center; margin-top: 50px; font-family: sans-serif;">Access Denied</h1>
// // // //                 <p style="text-align: center; font-family: sans-serif;">Your account has been blocked by the admin.</p>
// // // //                 <div style="text-align: center;"><a href="/profile">Go Back to Profile</a></div>
// // // //             `);
// // // //         }
// // // //         res.sendFile(path.join(__dirname, 'views', 'join-forms.html'));
// // // //     } catch (err) {
// // // //         res.redirect('/profile');
// // // //     }
// // // // });

// // // // app.get('/api/user/profile', isAuthenticated, async (req, res) => {
// // // //     try {
// // // //         const user = await User.findById(req.session.userId).select('-password');
// // // //         const application = await FormData.findOne({ email: user.email });
// // // //         res.json({ user, hasSubmitted: !!application, applicationData: application });
// // // //     } catch (error) { res.status(500).json({ error: error.message }); }
// // // // });

// // // // app.post('/api/user/update', isAuthenticated, async (req, res) => {
// // // //     try {
// // // //         await User.findByIdAndUpdate(req.session.userId, req.body);
// // // //         res.json({ success: true });
// // // //     } catch (error) { res.status(500).json({ success: false }); }
// // // // });

// // // // app.post('/auth/register', async (req, res) => {
// // // //     try {
// // // //         const { username, email, password, role } = req.body;
// // // //         const existingUser = await User.findOne({ $or: [{ email }, { username }] });
// // // //         if (existingUser) return res.json({ success: false, message: 'Taken' });
// // // //         const hashedPassword = await bcrypt.hash(password, 10);
// // // //         const newUser = new User({ username, email, password: hashedPassword, role: role || 'talent', isAdmin: false });
// // // //         await newUser.save();
// // // //         req.session.userId = newUser._id;
// // // //         res.json({ success: true, redirect: '/dashboard' });
// // // //     } catch (error) { res.status(500).json({ success: false }); }
// // // // });

// // // // app.post('/auth/login', async (req, res) => {
// // // //     try {
// // // //         const { email, password } = req.body;
// // // //         const user = await User.findOne({ email });
// // // //         if (!user) return res.json({ success: false, message: 'Invalid Email' });
// // // //         if (!user.password) return res.json({ success: false, message: 'Use Google' });
// // // //         const isMatch = await bcrypt.compare(password, user.password);
// // // //         if (!isMatch) return res.json({ success: false, message: 'Invalid Password' });
// // // //         req.session.userId = user._id;
// // // //         res.json({ success: true, redirect: '/dashboard' });
// // // //     } catch (error) { res.status(500).json({ success: false }); }
// // // // });

// // // // app.get('/auth/logout', (req, res) => {
// // // //     req.session.destroy(() => {
// // // //         res.clearCookie('connect.sid');
// // // //         res.redirect('/login');
// // // //     });
// // // // });

// // // // app.get('/auth/check-status', (req, res) => {
// // // //     res.json({ loggedIn: !!req.session.userId });
// // // // });

// // // // app.post('/auth/submit', isAuthenticated, async (req, res) => {
// // // //     try {
// // // //         const submissionData = req.body;

// // // //         const existingApp = await FormData.findOne({ email: submissionData.email });
// // // //         if (existingApp && existingApp.status === 'blocked') {
// // // //             return res.status(403).send("Your account is blocked. You cannot submit forms.");
// // // //         }

// // // //         submissionData.termsAccepted = submissionData.terms === 'on';

// // // //         if (typeof submissionData.preferredLanguage === 'string') {
// // // //             submissionData.preferredLanguage = submissionData.preferredLanguage
// // // //                 .split(',')
// // // //                 .map(lang => lang.trim())
// // // //                 .filter(lang => lang.length > 0);
// // // //         }

// // // //         submissionData.status = 'pending';

// // // //         await FormData.findOneAndUpdate(
// // // //             { email: submissionData.email },
// // // //             { $set: submissionData },
// // // //             { upsert: true, new: true, setDefaultsOnInsert: true }
// // // //         );

// // // //         res.sendFile(path.join(__dirname, 'views', 'submission-success.html'));
// // // //     } catch (e) {
// // // //         console.error("Submission Error:", e);
// // // //         res.status(500).send("Error submitting application: " + e.message);
// // // //     }
// // // // });

// // // // app.get('/api/applications', authenticate, async (req, res) => {
// // // //     const apps = await FormData.find().sort({ createdAt: -1 });
// // // //     res.json(apps);
// // // // });

// // // // app.get('/api/users', authenticate, async (req, res) => {
// // // //     const users = await User.find().sort({ createdAt: -1 });
// // // //     res.json(users);
// // // // });

// // // // app.get('/api/admin/projects', authenticate, async (req, res) => {
// // // //     const projects = await Project.find().sort({ createdAt: -1 });
// // // //     res.json(projects);
// // // // });

// // // // app.patch('/api/application/:id/card-details', authenticate, async (req, res) => {
// // // //     try {
// // // //         await FormData.findByIdAndUpdate(req.params.id, {
// // // //             assignedRole: req.body.assignedRole,
// // // //             assignedTeam: req.body.assignedTeam,
// // // //             assignedLeader: req.body.assignedLeader,
// // // //             assignedPost: req.body.assignedPost,

// // // //             assignedTeamMembers: req.body.assignedTeamMembers,
// // // //             assignedTeamRoles: req.body.assignedTeamRoles,

// // // //             adminMessage: req.body.adminMessage,
// // // //             assignedWork: req.body.assignedWork
// // // //         });
// // // //         res.json({ success: true });
// // // //     } catch (error) { res.status(500).json({ error: error.message }); }
// // // // });

// // // // app.patch('/api/application/:id/status', authenticate, async (req, res) => {
// // // //     try {
// // // //         await FormData.findByIdAndUpdate(req.params.id, { status: req.body.status });
// // // //         res.json({ success: true });
// // // //     } catch (error) { res.status(500).json({ error: error.message }); }
// // // // });

// // // // app.delete('/api/application/:id', authenticate, async (req, res) => {
// // // //     await FormData.findByIdAndDelete(req.params.id);
// // // //     res.json({ success: true });
// // // // });

// // // // app.delete('/api/user/:id', authenticate, async (req, res) => {
// // // //     await User.findByIdAndDelete(req.params.id);
// // // //     res.json({ success: true });
// // // // });

// // // // app.get('/api/application/allinfo/:id', authenticate, async (req, res) => {
// // // //     const app = await FormData.findById(req.params.id);
// // // //     res.json(app);
// // // // });

// // // // app.get('/api/user/allinfo/:id', authenticate, async (req, res) => {
// // // //     const user = await User.findById(req.params.id);
// // // //     res.json(user);
// // // // });

// // // // app.get('/api/admin/project/:id', authenticate, async (req, res) => {
// // // //     const project = await Project.findById(req.params.id);
// // // //     res.json(project);
// // // // });

// // // // app.patch('/api/admin/project/:id', authenticate, async (req, res) => {
// // // //     await Project.findByIdAndUpdate(req.params.id, req.body);
// // // //     res.json({ success: true });
// // // // });

// // // // app.delete('/api/admin/project/:id', authenticate, async (req, res) => {
// // // //     await Project.findByIdAndDelete(req.params.id);
// // // //     res.json({ success: true });
// // // // });

// // // // if (require.main === module) {
// // // //     app.listen(PORT, () => {
// // // //         console.log(`Server running on http://localhost:${PORT}`);
// // // //     });
// // // // }

// // // // module.exports = app;

// // // const express = require('express');
// // // const app = express();
// // // const mongoose = require('mongoose');
// // // const path = require('path');
// // // const session = require('express-session');
// // // const MongoStore = require('connect-mongo');
// // // const passport = require('passport');
// // // const GoogleStrategy = require('passport-google-oauth20').Strategy;
// // // const bcrypt = require('bcryptjs');
// // // require('dotenv').config();

// // // const FormData = require('./models/form.model');
// // // const User = require('./models/user.model');
// // // const Project = require('./models/project.model');

// // // const PORT = process.env.PORT || 3000;

// // // app.use(express.urlencoded({ extended: true }));
// // // app.use(express.json({ limit: '10mb' }));
// // // app.use('/public', express.static(path.join(__dirname, 'public')));

// // // let isConnected = false;
// // // async function connectToDB() {
// // //     if (isConnected) return;
// // //     try {
// // //         await mongoose.connect(process.env.MONGO + process.env.PASS);
// // //         isConnected = true;
// // //         console.log('Connected to MongoDB');
// // //     } catch (err) {
// // //         console.error('MongoDB error:', err);
// // //     }
// // // }
// // // app.use(async (req, res, next) => { if (!isConnected) await connectToDB(); next(); });

// // // app.use(session({
// // //     secret: process.env.SESSION_SECRET || 'supersecretkey',
// // //     resave: false,
// // //     saveUninitialized: false,
// // //     store: MongoStore.create({ mongoUrl: process.env.MONGO + process.env.PASS, ttl: 14 * 24 * 60 * 60 }),
// // //     cookie: { maxAge: 14 * 24 * 60 * 60 * 1000, httpOnly: true }
// // // }));

// // // app.use(passport.initialize());

// // // passport.use(new GoogleStrategy({
// // //     clientID: process.env.GOOGLE_CLIENT_ID,
// // //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// // //     callbackURL: "/auth/google/callback",
// // //     proxy: true
// // // }, async (accessToken, refreshToken, profile, done) => {
// // //     try {
// // //         let user = await User.findOne({ googleId: profile.id });
// // //         if (user) return done(null, user);

// // //         user = await User.findOne({ email: profile.emails[0].value });
// // //         if (user) {
// // //             user.googleId = profile.id;
// // //             await user.save();
// // //             return done(null, user);
// // //         }

// // //         const newUser = new User({
// // //             username: profile.displayName,
// // //             email: profile.emails[0].value,
// // //             googleId: profile.id,
// // //             profilePic: profile.photos[0].value,
// // //             role: 'talent',
// // //             isAdmin: false
// // //         });
// // //         await newUser.save();
// // //         return done(null, newUser);
// // //     } catch (err) { return done(err, null); }
// // // }));

// // // app.get('/auth/google', (req, res, next) => {
// // //     req.session.tempRole = req.query.role || 'talent';
// // //     req.session.authIntent = req.query.intent || 'signup';
// // //     req.session.save(() => next());
// // // }, passport.authenticate('google', { scope: ['profile', 'email'] }));

// // // app.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), (req, res) => {
// // //     req.session.userId = req.user._id;
// // //     res.redirect('/dashboard');
// // // });

// // // const isAuthenticated = (req, res, next) => {
// // //     if (req.session.userId) return next();
// // //     res.redirect('/login');
// // // };

// // // function authenticate(req, res, next) {
// // //     const authHeader = req.headers.authorization;
// // //     if (!authHeader || !authHeader.startsWith('Basic ')) return res.status(401).json({ error: 'Auth required' });
// // //     const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64').toString('ascii').split(':');
// // //     if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) return next();
// // //     return res.status(401).json({ error: 'Invalid credentials' });
// // // }

// // // app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
// // // app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
// // // app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'views', 'signup.html')));
// // // app.get('/adminpanel', (req, res) => res.sendFile(path.join(__dirname, 'views', 'admin.html')));
// // // app.get('/about-us', (req, res) => res.sendFile(path.join(__dirname, 'views', 'more-info.html')));


// // // app.get('/dashboard', isAuthenticated, async (req, res) => {
// // //     try {
// // //         const user = await User.findById(req.session.userId);
// // //         if (!user) return res.redirect('/login');
// // //         res.sendFile(path.join(__dirname, 'views', user.role === 'client' ? 'client-dashboard.html' : 'profile.html'));
// // //     } catch (err) { res.redirect('/login'); }
// // // });

// // // app.get('/profile', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'views', 'profile.html')));

// // // app.get('/auth/joinus', isAuthenticated, async (req, res) => {
// // //     try {
// // //         const user = await User.findById(req.session.userId);
// // //         const existingApp = await FormData.findOne({ email: user.email });

// // //         if (existingApp && existingApp.status === 'blocked') {
// // //             return res.send(`
// // //                 <h1 style="color: red; text-align: center; margin-top: 50px; font-family: sans-serif;">Access Denied</h1>
// // //                 <p style="text-align: center; font-family: sans-serif;">Your account has been blocked by the admin.</p>
// // //                 <div style="text-align: center;"><a href="/profile">Go Back to Profile</a></div>
// // //             `);
// // //         }
// // //         res.sendFile(path.join(__dirname, 'views', 'join-forms.html'));
// // //     } catch (err) {
// // //         res.redirect('/profile');
// // //     }
// // // });

// // // app.get('/api/user/profile', isAuthenticated, async (req, res) => {
// // //     try {
// // //         const user = await User.findById(req.session.userId).select('-password');
// // //         const application = await FormData.findOne({ email: user.email });
// // //         res.json({ user, hasSubmitted: !!application, applicationData: application });
// // //     } catch (error) { res.status(500).json({ error: error.message }); }
// // // });

// // // app.post('/api/user/update', isAuthenticated, async (req, res) => {
// // //     try {
// // //         await User.findByIdAndUpdate(req.session.userId, req.body);
// // //         res.json({ success: true });
// // //     } catch (error) { res.status(500).json({ success: false }); }
// // // });

// // // app.post('/auth/register', async (req, res) => {
// // //     try {
// // //         const { username, email, password, role } = req.body;
// // //         const existingUser = await User.findOne({ $or: [{ email }, { username }] });
// // //         if (existingUser) return res.json({ success: false, message: 'Taken' });
// // //         const hashedPassword = await bcrypt.hash(password, 10);
// // //         const newUser = new User({ username, email, password: hashedPassword, role: role || 'talent', isAdmin: false });
// // //         await newUser.save();
// // //         req.session.userId = newUser._id;
// // //         res.json({ success: true, redirect: '/dashboard' });
// // //     } catch (error) { res.status(500).json({ success: false }); }
// // // });

// // // app.post('/auth/login', async (req, res) => {
// // //     try {
// // //         const { email, password } = req.body;
// // //         const user = await User.findOne({ email });
// // //         if (!user) return res.json({ success: false, message: 'Invalid Email' });
// // //         if (!user.password) return res.json({ success: false, message: 'Use Google' });
// // //         const isMatch = await bcrypt.compare(password, user.password);
// // //         if (!isMatch) return res.json({ success: false, message: 'Invalid Password' });
// // //         req.session.userId = user._id;
// // //         res.json({ success: true, redirect: '/dashboard' });
// // //     } catch (error) { res.status(500).json({ success: false }); }
// // // });

// // // app.get('/auth/logout', (req, res) => {
// // //     req.session.destroy(() => {
// // //         res.clearCookie('connect.sid');
// // //         res.redirect('/login');
// // //     });
// // // });

// // // app.get('/auth/check-status', (req, res) => {
// // //     res.json({ loggedIn: !!req.session.userId });
// // // });

// // // app.post('/auth/submit', isAuthenticated, async (req, res) => {
// // //     try {
// // //         const submissionData = req.body;

// // //         const existingApp = await FormData.findOne({ email: submissionData.email });
// // //         if (existingApp && existingApp.status === 'blocked') {
// // //             return res.status(403).send("Your account is blocked. You cannot submit forms.");
// // //         }

// // //         submissionData.termsAccepted = submissionData.terms === 'on';

// // //         if (typeof submissionData.preferredLanguage === 'string') {
// // //             submissionData.preferredLanguage = submissionData.preferredLanguage
// // //                 .split(',')
// // //                 .map(lang => lang.trim())
// // //                 .filter(lang => lang.length > 0);
// // //         }

// // //         submissionData.status = 'pending';

// // //         await FormData.findOneAndUpdate(
// // //             { email: submissionData.email },
// // //             { $set: submissionData },
// // //             { upsert: true, new: true, setDefaultsOnInsert: true }
// // //         );

// // //         res.sendFile(path.join(__dirname, 'views', 'submission-success.html'));
// // //     } catch (e) {
// // //         console.error("Submission Error:", e);
// // //         res.status(500).send("Error submitting application: " + e.message);
// // //     }
// // // });

// // // app.get('/api/applications', authenticate, async (req, res) => {
// // //     const apps = await FormData.find().sort({ createdAt: -1 });
// // //     res.json(apps);
// // // });

// // // app.get('/api/users', authenticate, async (req, res) => {
// // //     const users = await User.find().sort({ createdAt: -1 });
// // //     res.json(users);
// // // });

// // // app.get('/api/admin/projects', authenticate, async (req, res) => {
// // //     const projects = await Project.find().sort({ createdAt: -1 });
// // //     res.json(projects);
// // // });

// // // app.patch('/api/application/:id/card-details', authenticate, async (req, res) => {
// // //     try {
// // //         await FormData.findByIdAndUpdate(req.params.id, {
// // //             assignedRole: req.body.assignedRole,
// // //             assignedTeam: req.body.assignedTeam,
// // //             assignedReportingManager: req.body.assignedReportingManager,
// // //             assignedLeader: req.body.assignedLeader,
// // //             assignedPost: req.body.assignedPost,
// // //             assignedId: req.body.assignedId,

// // //             assignedTeamMembers: req.body.assignedTeamMembers,
// // //             assignedTeamRoles: req.body.assignedTeamRoles,
// // //             assignedTeamContact: req.body.assignedTeamContact,

// // //             adminMessage: req.body.adminMessage,
// // //             assignedWork: req.body.assignedWork
// // //         });
// // //         res.json({ success: true });
// // //     } catch (error) { res.status(500).json({ error: error.message }); }
// // // });

// // // app.patch('/api/application/:id/status', authenticate, async (req, res) => {
// // //     try {
// // //         await FormData.findByIdAndUpdate(req.params.id, { status: req.body.status });
// // //         res.json({ success: true });
// // //     } catch (error) { res.status(500).json({ error: error.message }); }
// // // });

// // // app.delete('/api/application/:id', authenticate, async (req, res) => {
// // //     await FormData.findByIdAndDelete(req.params.id);
// // //     res.json({ success: true });
// // // });

// // // app.delete('/api/user/:id', authenticate, async (req, res) => {
// // //     await User.findByIdAndDelete(req.params.id);
// // //     res.json({ success: true });
// // // });

// // // app.get('/api/application/allinfo/:id', authenticate, async (req, res) => {
// // //     const app = await FormData.findById(req.params.id);
// // //     res.json(app);
// // // });

// // // app.get('/api/user/allinfo/:id', authenticate, async (req, res) => {
// // //     const user = await User.findById(req.params.id);
// // //     res.json(user);
// // // });

// // // app.get('/api/admin/project/:id', authenticate, async (req, res) => {
// // //     const project = await Project.findById(req.params.id);
// // //     res.json(project);
// // // });

// // // app.patch('/api/admin/project/:id', authenticate, async (req, res) => {
// // //     await Project.findByIdAndUpdate(req.params.id, req.body);
// // //     res.json({ success: true });
// // // });

// // // app.delete('/api/admin/project/:id', authenticate, async (req, res) => {
// // //     await Project.findByIdAndDelete(req.params.id);
// // //     res.json({ success: true });
// // // });

// // // if (require.main === module) {
// // //     app.listen(PORT, () => {
// // //         console.log(`Server running on http://localhost:${PORT}`);
// // //     });
// // // }

// // // module.exports = app;

// // const express = require('express');
// // const app = express();
// // const mongoose = require('mongoose');
// // const path = require('path');
// // const session = require('express-session');
// // const MongoStore = require('connect-mongo');
// // const passport = require('passport');
// // const GoogleStrategy = require('passport-google-oauth20').Strategy;
// // const bcrypt = require('bcryptjs');
// // require('dotenv').config();

// // const FormData = require('./models/form.model');
// // const User = require('./models/user.model');
// // const Project = require('./models/project.model');

// // const PORT = process.env.PORT || 3000;

// // app.use(express.urlencoded({ extended: true }));
// // app.use(express.json({ limit: '10mb' }));
// // app.use('/public', express.static(path.join(__dirname, 'public')));

// // let isConnected = false;
// // async function connectToDB() {
// //     if (isConnected) return;
// //     try {
// //         await mongoose.connect(process.env.MONGO + process.env.PASS);
// //         isConnected = true;
// //         console.log('Connected to MongoDB');
// //     } catch (err) {
// //         console.error('MongoDB error:', err);
// //     }
// // }
// // app.use(async (req, res, next) => { if (!isConnected) await connectToDB(); next(); });

// // app.use(session({
// //     secret: process.env.SESSION_SECRET || 'supersecretkey',
// //     resave: false,
// //     saveUninitialized: false,
// //     store: MongoStore.create({ mongoUrl: process.env.MONGO + process.env.PASS, ttl: 14 * 24 * 60 * 60 }),
// //     cookie: { maxAge: 14 * 24 * 60 * 60 * 1000, httpOnly: true }
// // }));

// // app.use(passport.initialize());

// // passport.use(new GoogleStrategy({
// //     clientID: process.env.GOOGLE_CLIENT_ID,
// //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// //     callbackURL: "/auth/google/callback",
// //     proxy: true
// // }, async (accessToken, refreshToken, profile, done) => {
// //     try {
// //         let user = await User.findOne({ googleId: profile.id });
// //         if (user) return done(null, user);

// //         user = await User.findOne({ email: profile.emails[0].value });
// //         if (user) {
// //             user.googleId = profile.id;
// //             await user.save();
// //             return done(null, user);
// //         }

// //         const newUser = new User({
// //             username: profile.displayName,
// //             email: profile.emails[0].value,
// //             googleId: profile.id,
// //             profilePic: profile.photos[0].value,
// //             role: 'talent',
// //             isAdmin: false
// //         });
// //         await newUser.save();
// //         return done(null, newUser);
// //     } catch (err) { return done(err, null); }
// // }));

// // app.get('/auth/google', (req, res, next) => {
// //     req.session.tempRole = req.query.role || 'talent';
// //     req.session.authIntent = req.query.intent || 'signup';
// //     req.session.save(() => next());
// // }, passport.authenticate('google', { scope: ['profile', 'email'] }));

// // app.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), (req, res) => {
// //     req.session.userId = req.user._id;
// //     res.redirect('/dashboard');
// // });

// // const isAuthenticated = (req, res, next) => {
// //     if (req.session.userId) return next();
// //     res.redirect('/login');
// // };

// // function authenticate(req, res, next) {
// //     const authHeader = req.headers.authorization;
// //     if (!authHeader || !authHeader.startsWith('Basic ')) return res.status(401).json({ error: 'Auth required' });
// //     const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64').toString('ascii').split(':');
// //     if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) return next();
// //     return res.status(401).json({ error: 'Invalid credentials' });
// // }

// // app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
// // app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
// // app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'views', 'signup.html')));
// // app.get('/adminpanel', (req, res) => res.sendFile(path.join(__dirname, 'views', 'admin.html')));
// // app.get('/about-us', (req, res) => res.sendFile(path.join(__dirname, 'views', 'more-info.html')));


// // app.get('/dashboard', isAuthenticated, async (req, res) => {
// //     try {
// //         const user = await User.findById(req.session.userId);
// //         if (!user) return res.redirect('/login');
// //         res.sendFile(path.join(__dirname, 'views', user.role === 'client' ? 'client-dashboard.html' : 'profile.html'));
// //     } catch (err) { res.redirect('/login'); }
// // });

// // app.get('/profile', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'views', 'profile.html')));

// // app.get('/auth/joinus', isAuthenticated, async (req, res) => {
// //     try {
// //         const user = await User.findById(req.session.userId);
// //         const existingApp = await FormData.findOne({ email: user.email });

// //         if (existingApp && existingApp.status === 'blocked') {
// //             return res.send(`
// //                 <h1 style="color: red; text-align: center; margin-top: 50px; font-family: sans-serif;">Access Denied</h1>
// //                 <p style="text-align: center; font-family: sans-serif;">Your account has been blocked by the admin.</p>
// //                 <div style="text-align: center;"><a href="/profile">Go Back to Profile</a></div>
// //             `);
// //         }
// //         res.sendFile(path.join(__dirname, 'views', 'join-forms.html'));
// //     } catch (err) {
// //         res.redirect('/profile');
// //     }
// // });

// // app.get('/api/user/profile', isAuthenticated, async (req, res) => {
// //     try {
// //         const user = await User.findById(req.session.userId).select('-password');
// //         const application = await FormData.findOne({ email: user.email });
// //         res.json({ user, hasSubmitted: !!application, applicationData: application });
// //     } catch (error) { res.status(500).json({ error: error.message }); }
// // });

// // app.post('/api/user/update', isAuthenticated, async (req, res) => {
// //     try {
// //         await User.findByIdAndUpdate(req.session.userId, req.body);
// //         res.json({ success: true });
// //     } catch (error) { res.status(500).json({ success: false }); }
// // });

// // app.post('/auth/register', async (req, res) => {
// //     try {
// //         const { username, email, password, role } = req.body;
// //         const existingUser = await User.findOne({ $or: [{ email }, { username }] });
// //         if (existingUser) return res.json({ success: false, message: 'Taken' });
// //         const hashedPassword = await bcrypt.hash(password, 10);
// //         const newUser = new User({ username, email, password: hashedPassword, role: role || 'talent', isAdmin: false });
// //         await newUser.save();
// //         req.session.userId = newUser._id;
// //         res.json({ success: true, redirect: '/dashboard' });
// //     } catch (error) { res.status(500).json({ success: false }); }
// // });

// // app.post('/auth/login', async (req, res) => {
// //     try {
// //         const { email, password } = req.body;
// //         const user = await User.findOne({ email });
// //         if (!user) return res.json({ success: false, message: 'Invalid Email' });
// //         if (!user.password) return res.json({ success: false, message: 'Use Google' });
// //         const isMatch = await bcrypt.compare(password, user.password);
// //         if (!isMatch) return res.json({ success: false, message: 'Invalid Password' });
// //         req.session.userId = user._id;
// //         res.json({ success: true, redirect: '/dashboard' });
// //     } catch (error) { res.status(500).json({ success: false }); }
// // });

// // app.get('/auth/logout', (req, res) => {
// //     req.session.destroy(() => {
// //         res.clearCookie('connect.sid');
// //         res.redirect('/login');
// //     });
// // });

// // app.get('/auth/check-status', (req, res) => {
// //     res.json({ loggedIn: !!req.session.userId });
// // });

// // app.post('/auth/submit', isAuthenticated, async (req, res) => {
// //     try {
// //         const submissionData = req.body;

// //         const existingApp = await FormData.findOne({ email: submissionData.email });
// //         if (existingApp && existingApp.status === 'blocked') {
// //             return res.status(403).send("Your account is blocked. You cannot submit forms.");
// //         }

// //         submissionData.termsAccepted = submissionData.terms === 'on';

// //         if (typeof submissionData.preferredLanguage === 'string') {
// //             submissionData.preferredLanguage = submissionData.preferredLanguage
// //                 .split(',')
// //                 .map(lang => lang.trim())
// //                 .filter(lang => lang.length > 0);
// //         }

// //         submissionData.status = 'pending';

// //         await FormData.findOneAndUpdate(
// //             { email: submissionData.email },
// //             { $set: submissionData },
// //             { upsert: true, new: true, setDefaultsOnInsert: true }
// //         );

// //         res.sendFile(path.join(__dirname, 'views', 'submission-success.html'));
// //     } catch (e) {
// //         console.error("Submission Error:", e);
// //         res.status(500).send("Error submitting application: " + e.message);
// //     }
// // });

// // app.get('/api/applications', authenticate, async (req, res) => {
// //     const apps = await FormData.find().sort({ createdAt: -1 });
// //     res.json(apps);
// // });

// // app.get('/api/users', authenticate, async (req, res) => {
// //     const users = await User.find().sort({ createdAt: -1 });
// //     res.json(users);
// // });

// // app.get('/api/admin/projects', authenticate, async (req, res) => {
// //     const projects = await Project.find().sort({ createdAt: -1 });
// //     res.json(projects);
// // });

// // app.patch('/api/application/:id/card-details', authenticate, async (req, res) => {
// //     try {
// //         await FormData.findByIdAndUpdate(req.params.id, {
// //             assignedRole: req.body.assignedRole,
// //             assignedTeam: req.body.assignedTeam,
// //             assignedLeader: req.body.assignedLeader,
// //             assignedReportingManager: req.body.assignedReportingManager,
// //             assignedPost: req.body.assignedPost,
// //             assignedId: req.body.assignedId,

// //             assignedTeamMembers: req.body.assignedTeamMembers,
// //             assignedTeamRoles: req.body.assignedTeamRoles,
// //             assignedTeamContact: req.body.assignedTeamContact,

// //             adminMessage: req.body.adminMessage,
// //             assignedWork: req.body.assignedWork
// //         });
// //         res.json({ success: true });
// //     } catch (error) { res.status(500).json({ error: error.message }); }
// // });


// // app.patch('/api/application/:id/status', authenticate, async (req, res) => {
// //     try {
// //         const { status, adminName } = req.body;

// //         const updateData = { status };
// //         if (adminName) {
// //             updateData.reviewedBy = adminName;
// //         }

// //         await FormData.findByIdAndUpdate(req.params.id, updateData);
// //         res.json({ success: true });
// //     } catch (error) { res.status(500).json({ error: error.message }); }
// // });



// // app.delete('/api/application/:id', authenticate, async (req, res) => {
// //     await FormData.findByIdAndDelete(req.params.id);
// //     res.json({ success: true });
// // });

// // app.delete('/api/user/:id', authenticate, async (req, res) => {
// //     await User.findByIdAndDelete(req.params.id);
// //     res.json({ success: true });
// // });

// // app.get('/api/application/allinfo/:id', authenticate, async (req, res) => {
// //     const app = await FormData.findById(req.params.id);
// //     res.json(app);
// // });

// // app.get('/api/user/allinfo/:id', authenticate, async (req, res) => {
// //     const user = await User.findById(req.params.id);
// //     res.json(user);
// // });

// // app.get('/api/admin/project/:id', authenticate, async (req, res) => {
// //     const project = await Project.findById(req.params.id);
// //     res.json(project);
// // });

// // app.patch('/api/admin/project/:id', authenticate, async (req, res) => {
// //     await Project.findByIdAndUpdate(req.params.id, req.body);
// //     res.json({ success: true });
// // });

// // app.delete('/api/admin/project/:id', authenticate, async (req, res) => {
// //     await Project.findByIdAndDelete(req.params.id);
// //     res.json({ success: true });
// // });

// // if (require.main === module) {
// //     app.listen(PORT, () => {
// //         console.log(`Server running on http://localhost:${PORT}`);
// //     });
// // }

// // module.exports = app;
// const express = require('express');
// const app = express();
// const mongoose = require('mongoose');
// const path = require('path');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const bcrypt = require('bcryptjs');
// require('dotenv').config();

// const FormData = require('./models/form.model');
// const User = require('./models/user.model');
// const Project = require('./models/project.model');

// const PORT = process.env.PORT || 3000;

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json({ limit: '10mb' }));
// app.use('/public', express.static(path.join(__dirname, 'public')));

// let isConnected = false;
// async function connectToDB() {
//     if (isConnected) return;
//     try {
//         await mongoose.connect(process.env.MONGO + process.env.PASS);
//         isConnected = true;
//         console.log('Connected to MongoDB');
//     } catch (err) {
//         console.error('MongoDB error:', err);
//     }
// }
// app.use(async (req, res, next) => { if (!isConnected) await connectToDB(); next(); });

// app.use(session({
//     secret: process.env.SESSION_SECRET || 'supersecretkey',
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({ mongoUrl: process.env.MONGO + process.env.PASS, ttl: 14 * 24 * 60 * 60 }),
//     cookie: { maxAge: 14 * 24 * 60 * 60 * 1000, httpOnly: true }
// }));

// app.use(passport.initialize());

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "/auth/google/callback",
//     proxy: true
// }, async (accessToken, refreshToken, profile, done) => {
//     try {
//         let user = await User.findOne({ googleId: profile.id });
//         if (user) return done(null, user);

//         user = await User.findOne({ email: profile.emails[0].value });
//         if (user) {
//             user.googleId = profile.id;
//             await user.save();
//             return done(null, user);
//         }

//         const newUser = new User({
//             username: profile.displayName,
//             email: profile.emails[0].value,
//             googleId: profile.id,
//             profilePic: profile.photos[0].value,
//             role: 'talent',
//             isAdmin: false
//         });
//         await newUser.save();
//         return done(null, newUser);
//     } catch (err) { return done(err, null); }
// }));

// app.get('/auth/google', (req, res, next) => {
//     req.session.tempRole = req.query.role || 'talent';
//     req.session.authIntent = req.query.intent || 'signup';
//     req.session.save(() => next());
// }, passport.authenticate('google', { scope: ['profile', 'email'] }));

// app.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), (req, res) => {
//     req.session.userId = req.user._id;
//     res.redirect('/dashboard');
// });

// const isAuthenticated = (req, res, next) => {
//     if (req.session.userId) return next();
//     res.redirect('/login');
// };

// function authenticate(req, res, next) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Basic ')) return res.status(401).json({ error: 'Auth required' });

//     const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64').toString('ascii').split(':');

//     if (password === process.env.ADMIN_PASS) {
//         req.adminName = username;
//         return next();
//     }

//     return res.status(401).json({ error: 'Invalid credentials' });
// }

// app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
// app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
// app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'views', 'signup.html')));
// app.get('/adminpanel', (req, res) => res.sendFile(path.join(__dirname, 'views', 'admin.html')));
// app.get('/about-us', (req, res) => res.sendFile(path.join(__dirname, 'views', 'more-info.html')));

// app.get('/dashboard', isAuthenticated, async (req, res) => {
//     try {
//         const user = await User.findById(req.session.userId);
//         if (!user) return res.redirect('/login');
//         // Logic to serve correct dashboard based on role
//         if (user.role === 'client') {
//             res.sendFile(path.join(__dirname, 'views', 'client-dashboard.html'));
//         } else {
//             res.sendFile(path.join(__dirname, 'views', 'profile.html'));
//         }
//     } catch (err) { res.redirect('/login'); }
// });

// app.get('/profile', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'views', 'profile.html')));

// // --- NEW: Switch Role Route ---
// app.post('/api/user/switch-role', isAuthenticated, async (req, res) => {
//     try {
//         const user = await User.findById(req.session.userId);
//         // Swap roles
//         if (user.role === 'client') {
//             user.role = 'talent';
//         } else {
//             user.role = 'client';
//         }
//         await user.save();
//         res.json({ success: true, newRole: user.role });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false });
//     }
// });

// app.get('/auth/joinus', isAuthenticated, async (req, res) => {
//     try {
//         const user = await User.findById(req.session.userId);
//         const existingApp = await FormData.findOne({ email: user.email });
//         if (existingApp && existingApp.status === 'blocked') {
//             return res.send(`<h1 style="color:red;text-align:center;margin-top:50px;">Access Denied</h1><p style="text-align:center;">Blocked by admin.</p><div style="text-align:center;"><a href="/profile">Back</a></div>`);
//         }
//         res.sendFile(path.join(__dirname, 'views', 'join-forms.html'));
//     } catch (err) { res.redirect('/profile'); }
// });

// app.get('/api/user/profile', isAuthenticated, async (req, res) => {
//     try {
//         const user = await User.findById(req.session.userId).select('-password');
//         const application = await FormData.findOne({ email: user.email });
//         res.json({ user, hasSubmitted: !!application, applicationData: application });
//     } catch (error) { res.status(500).json({ error: error.message }); }
// });

// app.post('/api/user/update', isAuthenticated, async (req, res) => {
//     try {
//         await User.findByIdAndUpdate(req.session.userId, req.body);
//         res.json({ success: true });
//     } catch (error) { res.status(500).json({ success: false }); }
// });

// app.post('/auth/register', async (req, res) => {
//     try {
//         const { username, email, password, role } = req.body;
//         const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//         if (existingUser) return res.json({ success: false, message: 'Taken' });
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new User({ username, email, password: hashedPassword, role: role || 'talent', isAdmin: false });
//         await newUser.save();
//         req.session.userId = newUser._id;
//         res.json({ success: true, redirect: '/dashboard' });
//     } catch (error) { res.status(500).json({ success: false }); }
// });

// app.post('/auth/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) return res.json({ success: false, message: 'Invalid Email' });
//         if (!user.password) return res.json({ success: false, message: 'Use Google' });
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.json({ success: false, message: 'Invalid Password' });
//         req.session.userId = user._id;
//         res.json({ success: true, redirect: '/dashboard' });
//     } catch (error) { res.status(500).json({ success: false }); }
// });

// app.get('/auth/logout', (req, res) => {
//     req.session.destroy(() => {
//         res.clearCookie('connect.sid');
//         res.redirect('/login');
//     });
// });

// app.get('/auth/check-status', (req, res) => {
//     res.json({ loggedIn: !!req.session.userId });
// });

// app.post('/auth/submit', isAuthenticated, async (req, res) => {
//     try {
//         const submissionData = req.body;
//         const existingApp = await FormData.findOne({ email: submissionData.email });
//         if (existingApp && existingApp.status === 'blocked') {
//             return res.status(403).send("Blocked account.");
//         }
//         submissionData.termsAccepted = submissionData.terms === 'on';
//         if (typeof submissionData.preferredLanguage === 'string') {
//             submissionData.preferredLanguage = submissionData.preferredLanguage.split(',').map(l => l.trim()).filter(l => l.length > 0);
//         }
//         submissionData.status = 'pending';
//         submissionData.reviewedBy = 'System';

//         await FormData.findOneAndUpdate(
//             { email: submissionData.email },
//             { $set: submissionData },
//             { upsert: true, new: true, setDefaultsOnInsert: true }
//         );
//         res.sendFile(path.join(__dirname, 'views', 'submission-success.html'));
//     } catch (e) { res.status(500).send("Error: " + e.message); }
// });

// app.get('/api/applications', authenticate, async (req, res) => {
//     const apps = await FormData.find().sort({ createdAt: -1 });
//     res.json(apps);
// });

// app.get('/api/users', authenticate, async (req, res) => {
//     const users = await User.find().sort({ createdAt: -1 });
//     res.json(users);
// });

// app.get('/api/admin/projects', authenticate, async (req, res) => {
//     const projects = await Project.find().sort({ createdAt: -1 });
//     res.json(projects);
// });

// app.patch('/api/application/:id/card-details', authenticate, async (req, res) => {
//     try {
//         await FormData.findByIdAndUpdate(req.params.id, {
//             assignedRole: req.body.assignedRole,
//             assignedTeam: req.body.assignedTeam,
//             assignedLeader: req.body.assignedLeader,
//             assignedReportingManager: req.body.assignedReportingManager,
//             assignedPost: req.body.assignedPost,
//             assignedId: req.body.assignedId,
//             assignedTeamMembers: req.body.assignedTeamMembers,
//             assignedTeamRoles: req.body.assignedTeamRoles,
//             assignedTeamContact: req.body.assignedTeamContact,
//             adminMessage: req.body.adminMessage,
//             assignedWork: req.body.assignedWork,
//             reviewedBy: req.adminName
//         });
//         res.json({ success: true });
//     } catch (error) { res.status(500).json({ error: error.message }); }
// });

// app.patch('/api/application/:id/status', authenticate, async (req, res) => {
//     try {
//         await FormData.findByIdAndUpdate(req.params.id, {
//             status: req.body.status,
//             reviewedBy: req.adminName
//         });
//         res.json({ success: true });
//     } catch (error) { res.status(500).json({ error: error.message }); }
// });

// app.delete('/api/application/:id', authenticate, async (req, res) => {
//     await FormData.findByIdAndDelete(req.params.id);
//     res.json({ success: true });
// });

// app.delete('/api/user/:id', authenticate, async (req, res) => {
//     await User.findByIdAndDelete(req.params.id);
//     res.json({ success: true });
// });

// app.get('/api/application/allinfo/:id', authenticate, async (req, res) => {
//     const app = await FormData.findById(req.params.id);
//     res.json(app);
// });

// app.get('/api/user/allinfo/:id', authenticate, async (req, res) => {
//     const user = await User.findById(req.params.id);
//     res.json(user);
// });

// app.get('/api/admin/project/:id', authenticate, async (req, res) => {
//     const project = await Project.findById(req.params.id);
//     res.json(project);
// });

// app.patch('/api/admin/project/:id', authenticate, async (req, res) => {
//     await Project.findByIdAndUpdate(req.params.id, req.body);
//     res.json({ success: true });
// });

// app.delete('/api/admin/project/:id', authenticate, async (req, res) => {
//     await Project.findByIdAndDelete(req.params.id);
//     res.json({ success: true });
// });

// if (require.main === module) {
//     app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
// }

// module.exports = app;

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
require('dotenv').config();

const FormData = require('./models/form.model');
const User = require('./models/user.model');
const Project = require('./models/project.model');

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use('/public', express.static(path.join(__dirname, 'public')));

let isConnected = false;
async function connectToDB() {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGO + process.env.PASS);
        isConnected = true;
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB error:', err);
    }
}
app.use(async (req, res, next) => { if (!isConnected) await connectToDB(); next(); });

app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO + process.env.PASS, ttl: 14 * 24 * 60 * 60 }),
    cookie: { maxAge: 14 * 24 * 60 * 60 * 1000, httpOnly: true }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    proxy: true
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
            user.googleId = profile.id;
            await user.save();
            return done(null, user);
        }

        const newUser = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            profilePic: profile.photos[0].value,
            role: 'talent',
            isAdmin: false
        });
        await newUser.save();
        return done(null, newUser);
    } catch (err) { return done(err, null); }
}));

app.get('/auth/google', (req, res, next) => {
    req.session.tempRole = req.query.role || 'talent';
    req.session.authIntent = req.query.intent || 'signup';
    req.session.save(() => next());
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    req.session.userId = req.user._id;
    res.redirect('/dashboard');
});

const isAuthenticated = (req, res, next) => {
    if (req.session.userId || req.isAuthenticated()) {
        if (!req.session.userId) req.session.userId = req.user._id;
        return next();
    }
    res.redirect('/login');
};

function authenticateAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) return res.status(401).json({ error: 'Auth required' });

    const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64').toString('ascii').split(':');

    if (password === process.env.ADMIN_PASS) {
        req.adminName = username;
        return next();
    }

    return res.status(401).json({ error: 'Invalid credentials' });
}

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));

app.get('/login', (req, res) => {
    if (req.session.userId) return res.redirect('/dashboard');
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/signup', (req, res) => {
    if (req.session.userId) return res.redirect('/dashboard');
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/adminpanel', (req, res) => res.sendFile(path.join(__dirname, 'views', 'admin.html')));
app.get('/about-us', (req, res) => res.sendFile(path.join(__dirname, 'views', 'more-info.html')));

app.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            req.session.destroy();
            return res.redirect('/login');
        }
        if (user.role === 'client') {
            res.sendFile(path.join(__dirname, 'views', 'client-dashboard.html'));
        } else {
            res.sendFile(path.join(__dirname, 'views', 'profile.html'));
        }
    } catch (err) {
        console.error(err);
        res.redirect('/login');
    }
});

app.get('/profile', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'views', 'profile.html')));

app.post('/api/user/switch-role', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (user.role === 'client') {
            user.role = 'talent';
        } else {
            user.role = 'client';
        }
        await user.save();
        res.json({ success: true, newRole: user.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
});

app.get('/auth/joinus', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        const existingApp = await FormData.findOne({ email: user.email });
        if (existingApp && existingApp.status === 'blocked') {
            return res.send(`<h1 style="color:red;text-align:center;margin-top:50px;">Access Denied</h1><p style="text-align:center;">Blocked by admin.</p><div style="text-align:center;"><a href="/profile">Back</a></div>`);
        }
        res.sendFile(path.join(__dirname, 'views', 'join-forms.html'));
    } catch (err) { res.redirect('/profile'); }
});

app.get('/api/user/profile', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).select('-password');
        if (!user) return res.status(404).json({ error: "User not found" });
        const application = await FormData.findOne({ email: user.email });
        res.json({ user, hasSubmitted: !!application, applicationData: application });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/user/update', isAuthenticated, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.session.userId, req.body);
        res.json({ success: true });
    } catch (error) { res.status(500).json({ success: false }); }
});

app.post('/auth/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) return res.json({ success: false, message: 'Taken' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, role: role || 'talent', isAdmin: false });
        await newUser.save();
        req.session.userId = newUser._id;
        res.json({ success: true, redirect: '/dashboard' });
    } catch (error) { res.status(500).json({ success: false }); }
});

app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.json({ success: false, message: 'Invalid Email' });
        if (!user.password) return res.json({ success: false, message: 'Use Google' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, message: 'Invalid Password' });
        req.session.userId = user._id;
        res.json({ success: true, redirect: '/dashboard' });
    } catch (error) { res.status(500).json({ success: false }); }
});

app.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.redirect('/login');
        });
    });
});

app.get('/auth/check-status', (req, res) => {
    res.json({ loggedIn: !!req.session.userId || req.isAuthenticated() });
});

app.post('/auth/submit', isAuthenticated, async (req, res) => {
    try {
        const submissionData = req.body;
        const existingApp = await FormData.findOne({ email: submissionData.email });
        if (existingApp && existingApp.status === 'blocked') {
            return res.status(403).send("Blocked account.");
        }
        submissionData.termsAccepted = submissionData.terms === 'on';
        if (typeof submissionData.preferredLanguage === 'string') {
            submissionData.preferredLanguage = submissionData.preferredLanguage.split(',').map(l => l.trim()).filter(l => l.length > 0);
        }
        submissionData.status = 'pending';
        submissionData.reviewedBy = 'System';

        await FormData.findOneAndUpdate(
            { email: submissionData.email },
            { $set: submissionData },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        res.sendFile(path.join(__dirname, 'views', 'submission-success.html'));
    } catch (e) { res.status(500).send("Error: " + e.message); }
});

app.get('/api/client/dashboard', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (user.role !== 'client') {
            return res.redirect('/dashboard');
        }
        const projects = await Project.find({ clientId: user._id });
        res.json({ user, projects });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/client/project', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (user.role !== 'client') return res.status(403).json({ error: "Unauthorized" });

        const newProject = new Project({
            clientId: user._id,
            clientName: user.username,
            title: req.body.title,
            description: req.body.description,
            status: 'pending'
        });
        await newProject.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/applications', authenticateAdmin, async (req, res) => {
    const apps = await FormData.find().sort({ createdAt: -1 });
    res.json(apps);
});

app.get('/api/users', authenticateAdmin, async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
});

app.get('/api/admin/projects', authenticateAdmin, async (req, res) => {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
});

app.patch('/api/application/:id/card-details', authenticateAdmin, async (req, res) => {
    try {
        await FormData.findByIdAndUpdate(req.params.id, {
            assignedRole: req.body.assignedRole,
            assignedTeam: req.body.assignedTeam,
            assignedLeader: req.body.assignedLeader,
            assignedReportingManager: req.body.assignedReportingManager,
            assignedPost: req.body.assignedPost,
            assignedId: req.body.assignedId,
            assignedTeamMembers: req.body.assignedTeamMembers,
            assignedTeamRoles: req.body.assignedTeamRoles,
            assignedTeamContact: req.body.assignedTeamContact,
            adminMessage: req.body.adminMessage,
            assignedWork: req.body.assignedWork,
            reviewedBy: req.adminName
        });
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.patch('/api/application/:id/status', authenticateAdmin, async (req, res) => {
    try {
        await FormData.findByIdAndUpdate(req.params.id, {
            status: req.body.status,
            reviewedBy: req.adminName
        });
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/application/:id', authenticateAdmin, async (req, res) => {
    await FormData.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

app.delete('/api/user/:id', authenticateAdmin, async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

app.get('/api/application/allinfo/:id', authenticateAdmin, async (req, res) => {
    const app = await FormData.findById(req.params.id);
    res.json(app);
});

app.get('/api/user/allinfo/:id', authenticateAdmin, async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
});

app.get('/api/admin/project/:id', authenticateAdmin, async (req, res) => {
    const project = await Project.findById(req.params.id);
    res.json(project);
});

app.patch('/api/admin/project/:id', authenticateAdmin, async (req, res) => {
    await Project.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true });
});

app.delete('/api/admin/project/:id', authenticateAdmin, async (req, res) => {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;