// ============================
// 기존 변수들 그대로 유지
// ============================
const grid = document.getElementById("cardGrid");
const explainBox = document.getElementById("explainBox");
const resultBox = document.getElementById("resultBox");
const toggleBtn = document.getElementById("toggleExplainBtn");
const explainContent = document.getElementById("explainContent");

if (typeof itemList === "undefined") {
  console.warn("⚠️ itemList가 없습니다. item.js를 먼저 불러오세요.");
}

let teamCount = 3;
let gameMode = "normal";
let topicsLoaded = false;
let teamData = []; // 🔹 새로 추가

const teamColors = [
  { name: "A", bg: "#bbdefb", border: "#2196f3" },
  { name: "B", bg: "#ffcdd2", border: "#e53935" },
  { name: "C", bg: "#c8e6c9", border: "#43a047" },
  { name: "D", bg: "#ffe0b2", border: "#fb8c00" },
];

// ============================
// ✅ 주제 선택/모드 선택 기존 로직 그대로
// ============================
function selectDataset(file, title) {
  document.getElementById("setupScreen").style.display = "none";
  const modeScreen = document.getElementById("modeScreen");
  modeScreen.style.display = "block";
  modeScreen.dataset.datasetFile = file;
  modeScreen.dataset.datasetTitle = title;
}

function setGameMode(mode) {
  gameMode = mode;
  const modeScreen = document.getElementById("modeScreen");
  const file = modeScreen.dataset.datasetFile;
  const title = modeScreen.dataset.datasetTitle;
  modeScreen.style.display = "none";

  const titleEl = document.getElementById("gameTitle");
  titleEl.textContent = `🃏 ${title} 빙고 게임 (${mode === "item" ? "아이템전 🎁" : "노아이템전 🚫"})`;
  titleEl.style.display = "block";

  const script = document.createElement("script");
  script.src = file;
  script.onload = () => {
    topicsLoaded = true;
    setTimeout(() => initGame(), 300);
  };
  document.body.appendChild(script);
}

// ============================
// ✅ 팀 분배 기능 추가
// ============================
function initGame() {
  const input = prompt("팀 수를 입력하세요 (2~4)", "3");
  const n = parseInt(input);
  if (n >= 2 && n <= 4) teamCount = n;
  else alert("잘못된 입력입니다. 기본 3팀으로 설정됩니다.");

  showTeamSetupPanel(); // 🔹 기존 빙고 이전 단계로 팀 배정 화면 추가
}

function showTeamSetupPanel() {
  const total = parseInt(prompt("총 인원을 입력하세요", "10"));
  if (!total || total < 1) return alert("올바른 인원을 입력하세요.");

  const distribution = calcTeamDistribution(total, teamCount);

  // 기존 패널 제거
  const old = document.getElementById("teamPanel");
  if (old) old.remove();

  const panel = document.createElement("div");
  panel.id = "teamPanel";
  panel.classList.add("team-panel");

  // ✅ 빙고판 옆의 right-wrapper 안에 추가
  const rightWrapper = document.querySelector(".right-wrapper");
  if (!rightWrapper) {
    alert("오른쪽 영역(.right-wrapper)을 찾을 수 없습니다. HTML 구조를 확인하세요.");
    return;
  }

  // 🔹 빙고판/팀패널 화면 보이게 하기
  const gameContainer = document.querySelector(".game-container");
  gameContainer.style.display = "flex";

  rightWrapper.prepend(panel);

  // ✅ 설명/결과 박스도 함께 표시
  const explainBox = document.getElementById("explainBox");
  const resultBox = document.getElementById("resultBox");
  explainBox.style.display = "block";
  resultBox.style.display = "block";

  panel.innerHTML = `
    <h3>👥 팀 구성</h3>
    <div class="team-list"></div>
    <div class="input-area">
      <input id="studentName" type="text" placeholder="이름 입력">
      <button id="addStudent">추가</button>
    </div>
    <div class="action-buttons">
      <button id="resetGameBtn" class="reset-btn">초기화 🔄</button>
      <button id="startGameBtn" class="start-btn">빙고 시작 ▶</button>
    </div>
  `;

  const list = panel.querySelector(".team-list");
  list.style.gridTemplateColumns = `repeat(${teamCount}, 1fr)`;

  teamData = teamColors.slice(0, teamCount).map((t, i) => ({
    ...t, limit: distribution[i], members: []
  }));

  teamData.forEach((t) => {
    const div = document.createElement("div");
    div.className = "team-col";
    div.innerHTML = `
      <div class="team-header" style="background:${t.bg}; border-color:${t.border}">
        ${t.name}팀 (${t.limit}명)
      </div>
      <ul id="team-${t.name}"></ul>
    `;
    list.appendChild(div);
  });

  document.getElementById("addStudent").addEventListener("click", () => {
    const name = document.getElementById("studentName").value.trim();
    if (!name) return alert("이름을 입력하세요.");
    assignRandomTeam(name);
    document.getElementById("studentName").value = "";
  });

  document.getElementById("startGameBtn").addEventListener("click", () => {
    startBingoGame();
  });

  document.getElementById("resetGameBtn").addEventListener("click", () => {
    location.reload(); // 완전 초기화 (주제 선택 화면으로 복귀)
  });
}



