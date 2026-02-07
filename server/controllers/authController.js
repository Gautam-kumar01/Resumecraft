
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const { isTempMail } = require('../utils/emailValidator');
const { sendOTP } = require('../utils/mailer');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (isTempMail(email)) {
            return res.status(400).json({ message: 'Temporary email services are not allowed. Please use a valid email (e.g., Gmail).' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        const user = await User.create({
            name,
            email,
            password,
            otp,
            otpExpires,
            isVerified: false,
        });

        if (user) {
            // DEVELOPER LOG: Always log OTP to terminal in case SMTP fails
            console.log(`[AUTH] Verification code for ${email}: ${otp}`);

            if (process.env.EMAIL_USER === 'your_gmail@gmail.com') {
                return res.status(201).json({
                    message: 'Account created! (SMTP not configured, check server log for OTP)',
                    email: user.email,
                });
            }

            try {
                await sendOTP(email, otp);
                res.status(201).json({
                    message: 'Verification code sent to your email.',
                    email: user.email,
                });
            } catch (mailError) {
                console.error('Mail Error:', mailError);
                res.status(201).json({
                    message: 'Account created! However, email delivery failed. Check server terminal for your code.',
                    email: user.email,
                    mailError: true
                });
            }
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            message: 'Email verified successfully!'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        // DEVELOPER LOG: Always log OTP to terminal
        console.log(`[AUTH] New verification code for ${email}: ${otp}`);

        if (process.env.EMAIL_USER === 'your_gmail@gmail.com') {
            return res.json({ message: 'New code generated! Check server terminal for the code.' });
        }

        try {
            await sendOTP(email, otp);
            res.json({ message: 'New verification code sent' });
        } catch (mailError) {
            console.error('Mail Error:', mailError);
            res.status(200).json({
                message: 'Failed to send email, but a new code was logged to the server terminal.',
                email: user.email
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (!user.isVerified) {
                return res.status(401).json({
                    message: 'Please verify your email first',
                    notVerified: true
                });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
    const { credential } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture, sub } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8);
            user = await User.create({
                name,
                email,
                password: randomPassword,
                isVerified: true, // Google users are pre-verified
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Google authentication failed' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

module.exports = {
    registerUser,
    loginUser,
    googleLogin,
    getMe,
    verifyOTP,
    resendOTP,
};
