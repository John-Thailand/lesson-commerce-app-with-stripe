import Link from "next/link";
import { createClient } from "./lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data: lessons } = await supabase.from("lesson").select("*");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {lessons?.map((lesson) => (
        <Link href={`/${lesson.id}`} key={lesson.id}>
          {lesson.title}
        </Link>
      ))}
    </main>
  )
}
