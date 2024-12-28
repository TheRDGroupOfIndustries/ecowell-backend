import { getServerSession } from "next-auth";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { connectToMongoDB } from "@/lib/db";
import { ToastContainer } from "react-toastify";
import MainProvider from "@/MainProvider";
import "../index.scss";
import AuthProvider from "@/lib/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EcoWell - Admin",
  description: "Get Yourself some protines",
  icons: { icon: "/logo.webp" },
  keywords: "protine, protines, healthy protines, suppliments",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  await connectToMongoDB();
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href={`../../assets/images/logo/favicon.png`}
          type="image/x-icon"
        />
        <link
          rel="shortcut icon"
          href={`../../assets/images/dashboard/favicon.png`}
          type="image/x-icon"
        />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,500;1,600;1,700;1,800;1,900&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider session={session}>
          <MainProvider>{children}</MainProvider>
        </AuthProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
