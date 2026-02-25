import React from "react";
import { createClient } from "../lib/supabase/server";

const supabase = await createClient();

const getDetailLesson = async (id: number) => {
  const { data: lesson } = await supabase.from("lesson").select("*").eq("id", id).single();
  return lesson;
};

const LessonDetailPage = async ({ params }: { params: { id: number } }) => {
  const lesson = await getDetailLesson(params.id)
  console.log(lesson)
  return <div>LessonDetailPage</div>
};

export default LessonDetailPage;
