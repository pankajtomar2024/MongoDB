import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const sendMail = async (options) => {
  console.log(`enter send mil util`);
  const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
  const __dirname = path.dirname(__filename); // get the name of the directory
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const { email, subject, template, html, data } = options;

  // get the path to template
  const templatePath = path.join(__dirname, "../mail/", template);

  // render the template
  const htmlData = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: process.env.SMTP_USERNAME,
    to: email,
    subject: subject,
    html: html,
  };

  console.log(`Sending mail :: ${mailOptions.to}`);

  // send the mail
  const mailResponse = await transporter.sendMail(mailOptions);
  console.log(`Mail response :: ${mailResponse}`);
  console.log(`sent mail success`);
};

export default sendMail;
