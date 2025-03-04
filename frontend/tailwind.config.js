/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      pre: ['Pretendard'],
    },
    theme: {
      screens: {
        'xs': '412px',         // 커스텀 브레이크포인트: 412px 이상일 때 적용
        'max-xs': { 'max': '350px' }, // 커스텀 브레이크포인트: 350px 이하일 때 적용
      },
    },
    extend: {},
  },
  plugins: [],
};
