import "dotenv/config";
import nodemailer from "nodemailer";
import fs from "fs";

function sendResetEmail(resetLink, userEmail) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Recuperacao de senha",
    html: getEmailTemplate(resetLink),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Erro ao enviar email:", error);
    } else {
      console.log("Email enviado:", info.response);
    }
  });
}

const getEmailTemplate = (resetLink) => {
  const htmlTemplate = fs.readFileSync("./src/templates/changePassword.html", "utf-8");
  return htmlTemplate.replace("{{resetLink}}", resetLink);
};

export { sendResetEmail };
