import IconClock from "@assets/icons/IconClock";
import IconLike from "@assets/icons/IconLike";
import IconView from "@assets/icons/IconView";
import { Video } from "@/types/recipeListTypes";
import VideoInfoRow from "./VideoInfoRow";

interface VideoInfoRowsProps {
  video: Video;
}

const VideoInfoRows = ({ video }: VideoInfoRowsProps) => {
  return (
    <div>
      <div className="w-full flex justify-around items-center gap-3">
        <VideoInfoRow IconName={IconClock} InfoData={video.duration} InfoType="TIME" />
        <VideoInfoRow IconName={IconLike} InfoData={video.like_count.toLocaleString()} InfoType="LIKE" />
        <VideoInfoRow IconName={IconView} InfoData={video.view_count.toLocaleString()} InfoType="VIEW" />
      </div>
    </div>
  );
};

export default VideoInfoRows;
