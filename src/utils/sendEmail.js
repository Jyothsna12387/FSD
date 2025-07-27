// import dotenv from 'dotenv';
// dotenv.config();

// import nodemailer from 'nodemailer';

// if (!process.env.EMAIL_FROM || !process.env.EMAIL_PASSWORD) {
//   console.error("❌ EMAIL_FROM or EMAIL_PASSWORD is missing from .env");
// }

// const sendEmail = async ({ to, subject, message }) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com',
//       port: 587,
//       secure: false,
//       auth: {
//         user: process.env.EMAIL_FROM,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     await transporter.verify();
//     console.log('✅ Transporter verified');

//     const mailOptions = {
//       from: `"HostelBuddy" <${process.env.EMAIL_FROM}>`,
//       to,
//       subject,
//       html: `<p>${message}</p>`,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log('✅ Email sent successfully to:', to);
//   } catch (error) {
//     console.error('❌ Error sending email:', error);
//     throw new Error('Email could not be sent');
//   }
// };

// export default sendEmail;

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// if (!process.env.EMAIL_FROM || !process.env.EMAIL_PASSWORD) {
//   throw new Error("❌ EMAIL_FROM or EMAIL_PASSWORD is missing from .env");
// }

const sendEmail = async ({ to, subject, message }) => {
  try {
     const transporter = nodemailer.createTransport({
     host: 'smtp.gmail.com',
     port: 587,
    secure: false, // use TLS
    auth: {
       user: process.env.EMAIL_FROM,
       pass: process.env.EMAIL_PASSWORD
   }
  });

    await transporter.verify();
    console.log('✅ Transporter verified');

    const mailOptions = {
      from: `"HostelBuddy" <${process.env.EMAIL_FROM}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      text: message,
      html: `<p>${message}</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', to);
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    throw new Error('Email could not be sent');
  }
};

export default sendEmail;
