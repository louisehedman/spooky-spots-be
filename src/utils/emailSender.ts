import nodemailer from "nodemailer";

interface Options {
  to: string;
  subject: string;
  text: string;
}

export const sendEmail = async (options: Options) => {
  // Create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    tls: {
      ciphers: "SSLv3",
    },
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Send email with defined transport object
  let mailOptions = {
    from: `"SpookySpots" <${process.env.EMAIL_FROM}>`, // Sender address
    to: options.to,
    subject: options.subject,
    html: options.text,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};
