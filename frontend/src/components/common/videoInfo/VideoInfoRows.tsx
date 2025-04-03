import IconClock from "@assets/icons/IconClock";
import IconLike from "@assets/icons/IconLike";
import IconView from "@assets/icons/IconView";

import VideoInfoRow from "./VideoInfoRow";

interface VideoInfoRowsProps {
  duration: string;
  likeCount: number;
  viewCount: number;
}

const VideoInfoRows = ({ duration, likeCount, viewCount }: VideoInfoRowsProps) => {
  return (
    <div>
      <div className="w-full flex justify-around items-center gap-4 text-sm">
        <VideoInfoRow IconName={IconClock} InfoData={duration} InfoType="TIME" />
        <VideoInfoRow IconName={IconLike} InfoData={likeCount.toString()} InfoType="LIKE" />
        <VideoInfoRow IconName={IconView} InfoData={viewCount.toString()} InfoType="VIEW" />
      </div>
    </div>
  );
};

export default VideoInfoRows;
