// utils/sendEmail.js
import nodemailer from "nodemailer";
import { EMAIL_PASS, EMAIL_USER } from "../configs/config.js";

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER, // your gmail address
      pass: EMAIL_PASS, // app password
    },
  });

  await transporter.sendMail({
    from: `"Login Authentication" <${EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;
