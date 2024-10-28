import nodemailer from 'nodemailer'


const sendEmail = async(email, subject, message)=>{
// Create transporter with your email service provider’s SMTP settings
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'mabel.rowe@ethereal.email',
        pass: 'r4e8zYhFh8HbftBF7s'
    }
});

// Send the email
 transporter.sendMail({
  from: 'hannan@gmail.com', // Sender address
  to: email, // List of recipients
  subject: subject, // Subject line
  html: message, 
  // html: '<p>This is a test email sent using <strong>Nodemailer</strong>!</p>' // HTML body (optional)
 });

}

export default sendEmail