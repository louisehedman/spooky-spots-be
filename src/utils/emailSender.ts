import nodemailer from "nodemailer";

export interface Options {
  to: string;
  subject: string;
  text: string;
}

export const sendEmail = async (options: Options) => {
  // Create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.AWS_REGION,
    port: Number(process.env.EMAIL_PORT),
    /* Makes email get cryptated by TLS,
    in received email header you can see it got cryptated*/
    secure: true,
    pool: true, // enable sending several emails at once
    maxConnections: 20, // number of simultaneous connections against SMTP server
    maxMessages: Infinity, // maximum numbers of emails that can be sent at once
    auth: {
      user: process.env.AWS_ACCESS_KEY_ID,
      pass: process.env.AWS_SECRET_ACCESS_KEY,
    },
    debug: true,
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
    transporter.close();
  });
};
