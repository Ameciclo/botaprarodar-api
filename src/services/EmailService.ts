import nodemailer from "nodemailer";

export default class EmailService {
  public static sendEmail = async (
    receivers: string[],
    subject: string,
    htmlBody: string
  ): Promise<void> => {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_ACCOUNT_SMTP,
        pass: process.env.PASSWORD_ACCOUNT_SMTP,
      },
    });

    await transporter.sendMail({
      from: `"Bota pra Rodar - Ameciclo" <${process.env.EMAIL_ACCOUNT_SMTP}>`,
      to: receivers.join(", "),
      subject,
      html: htmlBody,
    });
  };
}
