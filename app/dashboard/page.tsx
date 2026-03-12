import { Database } from "@/lib/database.types";
import { SupabaseClient } from "@supabase/supabase-js";
import React from "react";
import { createClient } from "../lib/supabase/client";
import { useRouter } from "next/router";

const getProfileData = async (supabase: SupabaseClient<Database>) => {
  const { data: lesson } = await supabase.from("profile").select("*").single();
  return lesson;
}

const Dashboard = async () => {
  const supabase = await createClient();
  const profile = await getProfileData(supabase);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  const loadPortal = async () => {
    const response = await fetch("http://localhost:3000/api/portal");
    const data = await response.json();

    router.push(data.url)
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-16 px-8">
      <h1 className="text-3xl mb-6">ユーザー管理ダッシュボード</h1>
      <div>
        <div>
          {profile?.is_subscribed ? `プラン契約中: ${profile.interval}` : 'プラン未加入' }
        </div>
        <button onClick={loadPortal}>サブスクリプション管理</button>
      </div>
    </div>
  );
};

export default Dashboard;
