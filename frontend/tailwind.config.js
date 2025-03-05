/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    center: true,
    screens: {
      mobile: "344px", // mobile(344px) 이상
    },
    fontFamily: {
      preLight: ["Pretendard-Light"],
      preRegular: ["Pretendard-Regular"],
      preMedium: ["Pretendard-Medium"],
      preSemiBold: ["Pretendard-SemiBold"],
      preBold: ["Pretendard-Bold"],
      preExtraBold: ["Pretendard-ExtraBold"],
    },
    extend: {
      colors: {
        white: "#FFFFFF",
        offWhite: "#FAF9F6",
        title: "#202020",
        longContent: "#3C3C3C",
        content: "#828282",
        content2: "#9D9D9D",
        subContent: "#DDDDDD",
        primaryLight: "#3E91FF",
        primary: "#0381FE",
        primaryDark: "#0072DE",
        error: "#D44848",
      },
    },
  },
  plugins: [],
};
