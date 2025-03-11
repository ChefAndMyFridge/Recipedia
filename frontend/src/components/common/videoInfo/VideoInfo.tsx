import React from "react";

interface VideoInfoProps {
  IconName: React.ElementType;
  InfoData: string;
  InfoType: string;
}

const VideoInfo = ({ IconName, InfoData, InfoType }: VideoInfoProps) => {
  return (
    <div className="flex flex-col gap-1 justify-center items-center text-sm">
      <IconName width={35} height={35} strokeColor="black" />
      <p className="font-preBold">{InfoData}</p>
      <p className="font-preRegular text-xs">{InfoType}</p>
    </div>
  );
};

export default VideoInfo;
