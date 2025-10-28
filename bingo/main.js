// main.js
const grid = document.getElementById("cardGrid");
const explainBox = document.getElementById("explainBox");
const resultBox = document.getElementById("resultBox");

function createCards() {
  grid.innerHTML = "";
  const shuffled = topics.sort(() => Math.random() - 0.5).slice(0,25);
  shuffled.forEach((topic, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.flipped = "false";
    card.dataset.team = "";
    card.dataset.topic = topic;
    card.innerHTML = `
      <div class="inner">
        <div class="front">카드 ${i+1}</div>
        <div class="back">
          <div class="topic">${i+1}. ${topic}</div>
          <div class="name-field"><input type="text" placeholder="이름 또는 팀 입력"></div>
        </div>
      </div>`;
    card.addEventListener("click",(e)=>{
      if(e.target.tagName.toLowerCase()==="input")return;
      if(card.dataset.flipped==="false"){
        card.classList.add("flipped");
        card.dataset.flipped="true";
        showExplanation(topic);
      }
    });
    // 팀 색상 지정
    card.querySelector("input").addEventListener("input",(e)=>{
      const val=e.target.value.trim();
      const back=card.querySelector(".back");
      back.classList.remove("team-A","team-B","team-C");
      card.dataset.team="";
      if(/^A팀$/i.test(val)){back.classList.add("team-A");card.dataset.team="A";}
      else if(/^B팀$/i.test(val)){back.classList.add("team-B");card.dataset.team="B";}
      else if(/^C팀$/i.test(val)){back.classList.add("team-C");card.dataset.team="C";}
      checkBingo();
    });
    grid.appendChild(card);
  });
}

function showExplanation(topic){
  explainBox.innerHTML=`<strong>💬 ${topic}</strong><br>${explanations[topic]||"이 주제에 대한 설명이 없습니다."}`;
}

function checkBingo(){
  const cards=document.querySelectorAll(".card");
  const board=Array.from(cards).map(c=>c.dataset.team);
  const lines=[
    [0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24],
    [0,5,10,15,20],[1,6,11,16,21],[2,7,12,17,22],[3,8,13,18,23],[4,9,14,19,24],
    [0,6,12,18,24],[4,8,12,16,20]
  ];
  const teamCounts={A:0,B:0,C:0};
  for(const line of lines){
    const t=board[line[0]];
    if(t && line.every(i=>board[i]===t))teamCounts[t]++;
  }
  const msgs=[];
  for(const t in teamCounts){
    if(teamCounts[t]>0){
      const c=t==="A"?"🔵":t==="B"?"🔴":"🟢";
      msgs.push(`${c} ${t}팀 ${teamCounts[t]}줄 빙고!`);
    }
  }
  resultBox.innerHTML=msgs.length?msgs.join("<br>"):"💬 빙고가 완성되면 여기에 표시됩니다.";
}

function resetBoard(){
  createCards();
  explainBox.innerHTML="💬 카드가 뒤집히면 이곳에 교사용 부연 설명이 표시됩니다.";
  resultBox.innerHTML="💬 팀 이름을 입력하면 색이 표시됩니다. (A팀🔵 / B팀🔴 / C팀🟢)";
}

createCards();
