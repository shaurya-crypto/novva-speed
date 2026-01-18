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

// --- FIX 1: TRUST PROXY (Required for Vercel/Render/Heroku) ---
app.set('trust proxy', 1);

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use('/public', express.static(path.join(__dirname, 'public')));

let isConnected = false;
async function connectToDB() {
    if (isConnected) return;
    try {
        const mongoUri = process.env.MONGO_URI || (process.env.MONGO + (process.env.PASS || ''));
        await mongoose.connect(mongoUri);
        isConnected = true;
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB error:', err);
        isConnected = false;
    }
}
app.use(async (req, res, next) => { if (!isConnected) await connectToDB(); next(); });

// --- FIX 2: UPDATED SESSION CONFIG ---
app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI || (process.env.MONGO + (process.env.PASS || '')),
        ttl: 14 * 24 * 60 * 60
    }),
    cookie: {
        maxAge: 14 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        // In production, we must trust the proxy for this to work
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user._id);
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

app.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), (req, res) => {
    req.session.userId = req.user._id;
    req.session.save((err) => {
        if (err) return res.redirect('/login');
        res.redirect('/dashboard');
    });
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
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).json({ error: 'Auth required' });
        }
        const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('ascii');
        const [username, password] = credentials.split(':');

        if (!username || !password) {
            return res.status(401).json({ error: 'Invalid credentials format' });
        }

        const adminPass = process.env.ADMIN_PASS;

        if (password === adminPass) {
            req.adminName = username;
            return next();
        }
        return res.status(401).json({ error: 'Invalid credentials' });
    } catch (err) {
        return res.status(401).json({ error: 'Authentication error' });
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function sanitizeInput(str) {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/[<>]/g, '');
}

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/login', isLoggedOut, (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
app.get('/signup', isLoggedOut, (req, res) => res.sendFile(path.join(__dirname, 'views', 'signup.html')));
app.get('/forgot-password', isLoggedOut, (req, res) => res.sendFile(path.join(__dirname, 'views', 'forget.html')));
app.get('/adminpanel', (req, res) => res.sendFile(path.join(__dirname, 'views', 'admin.html')));
app.get('/announcements', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'views', 'announcement.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'views', 'contact.html')));

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
        const updateData = {};
        if (req.body.username) {
            const sanitized = sanitizeInput(req.body.username);
            if (sanitized.length < 3 || sanitized.length > 30) {
                return res.status(400).json({ success: false, message: 'Username must be 3-30 characters' });
            }
            updateData.username = sanitized;
        }
        if (req.body.bio !== undefined) {
            updateData.bio = sanitizeInput(req.body.bio).substring(0, 500);
        }
        if (req.body.profilePic && req.body.profilePic.startsWith('data:image/')) {
            updateData.profilePic = req.body.profilePic;
        }
        await User.findByIdAndUpdate(req.session.userId, updateData);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/auth/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) return res.status(400).json({ success: false, message: 'All fields are required' });
        if (username.length < 3 || username.length > 30) return res.status(400).json({ success: false, message: 'Username must be 3-30 characters' });
        if (!validateEmail(email)) return res.status(400).json({ success: false, message: 'Invalid email format' });
        if (password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

        const sanitizedUsername = sanitizeInput(username);
        const sanitizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({ $or: [{ email: sanitizedEmail }, { username: sanitizedUsername }] });
        if (existingUser) return res.json({ success: false, message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        req.session.tempUser = {
            username: sanitizedUsername,
            email: sanitizedEmail,
            password: hashedPassword,
            role: (role === 'client' ? 'client' : 'talent'),
            otp: otp,
            otpExpires: Date.now() + 600000
        };

        const mailOptions = {
            from: `"Novaa Speed Security" <${VERIFIED_SENDER_EMAIL}>`,
            to: email,
            subject: `${otp} is your verification code - Novaa Speed`,
            html: `
            <div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2;">
                <div style="margin: 50px auto; width: 70%; padding: 20px 0;">
                    <div style="border-bottom: 1px solid #eee; text-align: center; padding-bottom: 20px;">
                        <img src="https://res.cloudinary.com/dddqftl9i/image/upload/v1768630264/pasted-image-2026-01-08T07-36-56-971Z_cropped_processed_by_imagy_1_affisr.png" alt="Novaa Speed" width="80" style="display:block; margin: 0 auto 10px auto;">
                        <a href="" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600;">Novaa Speed</a>
                    </div>
                    <p style="font-size: 1.1em;">Hi ${username},</p>
                    <p>To create your Novaa Speed account, please use the following verification code:</p>
                    <h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${otp}</h2>
                    <p style="font-size: 0.9em;">If you did not request this, please ignore this email.</p>
                </div>
            </div>
            `
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) console.error("Email sending failed:", error);
        });

        req.session.save((err) => {
            if (err) return res.status(500).json({ success: false, message: 'Session Error' });
            res.json({ success: true, redirect: '/auth/otp-verification' });
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

app.get('/auth/otp-verification', (req, res) => {
    if (!req.session.tempUser) return res.redirect('/signup');
    res.sendFile(path.join(__dirname, 'views', 'otp.html'));
});

app.post('/auth/verify-email-otp', async (req, res) => {
    try {
        const { otp } = req.body;
        const tempUser = req.session.tempUser;

        if (!tempUser) return res.json({ success: false, message: "Session expired. Register again." });

        if (tempUser.otp !== otp || tempUser.otpExpires < Date.now()) {
            return res.json({ success: false, message: "Invalid or expired code." });
        }

        const newUser = new User({
            username: tempUser.username,
            email: tempUser.email,
            password: tempUser.password,
            role: tempUser.role,
            isAdmin: false,
            isVerified: true
        });

        await newUser.save();
        req.session.userId = newUser._id;
        delete req.session.tempUser;

        req.session.save((err) => {
            if (err) return res.json({ success: false, message: "Login Session Error" });
            res.json({ success: true, redirect: '/dashboard' });
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/auth/resend-registration-otp', async (req, res) => {
    try {
        const tempUser = req.session.tempUser;
        if (!tempUser) return res.json({ success: false, message: "Session expired. Register again." });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        req.session.tempUser.otp = otp;
        req.session.tempUser.otpExpires = Date.now() + 600000;

        req.session.save((err) => {
            if (err) return res.status(500).json({ success: false, message: "Session Save Error" });

            const mailOptions = {
                from: `"Novaa Speed Security" <${VERIFIED_SENDER_EMAIL}>`,
                to: tempUser.email,
                subject: `${otp} is your verification code - Novaa Speed`,
                html: `
                <div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2;">
                    <div style="margin: 50px auto; width: 70%; padding: 20px 0;">
                        <div style="border-bottom: 1px solid #eee; text-align: center; padding-bottom: 20px;">
                            <img src="https://res.cloudinary.com/dddqftl9i/image/upload/v1768630264/pasted-image-2026-01-08T07-36-56-971Z_cropped_processed_by_imagy_1_affisr.png" alt="Novaa Speed" width="80" style="display:block; margin: 0 auto 10px auto;">
                            <a href="" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600;">Novaa Speed</a>
                        </div>
                        <p style="font-size: 1.1em;">Hi ${tempUser.username},</p>
                        <p>Here is your new verification code:</p>
                        <h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${otp}</h2>
                    </div>
                </div>
                `
            };

            transporter.sendMail(mailOptions, (error) => {
                if (error) console.error("Email failed:", error);
            });

            res.json({ success: true });
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.json({ success: false, message: 'Invalid Email or Password' });
        }

        if (!user.password) {
            return res.json({ success: false, message: 'Please use Google Sign-In for this account' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid Email or Password' });
        }

        req.session.userId = user._id;

        req.session.save((err) => {
            if (err) return res.status(500).json({ success: false, message: "Session Error" });
            res.json({ success: true, redirect: '/dashboard' });
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
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

app.get('/api/announcements', isAuthenticated, async (req, res) => {
    try {
        const updates = await Announcement.find().sort({ createdAt: -1 });
        res.json(updates);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/admin/announcement', authenticateAdmin, async (req, res) => {
    try {
        const { title, message, type } = req.body;
        if (!title || !title.trim() || !message || !message.trim()) {
            return res.status(400).json({ error: 'Title and message are required' });
        }
        const newAnnounce = new Announcement({
            title: sanitizeInput(title),
            message: sanitizeInput(message),
            type: type || 'update'
        });
        await newAnnounce.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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

        if (!email || !validateEmail(email)) {
            return res.status(400).json({ success: false, message: "Valid email is required" });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 600000;
        await user.save();

        const mailOptions = {
            from: `"Novaa Speed Security" <${VERIFIED_SENDER_EMAIL}>`,
            to: user.email,
            subject: `${otp} is your Novaa Speed verification code`,
            text: `Hi ${user.username},\n\nSomeone tried to log in to your Novaa Speed account. If this was you, please use the following code to confirm your identity:\n\n${otp}\n\nIf it wasn't you, you can safely ignore this email.\n\n\u00A9 ${new Date().getFullYear()} Novaa Speed`,
            html: `
            <div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2;">
                <div style="margin: 50px auto; width: 70%; padding: 20px 0;">
                    <div style="border-bottom: 1px solid #eee; text-align: center; padding-bottom: 20px;">
                        <img src="https://res.cloudinary.com/dddqftl9i/image/upload/v1768630264/pasted-image-2026-01-08T07-36-56-971Z_cropped_processed_by_imagy_1_affisr.png" alt="Novaa Speed" width="80" style="display:block; margin: 0 auto 10px auto;">
                        <a href="" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600;">Novaa Speed</a>
                    </div>
                    <p style="font-size: 1.1em;">Hi ${user.username},</p>
                    <p>Someone tried to reset the password for your Novaa Speed account. If this was you, please use the following verification code to confirm your identity. This code is valid for 10 minutes.</p>
                    <h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${otp}</h2>
                    <p style="font-size: 0.9em;">If it wasn't you, you can safely ignore this email. Someone might have typed your email address by mistake.</p>
                    <hr style="border: none; border-top: 1px solid #eee;" />
                    <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300;">
                        <p>Novaa Speed Inc.</p>
                        <p>123 Tech Street</p>
                        <p>California</p>
                    </div>
                </div>
            </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) return res.json({ success: false, message: "Email failed to send." });
            res.json({ success: true });
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/auth/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim(),
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.json({ success: false, message: "Invalid or expired verification code" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/auth/submit', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(401).redirect('/login');

        const submissionData = req.body;

        if (!submissionData.email || !submissionData.fullName || !submissionData.phone) {
            return res.status(400).json({ success: false, message: 'Required fields are missing' });
        }

        if (submissionData.email.toLowerCase().trim() !== user.email.toLowerCase().trim()) {
            return res.status(403).json({ success: false, message: 'Email mismatch' });
        }

        const existingApp = await FormData.findOne({ email: user.email });
        if (existingApp && existingApp.status === 'blocked') {
            return res.status(403).json({ success: false, message: 'Account blocked by admin' });
        }

        submissionData.email = user.email.toLowerCase().trim();
        submissionData.termsAccepted = submissionData.terms === 'on';

        if (typeof submissionData.preferredLanguage === 'string') {
            submissionData.preferredLanguage = submissionData.preferredLanguage
                .split(',')
                .map(l => sanitizeInput(l))
                .filter(l => l.length > 0);
        }

        submissionData.status = 'pending';
        submissionData.reviewedBy = 'System';

        await FormData.findOneAndUpdate(
            { email: submissionData.email },
            { $set: submissionData },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.sendFile(path.join(__dirname, 'views', 'submission-success.html'));
    } catch (e) {
        res.status(500).json({ success: false, message: 'Submission failed. Please try again.' });
    }
});

app.get('/api/applications', authenticateAdmin, async (req, res) => {
    try {
        const apps = await FormData.find().sort({ createdAt: -1 });
        res.json(apps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/users', authenticateAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password -resetPasswordOTP -resetPasswordExpires').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/projects', authenticateAdmin, async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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
    try {
        await FormData.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/user/:id', authenticateAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/application/allinfo/:id', authenticateAdmin, async (req, res) => {
    try {
        const app = await FormData.findById(req.params.id);
        if (!app) return res.status(404).json({ error: 'Application not found' });
        res.json(app);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/user/allinfo/:id', authenticateAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -resetPasswordOTP -resetPasswordExpires');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/project/:id', authenticateAdmin, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/admin/project/:id', authenticateAdmin, async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/project/:id', authenticateAdmin, async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        if (user.role !== 'client') {
            return res.status(403).json({ error: "Only clients can create projects" });
        }

        const { title, description } = req.body;
        if (!title || !title.trim() || !description || !description.trim()) {
            return res.status(400).json({ error: "Title and description are required" });
        }

        const newProject = new Project({
            clientId: user._id,
            clientName: user.username,
            title: sanitizeInput(title),
            description: sanitizeInput(description),
            status: 'pending'
        });
        await newProject.save();
        res.json({ success: true, project: newProject });
    } catch (err) {
        console.error('Project creation error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/announcement/:id/reply', isAuthenticated, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || !text.trim()) {
            return res.status(400).json({ error: "Message cannot be empty" });
        }

        const user = await User.findById(req.session.userId);
        if (!user) return res.status(401).json({ error: "User not found" });

        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ error: "Announcement not found" });
        }

        const sanitizedText = sanitizeInput(text);
        if (!sanitizedText) {
            return res.status(400).json({ error: "Invalid message content" });
        }

        announcement.replies.push({
            username: user.username,
            text: sanitizedText,
            createdAt: new Date()
        });

        await announcement.save();
        res.json({ success: true, replies: announcement.replies });
    } catch (err) {
        console.error('Reply error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: "Missing fields" });
        }

        const mailOptions = {
            from: `"Novaa Contact Form" <${VERIFIED_SENDER_EMAIL}>`,
            to: VERIFIED_SENDER_EMAIL,
            replyTo: email,
            subject: `[Contact Form] ${subject} - from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                    <h2 style="color: #00466a;">New Contact Message</h2>
                    <p><strong>From:</strong> ${name} (${email})</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <hr>
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) return res.json({ success: false });
            res.json({ success: true });
        });

    } catch (err) {
        res.status(500).json({ success: false });
    }
});

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;