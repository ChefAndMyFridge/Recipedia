import { RecipeInfo } from "@/types/recipeListTypes";

const DETAIL_RECIPE: RecipeInfo = {
  title: "불고기 1인분",
  cooking_info: {
    cooking_time: "15분",
    kcal: 400,
  },
  ingredients: [
    {
      name: "소고기",
      quantity: "500g",
    },
    {
      name: "대파",
      quantity: "1대",
    },
    {
      name: "양파",
      quantity: "1개",
    },
    {
      name: "표고버섯",
      quantity: "2개",
    },
    {
      name: "홍고추",
      quantity: "1개",
    },
    {
      name: "다진 마늘",
      quantity: "1큰술(20g)",
    },
    {
      name: "간장",
      quantity: "5큰술(50g)",
    },
    {
      name: "설탕",
      quantity: "2 1/2큰술(30g)",
    },
    {
      name: "물엿",
      quantity: "1큰술(12g)",
    },
    {
      name: "참기름",
      quantity: "3큰술(21g)",
    },
    {
      name: "후추",
      quantity: "약간",
    },
    {
      name: "깨소금",
      quantity: "약간",
    },
  ],
  cooking_tips: [
    "설탕을 먼저 넣어 고기 입자에 간이 잘 배게 합니다.",
    "얇게 썬 고기를 사용하면 양념이 잘 배어 맛이 좋습니다.",
    "참기름을 마지막에 넣어 향을 살립니다.",
  ],
  cooking_sequence: {
    "재료 손질": {
      sequence: [
        "소고기는 얇게 썰어 준비합니다.",
        "대파는 어슷썰기, 양파는 채썰기, 표고버섯은 얇게 썰어 준비합니다.",
        "홍고추는 어슷썰기 합니다.",
      ],
      timestamp: 0,
    },
    "고기 양념하기": {
      sequence: [
        "소고기에 설탕(2 1/2큰술)과 물엿(1큰술)을 넣고 가볍게 섞어줍니다.",
        "다진 마늘(1큰술)을 넣고 섞어줍니다.",
      ],
      timestamp: 246,
    },
    "야채 준비하기": {
      sequence: ["표고버섯의 기둥을 제거하고 얇게 썰어줍니다.", "대파와 홍고추를 어슷썰기 합니다."],
      timestamp: 307,
    },
    "양념 추가하기": {
      sequence: ["간장(5큰술)을 고기에 넣고 섞어줍니다.", "양파를 넣고 가볍게 섞어줍니다."],
      timestamp: 385,
    },
    "볶기 및 마무리": {
      sequence: [
        "팬에 기름을 두르지 않고 고기를 볶습니다.",
        "야채를 추가하고 함께 볶아줍니다.",
        "참기름(3큰술)을 넣고 마무리합니다.",
      ],
      timestamp: 462,
    },
    "완성 및 서빙": {
      sequence: ["완성된 불고기를 접시에 담고 깨소금을 뿌려 서빙합니다."],
      timestamp: 565,
    },
  },
};

export default DETAIL_RECIPE;
