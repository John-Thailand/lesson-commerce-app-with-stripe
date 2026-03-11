import Link from "next/link";
import { Button } from "./ui/button"
import AuthClientButton from "./auth/AuthClientButton";
import { createClient } from "@/app/lib/supabase/client";

const Header = async () => {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getSession();

  return (
    <div className="flex py-4 px-6 border-b border-gray-200">
      <Link href={"/"}>
        <Button variant={"outline"}>ホーム</Button>
      </Link>
      {user.session && (
        <Link href={"/dashboard"} className="ml-4">
          <Button variant={"outline"}>ダッシュボード</Button>
        </Link>
      )}
      <Link href={"/pricing"} className="ml-4">
        <Button variant={"outline"}>価格</Button>
      </Link>
      <div className="ml-auto">
        <AuthClientButton />
      </div>
    </div>
  );
}

export default Header;
