import IconClock from "@assets/icons/IconClock";
import IconLike from "@assets/icons/IconLike";
import IconView from "@assets/icons/IconView";
import VideoInfo from "@components/common/videoInfo/VideoInfo";
import { Video } from "@/types/recipeListTypes";

interface VideoInfosProps {
  video: Video;
}

const VideoInfos = ({ video }: VideoInfosProps) => {
  return (
    <div className="w-full flex justify-around items-center">
      <VideoInfo IconName={IconClock} InfoData={video.duration} InfoType="TIME" />
      <VideoInfo IconName={IconLike} InfoData={video.like_count.toString()} InfoType="LIKE" />
      <VideoInfo IconName={IconView} InfoData={video.view_count.toString()} InfoType="VIEW" />
    </div>
  );
};

export default VideoInfos;
