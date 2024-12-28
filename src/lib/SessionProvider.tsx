"use client";

import React from "react";
import { SessionProvider, SessionProviderProps } from "next-auth/react";

interface AuthProviderProps extends SessionProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children, session }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default AuthProvider;
