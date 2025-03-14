import React from "react";

interface VideoInfoRowProps {
  IconName: React.ElementType;
  InfoData: string;
  InfoType: string;
}

const VideoInfoRow = ({ IconName, InfoData, InfoType }: VideoInfoRowProps) => {
  return (
    <div className="flex flex gap-1 justify-center items-center text-sm">
      <IconName width={25} height={25} strokeColor="black" />
      <p className="font-preBold">{InfoData}</p>
      <p className="font-preRegular">{InfoType}</p>
    </div>
  );
};

export default VideoInfoRow;
