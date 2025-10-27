// HTML 문서가 모두 로드되었을 때 실행되는 함수
document.addEventListener("DOMContentLoaded", function () {

    // 🔹 DOM 요소들을 미리 변수에 저장해 둠 (화면 조작에 사용)
    const startBtn = document.getElementById("startBtn");           // START 버튼
    const startScreen = document.getElementById("startScreen");     // 시작 화면 영역
    const gameScreen = document.getElementById("gameScreen");       // 게임 화면 영역
    const numberDisplay = document.getElementById("numberDisplay"); // 선택한 숫자 표시 영역
    const result = document.getElementById("result");               // 결과 메시지 영역
    const history = document.getElementById("history");             // 시도 내역 리스트

    // 🔹 게임 상태 저장 변수
    let answer = "";         // 정답으로 설정된 숫자 (3자리)
    let currentInput = "";   // 사용자가 현재 입력한 숫자
    let attempts = 0;        // 시도 횟수

    // ✅ 1. 정답 숫자 생성 (1~9 중 서로 다른 숫자 3개)
    function generateAnswer() {
        const digits = [];
        while (digits.length < 3) {
            let num = Math.floor(Math.random() * 9) + 1; // 1~9 중 랜덤 숫자 생성, floor는 소숫점 버리는 역할
            if (!digits.includes(num)) digits.push(num); // 중복되지 않으면 추가
        }
        return digits.join(''); // 숫자 배열을 문자열로 변환 (예: [3,5,8] → "358")
    }

    // ✅ 2. 숫자 입력 함수 (버튼 클릭 시 호출)
    function addDigit(num) {
        // 이미 3자리이거나 같은 숫자가 있을 경우 무시
        if (currentInput.length >= 3 || currentInput.includes(num.toString())) return;

        currentInput += num.toString(); // 숫자를 문자열로 변환해 이어붙임
        updateDisplay(); // 화면에 표시 업데이트
    }

    // ✅ 3. 입력 숫자 한 자리 삭제 (지우기 버튼)
    function removeDigit() {
        currentInput = currentInput.slice(0, -1); // 마지막 자리 제거
        updateDisplay(); // 화면 갱신
    }

    // ✅ 4. 입력된 숫자를 화면에 표시
    function updateDisplay() {
        // 3자리 미만이면 '_'로 채워서 시각적으로 표시
        numberDisplay.textContent = currentInput.padEnd(3, '_');
    }

    // ✅ 5. 정답과 비교하는 함수 (확인 버튼 클릭 시)
    function checkGuess() {
        if (currentInput.length !== 3) {
            result.textContent = "3자리 숫자를 선택해주세요.";
            return;
        }

        attempts++; // 시도 횟수 증가

        const guess = currentInput;
        const guessArr = guess.split('');     // 사용자 입력을 배열로 분리
        const answerArr = answer.split('');   // 정답도 배열로 분리
        let strike = 0, ball = 0;

        // 자리별로 비교 (스트라이크, 볼 판정)
        for (let i = 0; i < 3; i++) {
            if (guessArr[i] === answerArr[i]) {
                strike++; // 위치도 숫자도 같으면 스트라이크
            } else if (answerArr.includes(guessArr[i])) {
                ball++;   // 숫자만 같으면 볼
            }
        }

        // 판정 결과를 문자열로 생성
        const feedback = `${guess} → ${strike}S ${ball}B`;

        // 결과를 화면에 출력
        const li = document.createElement("li");
        li.textContent = feedback;
        history.appendChild(li);

        // 정답을 맞췄을 경우
        if (strike === 3) {
            result.innerHTML = `<strong>🎉 정답입니다! (${answer})<br>${attempts}번 만에 맞추셨어요!</strong>`;
            disableButtons(true); // 입력 비활성화
        } else {
            result.textContent = `${strike} 스트라이크, ${ball} 볼`;
        }

        // 다음 입력을 위해 초기화
        currentInput = "";
        updateDisplay();
    }

    // ✅ 6. 버튼 비활성화 함수 (정답 맞춘 후 사용)
    function disableButtons(disable) {
        // 모든 숫자 및 제어 버튼을 비활성화하거나 다시 활성화
        document.querySelectorAll('.num-btn, .ctrl-btn').forEach(btn => btn.disabled = disable);
    }

    // ✅ 7. 게임 초기화 함수 (리셋 버튼 클릭 시)
    function resetGame() {
        answer = generateAnswer();    // 새 정답 생성
        attempts = 0;                 // 시도 횟수 초기화
        currentInput = "";           // 입력 초기화
        updateDisplay();             // 화면 초기화
        result.textContent = "";     // 결과 초기화
        history.innerHTML = "";      // 기록 초기화
        disableButtons(false);       // 버튼 다시 활성화
    }

    // ✅ 8. START 버튼 클릭 시 게임 시작 화면 전환
    startBtn.addEventListener("click", () => {
        answer = generateAnswer();           // 게임 시작 시 정답 생성
        attempts = 0;
        currentInput = "";
        startScreen.classList.remove("active"); // 시작화면 숨기기
        gameScreen.classList.add("active");     // 게임화면 보이기
        updateDisplay();
    });

    // ✅ 9. HTML에서 호출할 수 있도록 전역으로 함수 등록
    // HTML의 onclick 속성에서 이 함수를 직접 부를 수 있도록 설정
    window.addDigit = addDigit;
    window.removeDigit = removeDigit;
    window.checkGuess = checkGuess;
    window.resetGame = resetGame;
});
