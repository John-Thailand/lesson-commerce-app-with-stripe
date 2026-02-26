import { createClient } from "../lib/supabase/server";

const LessonDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const supabase = await createClient();
  const { id: idStr } = await params;
  const id = Number(idStr);
  const { data: lesson } = await supabase.from("lesson").select("*").eq("id", id).single();
  return <div className="w-full max-w-3xl mx-auto py-16 px-8">
    <h1 className="text-3xl mb-6">{lesson?.title}</h1>
    <p className="mb-8">{lesson?.description}</p>
  </div>
};

export default LessonDetailPage;
