
const nodemailer = require('nodemailer');

const sendOTP = async (email, otp) => {
    try {
        // Create transporter using Gmail or other service
        // USER: You must set EMAIL_USER and EMAIL_PASS in your server/.env
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Verify connection configuration
        await new Promise((resolve, reject) => {
            transporter.verify(function (error, success) {
                if (error) {
                    console.log('[MAIL] Transporter verification failed:', error);
                    reject(error);
                } else {
                    console.log('[MAIL] Server is ready to take our messages');
                    resolve(success);
                }
            });
        });

        console.log('---------------------------------------------------');
        console.log('[MAIL DEBUG] Preparing to send email');
        console.log(`[MAIL DEBUG] FROM (Sender): ${process.env.EMAIL_USER}`);
        console.log(`[MAIL DEBUG] TO (Recipient): ${email}`);
        console.log('---------------------------------------------------');

        const mailOptions = {
            from: {
                name: 'ResumeCraft Support',
                address: process.env.EMAIL_USER
            },
            to: email,
            replyTo: process.env.EMAIL_USER,
            subject: 'Verify Your ResumeCraft Account',
            html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #6366f1; text-align: center;">Welcome to ResumeCraft</h2>
                <p>Hello,</p>
                <p>Thank you for signing up. Please use the following code to verify your email address:</p>
                <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 10px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e293b;">
                    ${otp}
                </div>
                <p style="color: #64748b; font-size: 14px; margin-top: 20px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="text-align: center; color: #94a3b8; font-size: 12px;">© 2026 ResumeCraft. Build your future.</p>
            </div>
        `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('[MAIL] Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('[MAIL] Error sending email:', error);
        throw error;
    }
};

module.exports = { sendOTP };
