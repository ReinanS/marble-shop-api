import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { EMAIL_AUTH_PASS, EMAIL_AUTH_USER, EMAIL_SERVICE, SMTP_HOST, SMTP_PORT } from "../helpers";
import { EmailSendError } from "../helpers/errors/email-send.error";

const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true,
  auth: {
    user: EMAIL_AUTH_USER,
    pass: EMAIL_AUTH_PASS,
  },
});

export async function sendMail(options: Mail.Options) {
  try {
    const info = await transporter.sendMail(options);

    if (process.env.ENVIRONMENT !== "production") {
      console.log("Mail URL: %s", nodemailer.getTestMessageUrl(info));
    }

  } catch (error) {
    if (error instanceof Error) {
      throw new EmailSendError(options.to as string, error.message);
    }
    
    throw new EmailSendError(options.to as string, "Unknown error");
  }
}