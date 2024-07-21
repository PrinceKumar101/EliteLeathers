const nodemailer = require("nodemailer");

module.exports.info = (name, email, token) => {
  try {
    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: "gamil",
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Password Reset for ${email}`,
      html: `Hi ${name},<br><br>Copy this link to reset your password: <a href="http://localhost:3000/set-new-password?token=${token}">Reset Password</a>`,
    };

    // Send email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        req.flash("message", error.message);
      } else {
        req.flash("sucess_message" , "Email sent sucessfully. Check inbox");
      }
    });
  } catch (err) {
    console.error("Error sending email:", err.message);
  }
};
