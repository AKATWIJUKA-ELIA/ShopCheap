"use client"
import { useEffect } from "react";
import useLogout from "@/hooks/useLogout";

export default function SessionChecker() {
          const logout = useLogout();
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/checksession", { cache: "no-store" });
        const data = await res.json();

        if (!data.valid) {
        //   console.log("Session invalid. Clearing localStorage.");
          logout();
          // Optionally redirect to login page
          window.location.href = "/sign-in";
        }
        
      } catch  {
        // console.error("Error checking session validity", error);
        logout();
        window.location.href = "/sign-in"; // Redirect on error
      }
    };

    checkSession();
  }, []);

  return null; // It's just a checker component
}
