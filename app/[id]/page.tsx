import { extractYouTubeVideoId } from "@/utils/extractYoutubeVideoId";
import { createClient } from "../lib/supabase/server";
import { YouTubeEmbed } from "@next/third-parties/google";

const LessonDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const supabase = await createClient();
  const { id: idStr } = await params;
  const id = Number(idStr);
  const { data: lesson } = await supabase.from("lesson").select("*").eq("id", id).single();
  const { data: video } = await supabase.from("premium_content").select("video_url").eq("id", id).single();
  const videoId = extractYouTubeVideoId(video?.video_url) as string;

  return <div className="w-full max-w-3xl mx-auto py-16 px-8">
    <h1 className="text-3xl mb-6">{lesson?.title}</h1>
    <p className="mb-8">{lesson?.description}</p>
    <YouTubeEmbed height={400} videoid={videoId} />
  </div>
};

export default LessonDetailPage;
