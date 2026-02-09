
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const { isTempMail, isGmail } = require('../utils/emailValidator');
const { sendOTP, sendResetCode } = require('../utils/mailer');

const client = process.env.GOOGLE_CLIENT_ID
    ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    : null;

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
        if (!isGmail(email)) {
            return res.status(400).json({ message: 'Invalid email. Only @gmail.com addresses are supported for verification.' });
        }

        if (isTempMail(email)) {
            return res.status(400).json({ message: 'Temporary email services are not allowed. Please use a valid email (e.g., Gmail).' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
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
        console.error('Registration Error:', error);
        res.status(500).json({ message: error.message || 'Server error during registration' });
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
                // Generate new OTP for unverified login attempt
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                user.otp = otp;
                user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
                await user.save();

                console.log(`[AUTH] Login verification code for ${email}: ${otp}`);

                try {
                    await sendOTP(email, otp);
                } catch (mailError) {
                    console.error('Mail Error:', mailError);
                }

                return res.status(401).json({
                    message: 'Verification code sent to your email. Please verify.',
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

    if (!client) {
        return res.status(500).json({ message: 'Google Auth is not configured on the server.' });
    }

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

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found with this email' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        console.log(`[AUTH] Reset code for ${email}: ${otp}`);

        if (process.env.EMAIL_USER === 'your_gmail@gmail.com' || !process.env.EMAIL_USER) {
            return res.status(200).json({
                message: 'Reset code generated (Check server logs)',
                email: user.email,
                debug_otp: otp // Only for dev
            });
        }

        try {
            await sendResetCode(email, otp);
            res.status(200).json({
                message: 'Password reset code sent to your email.',
                email: user.email,
            });
        } catch (mailError) {
            console.error('Mail Error:', mailError);
            res.status(200).json({
                message: 'Code generated but email failed. Check server logs.',
                email: user.email,
                mailError: true
            });
        }
    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({
            email,
            otp,
            otpExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid code or code expired' });
        }

        user.password = newPassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful. You can now login.' });
    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    googleLogin,
    getMe,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
};
