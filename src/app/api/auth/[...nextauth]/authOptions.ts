import {
  NextAuthOptions,
  User as AuthUser,
  Session as NextAuthSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectToMongoDB } from "@/lib/db";
import { sendOtpToPhone, verifyOtpFromPhone } from "../../core";
import { AdminValues } from "@/Types/Layout";
import Admin from "@/models/Admin";

interface CustomUser extends AuthUser {
  _id: string;
  email: string;
}
interface CustomToken extends Record<string, any> {
  user?: CustomUser;
}
interface UserSession extends NextAuthSession {
  user: AdminValues;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "text" },
        password: { label: "Password", type: "password" },
        phone_number: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        await connectToMongoDB();
        try {
          console.log("Credentials received:", credentials);

          if (credentials?.phone_number && credentials?.phone_number !== "") {
            const user = await Admin.findOne({
              phone_number: credentials?.phone_number,
            });
            if (user) {
              if (!credentials?.otp) {
                // sending OTP to the user's phone number
                const verification = await sendOtpToPhone(
                  credentials.phone_number
                );
                if (verification) {
                  throw new Error("OTP_SENT");
                } else {
                  throw new Error("Failed to send OTP");
                }
              } else {
                // verifying OTP
                const isOtpValid = await verifyOtpFromPhone(
                  credentials?.phone_number,
                  credentials?.otp
                );
                if (isOtpValid) {
                  return user;
                } else {
                  throw new Error("Invalid OTP");
                }
              }
            } else {
              console.error(
                "User not found with phone number:",
                credentials?.phone_number
              );
              throw new Error("User not found");
            }
          } else if (credentials?.email !== "") {
            const user = await Admin.findOne({ email: credentials?.email });
            if (user && credentials?.password) {
              const isPasswordCorrect = await bcrypt.compare(
                credentials?.password,
                user.password
              );
              if (isPasswordCorrect) {
                return user;
              } else {
                console.error(
                  "Incorrect password for email:",
                  credentials?.email
                );
                throw new Error("Incorrect password");
              }
            } else {
              console.error(
                "User not found or password missing for email:",
                credentials?.email
              );
              throw new Error("User not found or password missing");
            }
          }
        } catch (error) {
          console.error("Authorization error:", error.message);
          throw new Error(error.message);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    // ...add more providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") return true;

      if (account?.provider === "google") {
        try {
          await connectToMongoDB();
          const adminExists = await Admin.findOne({ email: user.email });

          if (!adminExists) {
            const newUser = new Admin({
              name: user.name,
              email: user.email,
              image: user?.image,
            });
            const savedUser = await newUser.save();
            return savedUser;
          }
          return adminExists;
        } catch (error) {
          console.log("Error storing onto the db : ", error);
          return false;
        }
      }
    },
    async jwt({ token, user }) {
      if (typeof user !== "undefined") {
        token.user = user as CustomUser;
      }
      return token;
    },
    async session({ session, token }) {
      await connectToMongoDB();
      if ((token as CustomToken).user) {
        const userExists = await Admin.findOne({
          email: (token as CustomToken).user?.email,
        });
        if (userExists) {
          session.user = userExists;
        }
      }
      return session as UserSession;
    },
  },
};
