import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToMongoDB } from "@/lib/db";
import Admin from "@/models/Admin";
import { sendOtpToPhone, transporter, verifyOtpFromPhone } from "../../core";

export const POST = async (request: NextRequest) => {
  const { name, email, password, phone_number, isEmail, otp, checkOtpCode } =
    await request.json();

  // console.log(name, email, phone_number, isEmail, password, otp, checkOtpCode);

  await connectToMongoDB();

  if (isEmail) {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return new NextResponse("Admin already exists!", { status: 400 });
    }
  } else {
    const existingAdmin = await Admin.findOne({ phone_number });
    if (existingAdmin) {
      return new NextResponse("Admin already exists!", { status: 400 });
    }
  }

  let otpCode = checkOtpCode || "";

  if (!otp) {
    console.log("sending otp");

    if (isEmail) {
      otpCode = Math.floor(100000 + Math.random() * 9000);
      const body = `<h1 style="color: #333; font-family: 'Arial', sans-serif;">Heya ${name}!!</h1>
    <span style="color: #ccc; font-size: 18px; font-family: 'Arial', sans-serif;">Here's an OTP for your email verification <b style="color: #2fff00;">${otpCode}</b><br /></span>`;

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: "EcoWell - Verify Email",
        text: "Email Verification",
        html: body,
      });

      return new NextResponse(JSON.stringify(otpCode), {
        status: 201,
        //   message: "Otp has been sent to your email for verification.",
      });
    } else {
      try {
        // send otp to phone number
        const verification = await sendOtpToPhone(phone_number);

        if (verification) {
          return new NextResponse(JSON.stringify(otpCode), {
            status: 201,
          });
        }
      } catch (error) {
        return new NextResponse("Internal Server Error : " + error, {
          status: 500,
        });
      }
    }
  }

  // console.log(otp, " -> ", checkOtpCode);

  if (otp) {
    let newAdmin;
    if (isEmail && otp == checkOtpCode) {
      const body = `<h1 style="color: #333; font-family: 'Arial', sans-serif;">Heya ${name}!!</h1>
    <span style="color: #ccc; font-size: 18px; font-family: 'Arial', sans-serif;">Here's your credentials to login as Admin:</span>
    <p style="color: #2fff00; font-size: 18px; font-family: 'Arial', sans-serif;">Email: <b style="color: #333;">${email}</b></p>
    <p style="color: #2fff00; font-size: 18px; font-family: 'Arial', sans-serif;'>Password: <b style="color: #333;">${password}</b></p>`;

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: "EcoWell - Admin credentials",
        text: "Admin login credentials",
        html: body,
      });

      const hashPassword = await bcrypt.hash(password, 5); // converting password into hash-code

      newAdmin = new Admin({
        name,
        email,
        password: hashPassword,
      });
    } else {
      const isOtpValid = await verifyOtpFromPhone(phone_number, otp);

      if (isOtpValid) {
        // send admin credentials through SmS

        newAdmin = new Admin({
          name,
          phone_number,
        });
      }
    }

    try {
      await newAdmin.save();
      return new NextResponse("Admin Registered successfully!", {
        status: 200,
      });
    } catch (error) {
      return new NextResponse("Internal Server Error : " + error, {
        status: 500,
      });
    }
  }
  return new NextResponse("Internal Server Error!", { status: 500 });
};