function calcTeamDistribution(total, teamCount) {
  const base = Math.floor(total / teamCount);
  const remainder = total % teamCount;
  const arr = Array(teamCount).fill(base);
  for (let i = 0; i < remainder; i++) arr[i]++;
  return arr;
}

function assignRandomTeam(name) {
  const available = teamData.filter(t => t.members.length < t.limit);
  if (!available.length) return alert("모든 팀이 가득 찼습니다!");
  const team = available[Math.floor(Math.random() * available.length)];
  team.members.push(name);

  const ul = document.getElementById(`team-${team.name}`);
  const li = document.createElement("li");
  li.textContent = name;
  ul.appendChild(li);
}

function startBingoGame() {
  document.getElementById("cardGrid").style.display = "grid";
  explainBox.style.display = "block";
  resultBox.style.display = "block";
  createCards();
}

// ✅ 카드 생성
function createCards() {
    grid.innerHTML = "";
    const shuffled = topics.sort(() => Math.random() - 0.5).slice(0, 25);

    // 🔹 아이템전일 경우, 25개 중 랜덤 6개 카드에 아이템 부여
    let itemCards = [];
    if (gameMode === "item") {
        // ① 25개 중 랜덤 6개의 인덱스 선택
        const randomIndexes = [];
        while (randomIndexes.length < itemList.length) { // itemList.length = 6
            const rand = Math.floor(Math.random() * 25);
            if (!randomIndexes.includes(rand)) randomIndexes.push(rand);
        }

        // ② 각 인덱스에 itemList의 각 아이템을 1개씩 할당
        itemCards = randomIndexes.map((index, i) => ({
            index, // 카드의 실제 위치
            item: itemList[i], // 아이템 1개씩
        }));
    }

    shuffled.forEach((topic, i) => {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.flipped = "false";
        card.dataset.team = "";
        card.dataset.topic = topic;

        // 🔹 아이템전이면 해당 카드에 아이템 저장
        if (gameMode === "item") {
            const match = itemCards.find((c) => c.index === i);
            if (match) card.dataset.item = match.item.name;
        }

        const teamBtns = teamColors
            .slice(0, teamCount)
            .map(
                (t) =>
                `<button class="team-btn" data-team="${t.name}" style="background:${t.bg};border-color:${t.border}">${t.name}</button>`
            )
            .join("");

        card.innerHTML = `
      <div class="inner">
        <div class="front">카드 ${i + 1}</div>
        <div class="back">
          <div class="topic">${i + 1}. ${topic}</div>
          <div class="team-select">${teamBtns}</div>
        </div>
      </div>`;

        // ✅ 카드 클릭 (뒤집기 + 확대)
        card.addEventListener("click", (e) => {
            if (e.target.classList.contains("team-btn")) return;
            if (card.dataset.flipped === "true") return;

            card.classList.add("flipped");
            card.dataset.flipped = "true";
            showExplanation(topic);
            enterFocusMode(card);

            // 🎁 아이템전: 팝업 표시 (화면 중앙 고정)
            if (gameMode === "item" && card.dataset.item) {
                showItemPopup(card.dataset.item);
            }
        });


        // ✅ 팀 선택
        card.querySelectorAll(".team-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const team = e.target.dataset.team;
                assignTeam(card, team);
                checkBingo();
                exitFocusMode(card);
            });
        });

        grid.appendChild(card);
    });
}

