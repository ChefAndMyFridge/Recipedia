import React from "react";

interface VideoInfoProps {
  IconName: React.ElementType;
  InfoData: string;
  InfoType: string;
}

const VideoInfo = ({ IconName, InfoData, InfoType }: VideoInfoProps) => {
  return (
    <div className="flex flex-col gap-1 justify-center items-center text-sm">
      <IconName width={45} height={45} strokeColor="black" />
      <p className="font-preBold">{InfoData}</p>
      <p className="font-preRegular">{InfoType}</p>
    </div>
  );
};

export default VideoInfo;
