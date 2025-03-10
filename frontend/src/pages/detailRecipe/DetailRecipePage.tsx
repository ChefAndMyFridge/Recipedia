import VideoInfos from "@components/common/videoInfo/VideoInfos";
import Header from "@components/Layout/Header";

const video = {
  title:
    "부침가루에 그냥 물 넣지 마세요! 집에 있는 이걸 넣으면 2배 바삭바삭 전이 맛있어져요~! /파전, 파전 만들기, 파전 바삭하게 하는법, 부추전, 해물파전",
  url: "https://www.youtube.com/watch?v=Z2q-1zffE_8",
  description:
    "요즘 비가 많이 오는데 '전' 만한 요리가 없죠?\n오늘은 특별한 재료 필요없이 \"전을 2배 바삭바삭하게 만드는 비법\" 준비했습니다!\n이 방법만 아시면 집에 남는 채소로 얼마든지 응용 가능하니 맛있는 방법 놓치지 말고 챙겨가세요!\n\n[주재료]\n쪽파, 실파 1단 (170g)\n오징어 1마리 (기호에 맞는 재료로 대체 가능)\n청양고추 1개\n홍고추 1개\n\n[반죽물]\n부침가루 1컵\n물 2/3컵\n소주 1/3컵\n\n[양념장]\n물 1숟가락\n진간장 1숟가락\n식초 1숟가락 (양조, 환만, 현미 식초)\n설탕 반숟가락\n양파, 고추 기호에 맞게\n\n\n[핵심정리]\n1. 반죽물 핵심 : 물과 소주를 섞어 사용해주세요 / 반죽물을 너무 많이 젓지 마세요 / 반죽물을 차갑게 만들어주세요\n2. 해산물을 사용하실 때는 한번 데쳐 비린내와 물기를 잡아주세요\n3. 전을 부치기 전 반드시 키친타올을 준비해주세요\n4. 키친타올로 많이 제거되기 때문에 걱정마시고 기름을 반드시 넉넉히 넣어주세요. \n5. 남은 전은 한입크기로 썰어 냉장보관하시고 데워 드실 때는 에어프라이기에 120도 10분간 데워주세요.\n\n채널에 가입하시면 영상제작에 큰 힘이됩니다!\nhttps://www.youtube.com/channel/UCGL-5gylJg3G7T7epVBnhtQ/join",
  channel_title: "첫째아들",
  published_at: "2024-07-12T10:41:03Z",
  duration: "7:30",
  view_count: 1258308,
  like_count: 24956,
  comment_count: 683,
  relevance_score: 0.6,
};

const DetailRecipePage = () => {
  return (
    <section className="flex flex-col h-screen p-3">
      <Header title="레시피" isIcon />
      <div className="flex-1 overflow-auto relative">
        <VideoInfos video={video} />
      </div>
    </section>
  );
};

export default DetailRecipePage;
