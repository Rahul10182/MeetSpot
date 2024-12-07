import nodemailer from "nodemailer"
import Mail from "../models/mailModel.js"

export const sendReminder = async (req, res) => {
  const {emailData} = req.body;
  console.log(emailData);

  const userEmail = emailData.userEmail;
  const friendEmail =emailData.friendEmail;
  const venueName = emailData.venueName;

  const meetingTime = emailData.meetingTime;
  

  console.log(userEmail);
  console.log(friendEmail);
  console.log(venueName);
  console.log(meetingTime);

  if (!userEmail || !friendEmail || !venueName || !meetingTime) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    // Configure Nodemailer
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      secure: false,
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: [userEmail, friendEmail],
      subject: 'Meeting Reminder',
      text: `Hello,

This is a reminder for your meeting at ${venueName} on ${new Date(meetingTime).toLocaleString()}.

Please leave 30 minutes earlier to reach on time.

Best regards,
Meeting Scheduler App`,
    };
    console.log(mailOptions);
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reminder email sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send reminder email.' });
  }
};

export const getAllMeetings = async (req, res) => {
  try {
    const meetings = await Mail.find();
    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meetings' });
  }
};

export const sendMail = async (req, res) => {
  // Extract the email data from the request body
  const { from, to, subject, body } = req.body;

  console.log(from);
  console.log(to)
  console.log(subject)
  console.log(body)
  if (!from || !to || !subject || !body) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Configure the nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Or another email service like Outlook, Yahoo
    host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      secure: false,
  });

  // Configure the email options
  const mailOptions = {
    from: `"${from}" <${process.env.MAIL_USER}>`, // Sender's name and email
    to, // Recipient email
    subject, // Email subject
    text: body, // Email body
  };

  try {
    // Send the email using nodemailer
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
};

