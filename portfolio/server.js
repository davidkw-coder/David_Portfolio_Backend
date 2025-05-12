const express = require("express")
const nodemailer = require("nodemailer")
const cors = require("cors")
require("dotenv").config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "kidcoderman@gmail.com", // replace with your email
    pass: process.env.EMAIL_PASS || "@bestonekw1", // replace with your password or app password
  },
})

// Contact form endpoint
app.post("/submit", async (req, res) => {
  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Please fill all fields" })
  }

  const mailOptions = {
    from: process.env.EMAIL_USER || "your-email@gmail.com",
    to: process.env.RECIPIENT_EMAIL || "your-email@gmail.com", // where you want to receive emails
    subject: "New Contact Form Submission",
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    res.status(200).json({ message: "Email sent successfully" })
  } catch (error) {
    console.error("Email Error:", error)
    res.status(500).json({ error: "Failed to send email", details: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
