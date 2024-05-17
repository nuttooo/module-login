import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER as string, // your Gmail address
      pass: process.env.EMAIL_PASS as string, // your Gmail password or App Password
    },
  });

  const info = await transporter.sendMail({
    from:  process.env.EMAIL_FROM as string, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    html: html, // plain text body
  })

  console.log('Message sent: %s', info.messageId)
}
