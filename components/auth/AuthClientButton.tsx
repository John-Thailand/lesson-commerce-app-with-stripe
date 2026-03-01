"use client";

import { createClient } from "@/app/lib/supabase/client";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

const AuthClientButton = () => {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    })
  }, []);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <>
      {user ? (
        <Button onClick={handleSignOut}>ログアウト</Button>
      ) : (
        <Button onClick={(handleSignIn)}>サインイン</Button>
      )}
    </>
  );
}

export default AuthClientButton;
