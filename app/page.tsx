import Link from "next/link";
import { createClient } from "./lib/supabase/server";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Home() {
  const supabase = await createClient();

  const { data: lessons } = await supabase.from("lesson").select("*");

  return (
    <main className="w-full max-w-3xl mx-auto my-16 px-2">
      <div className="flex flex-col gap-3">
        {lessons?.map((lesson) => (
          <Link href={`/${lesson.id}`} key={lesson.id}>
            <Card>
              <CardHeader>
                <CardTitle>{lesson.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{lesson.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}
