// data4.js (국기 맞추기 퀴즈 — 완전 안전 버전)
const isQuiz = true; // ✅ 퀴즈 모드 활성화

const topics = [
  "\uD83C\uDDF0\uD83C\uDDF7 이 국기는 어느 나라일까요?", // 🇰🇷
  "\uD83C\uDDEF\uD83C\uDDF5 이 국기는 어느 나라일까요?", // 🇯🇵
  "\uD83C\uDDE8\uD83C\uDDF3 이 국기는 어느 나라일까요?", // 🇨🇳
  "\uD83C\uDDFA\uD83C\uDDF8 이 국기는 어느 나라일까요?", // 🇺🇸
  "\uD83C\uDDEC\uD83C\uDDE7 이 국기는 어느 나라일까요?", // 🇬🇧
  "\uD83C\uDDEB\uD83C\uDDF7 이 국기는 어느 나라일까요?", // 🇫🇷
  "\uD83C\uDDE9\uD83C\uDDEA 이 국기는 어느 나라일까요?", // 🇩🇪
  "\uD83C\uDDEE\uD83C\uDDF9 이 국기는 어느 나라일까요?", // 🇮🇹
  "\uD83C\uDDEA\uD83C\uDDF8 이 국기는 어느 나라일까요?", // 🇪🇸
  "\uD83C\uDDF7\uD83C\uDDFA 이 국기는 어느 나라일까요?", // 🇷🇺
  "\uD83C\uDDE8\uD83C\uDDE6 이 국기는 어느 나라일까요?", // 🇨🇦
  "\uD83C\uDDE7\uD83C\uDDF7 이 국기는 어느 나라일까요?", // 🇧🇷
  "\uD83C\uDDF2\uD83C\uDDFD 이 국기는 어느 나라일까요?", // 🇲🇽
  "\uD83C\uDDEE\uD83C\uDDF3 이 국기는 어느 나라일까요?", // 🇮🇳
  "\uD83C\uDDF8\uD83C\uDDE6 이 국기는 어느 나라일까요?", // 🇸🇦
  "\uD83C\uDDE6\uD83C\uDDFA 이 국기는 어느 나라일까요?", // 🇦🇺
  "\uD83C\uDDF3\uD83C\uDDFF 이 국기는 어느 나라일까요?", // 🇳🇿
  "\uD83C\uDDFF\uD83C\uDDE6 이 국기는 어느 나라일까요?", // 🇿🇦
  "\uD83C\uDDF8\uD83C\uDDEA 이 국기는 어느 나라일까요?", // 🇸🇪
  "\uD83C\uDDF3\uD83C\uDDF4 이 국기는 어느 나라일까요?", // 🇳🇴
  "\uD83C\uDDE9\uD83C\uDDF0 이 국기는 어느 나라일까요?", // 🇩🇰
  "\uD83C\uDDF9\uD83C\uDDED 이 국기는 어느 나라일까요?", // 🇹🇭
  "\uD83C\uDDFB\uD83C\uDDF3 이 국기는 어느 나라일까요?", // 🇻🇳
  "\uD83C\uDDF5\uD83C\uDDED 이 국기는 어느 나라일까요?", // 🇵🇭
  "\uD83C\uDDF8\uD83C\uDDEC 이 국기는 어느 나라일까요?"  // 🇸🇬
];

const explanations = {
  "\uD83C\uDDF0\uD83C\uDDF7 이 국기는 어느 나라일까요?": "대한민국 (South Korea)",
  "\uD83C\uDDEF\uD83C\uDDF5 이 국기는 어느 나라일까요?": "일본 (Japan)",
  "\uD83C\uDDE8\uD83C\uDDF3 이 국기는 어느 나라일까요?": "중국 (China)",
  "\uD83C\uDDFA\uD83C\uDDF8 이 국기는 어느 나라일까요?": "미국 (United States)",
  "\uD83C\uDDEC\uD83C\uDDE7 이 국기는 어느 나라일까요?": "영국 (United Kingdom)",
  "\uD83C\uDDEB\uD83C\uDDF7 이 국기는 어느 나라일까요?": "프랑스 (France)",
  "\uD83C\uDDE9\uD83C\uDDEA 이 국기는 어느 나라일까요?": "독일 (Germany)",
  "\uD83C\uDDEE\uD83C\uDDF9 이 국기는 어느 나라일까요?": "이탈리아 (Italy)",
  "\uD83C\uDDEA\uD83C\uDDF8 이 국기는 어느 나라일까요?": "스페인 (Spain)",
  "\uD83C\uDDF7\uD83C\uDDFA 이 국기는 어느 나라일까요?": "러시아 (Russia)",
  "\uD83C\uDDE8\uD83C\uDDE6 이 국기는 어느 나라일까요?": "캐나다 (Canada)",
  "\uD83C\uDDE7\uD83C\uDDF7 이 국기는 어느 나라일까요?": "브라질 (Brazil)",
  "\uD83C\uDDF2\uD83C\uDDFD 이 국기는 어느 나라일까요?": "멕시코 (Mexico)",
  "\uD83C\uDDEE\uD83C\uDDF3 이 국기는 어느 나라일까요?": "인도 (India)",
  "\uD83C\uDDF8\uD83C\uDDE6 이 국기는 어느 나라일까요?": "사우디아라비아 (Saudi Arabia)",
  "\uD83C\uDDE6\uD83C\uDDFA 이 국기는 어느 나라일까요?": "호주 (Australia)",
  "\uD83C\uDDF3\uD83C\uDDFF 이 국기는 어느 나라일까요?": "뉴질랜드 (New Zealand)",
  "\uD83C\uDDFF\uD83C\uDDE6 이 국기는 어느 나라일까요?": "남아프리카공화국 (South Africa)",
  "\uD83C\uDDF8\uD83C\uDDEA 이 국기는 어느 나라일까요?": "스웨덴 (Sweden)",
  "\uD83C\uDDF3\uD83C\uDDF4 이 국기는 어느 나라일까요?": "노르웨이 (Norway)",
  "\uD83C\uDDE9\uD83C\uDDF0 이 국기는 어느 나라일까요?": "덴마크 (Denmark)",
  "\uD83C\uDDF9\uD83C\uDDED 이 국기는 어느 나라일까요?": "태국 (Thailand)",
  "\uD83C\uDDFB\uD83C\uDDF3 이 국기는 어느 나라일까요?": "베트남 (Vietnam)",
  "\uD83C\uDDF5\uD83C\uDDED 이 국기는 어느 나라일까요?": "필리핀 (Philippines)",
  "\uD83C\uDDF8\uD83C\uDDEC 이 국기는 어느 나라일까요?": "싱가포르 (Singapore)"
};
