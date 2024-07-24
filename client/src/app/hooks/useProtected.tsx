import { redirect } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

interface ProtectedProps {
  children: React.ReactNode;
}

export default function UserProtected({ children }: ProtectedProps) {
  const { user } = useSelector((state: any) => state.auth);

  return user ? children : redirect("/");
 
}
