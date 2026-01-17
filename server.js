const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const FormData = require('./models/form.model');
const User = require('./models/user.model');
const Project = require('./models/project.model');
const Announcement = require('./models/announcement.model');

const PORT = process.env.PORT || 3000;
const VERIFIED_SENDER_EMAIL = "novaspeed.org@gmail.com";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

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

app.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), (req, res) => {
    req.session.userId = req.user._id;
    res.redirect('/dashboard');
});

const isAuthenticated = (req, res, next) => {
    if (req.session.userId) return next();
    res.redirect('/login');
};

const isLoggedOut = (req, res, next) => {
    if (req.session.userId) return res.redirect('/dashboard');
    next();
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
app.get('/login', isLoggedOut, (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
app.get('/signup', isLoggedOut, (req, res) => res.sendFile(path.join(__dirname, 'views', 'signup.html')));
app.get('/forgot-password', isLoggedOut, (req, res) => res.sendFile(path.join(__dirname, 'views', 'forget.html')));
app.get('/adminpanel', (req, res) => res.sendFile(path.join(__dirname, 'views', 'admin.html')));

// Public Page for Announcements
app.get('/announcements', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'views', 'announcement.html')));

app.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) return res.redirect('/login');
        if (user.role === 'client') {
            res.sendFile(path.join(__dirname, 'views', 'client-dashboard.html'));
        } else {
            res.sendFile(path.join(__dirname, 'views', 'profile.html'));
        }
    } catch (err) { res.redirect('/login'); }
});

app.get('/profile', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'views', 'profile.html')));

app.post('/api/user/switch-role', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        user.role = (user.role === 'client') ? 'talent' : 'client';
        await user.save();
        res.json({ success: true, newRole: user.role });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
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
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

app.get('/auth/check-status', (req, res) => {
    res.json({ loggedIn: !!req.session.userId });
});

app.get('/api/announcements',isAuthenticated ,async (req, res) => {
    try {
        const updates = await Announcement.find().sort({ createdAt: -1 });
        res.json(updates);
    } catch (err) { res.status(500).json({ error: err.message }); }
});


app.post('/api/admin/announcement', authenticateAdmin, async (req, res) => {
    try {
        const newAnnounce = new Announcement({
            title: req.body.title,
            message: req.body.message,
            type: req.body.type
        });
        await newAnnounce.save();
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});


app.delete('/api/admin/announcement/:id', authenticateAdmin, async (req, res) => {
    try {
        await Announcement.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});


app.post('/auth/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.json({ success: false, message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 600000;
        await user.save();

        const mailOptions = {
            from: VERIFIED_SENDER_EMAIL,
            to: user.email,
            subject: 'Verification Code for Novaa Speed',
            text: `Dear ${user.username},\n\nCode: ${otp}`,
            html: `<h3>Your Verification Code is: <b>${otp}</b></h3>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) return res.json({ success: false, message: "Email failed" });
            res.json({ success: true });
        });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/auth/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email, resetPasswordOTP: otp, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) return res.json({ success: false, message: "Invalid/Expired OTP" });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/auth/submit', isAuthenticated, async (req, res) => {
    try {
        const submissionData = req.body;
        const existingApp = await FormData.findOne({ email: submissionData.email });
        if (existingApp && existingApp.status === 'blocked') return res.status(403).send("Blocked account.");

        submissionData.termsAccepted = submissionData.terms === 'on';
        if (typeof submissionData.preferredLanguage === 'string') {
            submissionData.preferredLanguage = submissionData.preferredLanguage.split(',').map(l => l.trim()).filter(l => l.length > 0);
        }
        submissionData.status = 'pending';
        submissionData.reviewedBy = 'System';

        await FormData.findOneAndUpdate(
            { email: submissionData.email }, { $set: submissionData }, { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        res.sendFile(path.join(__dirname, 'views', 'submission-success.html'));
    } catch (e) { res.status(500).send(e.message); }
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

app.get('/api/client/dashboard', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (user.role !== 'client') return res.redirect('/dashboard');
        const projects = await Project.find({ clientId: user._id });
        res.json({ user, projects });
    } catch (err) { res.status(500).json({ error: err.message }); }
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
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/announcement/:id/reply', isAuthenticated, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: "Message empty" });

        const user = await User.findById(req.session.userId);
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) return res.status(404).json({ error: "Announcement not found" });

        announcement.replies.push({
            username: user.username,
            text: text
        });

        await announcement.save();
        res.json({ success: true, replies: announcement.replies });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;