// ✅ 팀 색상 지정
function assignTeam(card, teamName) {
    const teamInfo = teamColors.find((t) => t.name === teamName);
    const back = card.querySelector(".back");
    back.style.backgroundColor = teamInfo.bg;
    back.style.borderColor = teamInfo.border;
    card.dataset.team = teamName;
}

// ✅ 설명 보기 / 닫기
let isExplainVisible = false;
if (toggleBtn && explainContent) {
    toggleBtn.addEventListener("click", () => {
        isExplainVisible = !isExplainVisible;
        explainContent.classList.toggle("visible", isExplainVisible);
        explainContent.classList.toggle("hidden", !isExplainVisible);
        toggleBtn.textContent = isExplainVisible ? "📕 설명 닫기" : "📘 설명 보기";
    });
}

// ✅ 설명 표시
function showExplanation(topic) {
    const text = `<strong>💬 ${topic}</strong><br>${
    explanations[topic] || "이 주제에 대한 설명이 없습니다."
  }`;
    explainContent.innerHTML = text;
}

// ✅ 빙고 체크
function checkBingo() {
    const cards = document.querySelectorAll(".card");
    const board = Array.from(cards).map((c) => c.dataset.team);
    const lines = [
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20]
    ];
    const teamCounts = {};
    for (let i = 0; i < teamCount; i++) teamCounts[teamColors[i].name] = 0;

    for (const line of lines) {
        const t = board[line[0]];
        if (t && line.every((i) => board[i] === t)) teamCounts[t]++;
    }

    const msgs = [];
    for (const t in teamCounts) {
        if (teamCounts[t] > 0) {
            const color = teamColors.find((x) => x.name === t);
            msgs.push(
                `<span style="color:${color.border}">${t}팀 ${teamCounts[t]}줄 빙고!</span>`
            );
        }
    }

    resultBox.innerHTML =
        msgs.length > 0 ?
        msgs.join("<br>") :
        "💬 빙고가 완성되면 여기에 표시됩니다.";
}

// ✅ 확대 모드 (body 기준 중앙)
function enterFocusMode(card) {
    // 다른 카드 흐리게
    document.querySelectorAll(".card").forEach((c) => {
        if (c !== card) c.style.opacity = "0.2";
    });

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // 중앙 (가로 중앙, 세로 약간 위쪽)
    const centerX = vw / 2 - card.offsetLeft - card.offsetWidth / 2;
    const centerY = vh / 2 - card.offsetTop - card.offsetHeight * 1.2; // 위쪽으로 약간 올림

    card.style.transition = "transform 0.6s ease";
    card.style.transform = `translate(${centerX}px, ${centerY}px) scale(6)`;
    card.style.zIndex = "1000";
}

// ✅ 확대 모드 종료
function exitFocusMode(card) {
    card.style.transform = "";
    card.style.zIndex = "";

    setTimeout(() => {
        document.querySelectorAll(".card").forEach((c) => (c.style.opacity = "1"));
        // 🔹 아이템 팝업 제거
        if (currentPopup) {
            currentPopup.remove();
            currentPopup = null;
        }
    }, 400);
}

let currentPopup = null; // 현재 팝업 추적용

// ✅ 아이템 팝업 (화면 중앙 고정)
function showItemPopup(itemName) {
    const item = itemList.find((i) => i.name === itemName);
    if (!item) return;

    // 기존 팝업 제거 (중복 방지)
    if (currentPopup) currentPopup.remove();

    const popup = document.createElement("div");
    popup.className = `item-popup ${item.type}`;
    popup.innerHTML = `
    <div class="item-icon">${item.type === "good" ? "🎁" : "💀"}</div>
    <div class="item-name">${item.name}</div>
    <div class="item-desc">${item.desc}</div>
    <button class="item-close">닫기 ✖</button>
  `;
    document.body.appendChild(popup);
    currentPopup = popup;

    // 닫기 버튼 동작
    popup.querySelector(".item-close").addEventListener("click", () => {
    popup.remove();
    currentPopup = null;
  });
}
