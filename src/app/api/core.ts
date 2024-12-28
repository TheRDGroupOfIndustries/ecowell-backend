import nodemailer from "nodemailer";
import twilio from "twilio";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioServiceSid = process.env.TWILIO_SERVICE_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(twilioAccountSid, twilioAuthToken);

export const sendOtpToPhone = async (phone_number: string) => {
  if (!twilioAccountSid || !twilioAuthToken || !twilioServiceSid) {
    throw new Error("Missing Twilio environment variables");
  }
  let extendedPhone = "+91" + phone_number;
  console.log("sending otp to", extendedPhone);

  const verification = await client.verify.v2
    .services(twilioServiceSid)
    .verifications.create({ to: extendedPhone, channel: "sms" });

  if (verification.status === "pending") return true;
  return false;
};

export const verifyOtpFromPhone = async (phone_number: string, otp: string) => {
  if (!twilioAccountSid || !twilioAuthToken || !twilioServiceSid) {
    throw new Error("Missing Twilio environment variables");
  }
  let extendedPhone = "+91" + phone_number;
  console.log("verifying otp from", extendedPhone);
  // verify OTP
  const verificationCheck = await client.verify.v2
    .services(twilioServiceSid)
    .verificationChecks.create({ to: extendedPhone, code: otp });

  if (verificationCheck.status === "approved") return true;
  return false;
};
