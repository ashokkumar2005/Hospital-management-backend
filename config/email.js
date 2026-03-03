const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send email utility
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML body
 */
const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'Smart Doctor <noreply@smartdoctor.com>',
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    throw error;
  }
};

// Email Templates
const emailTemplates = {
  appointmentReminder: (patientName, doctorName, date, time) => ({
    subject: '🏥 Appointment Reminder - Smart Doctor',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1>🏥 Smart Doctor</h1>
          <p>Appointment Reminder</p>
        </div>
        <div style="padding: 30px;">
          <h2>Hello, ${patientName}!</h2>
          <p>This is a friendly reminder about your upcoming appointment.</p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>👨‍⚕️ Doctor:</strong> Dr. ${doctorName}</p>
            <p><strong>📅 Date:</strong> ${date}</p>
            <p><strong>⏰ Time:</strong> ${time}</p>
          </div>
          <p>Please be on time for your appointment. If you need to reschedule, please do so at least 24 hours in advance.</p>
          <a href="${process.env.CLIENT_URL}" style="background: #667eea; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; display: inline-block; margin-top: 10px;">View Appointment</a>
        </div>
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>Smart Doctor - Your Digital Health Partner</p>
        </div>
      </div>
    `,
  }),

  healthAlert: (patientName, condition, nextVisit) => ({
    subject: '💊 Health Alert - Time for Your Checkup',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1>💊 Health Alert</h1>
        </div>
        <div style="padding: 30px;">
          <h2>Hello, ${patientName}!</h2>
          <p>Your health reminder is here.</p>
          <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>🏥 Condition:</strong> ${condition}</p>
            <p><strong>📅 Next Visit Due:</strong> ${nextVisit}</p>
          </div>
          <p>It's time to schedule your next medical visit. Early checkups help prevent complications.</p>
          <a href="${process.env.CLIENT_URL}/appointments/book" style="background: #f5576c; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; display: inline-block; margin-top: 10px;">Book Appointment</a>
        </div>
      </div>
    `,
  }),

  welcome: (name, role) => ({
    subject: '🎉 Welcome to Smart Doctor!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1>🏥 Smart Doctor</h1>
          <p>Your Digital Health Partner</p>
        </div>
        <div style="padding: 30px;">
          <h2>Welcome, ${name}!</h2>
          <p>Your account has been successfully created as a <strong>${role}</strong>.</p>
          <p>You can now access all features of Smart Doctor including:</p>
          <ul>
            <li>📅 Book Appointments</li>
            <li>🗺️ Find Nearby Hospitals</li>
            <li>📋 Manage Health Records</li>
            <li>💻 Video Consultations</li>
            <li>🚨 Emergency SOS</li>
          </ul>
          <a href="${process.env.CLIENT_URL}/login" style="background: #4facfe; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; display: inline-block; margin-top: 10px;">Login Now</a>
        </div>
      </div>
    `,
  }),
};

module.exports = { sendEmail, emailTemplates };
