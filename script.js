// ====== 質問データ（27問） ======
// axis: "EI" | "SN" | "TF" | "JP"
// side: その質問が増やす側の文字（例：E側質問なら side:"E"）
const QUESTIONS = [
  { text: "散歩の準備になるとソワソワする", axis: "EI", side: "E" }, //1
  { text: "おやつの気配を感じると、すぐ来る", axis: "SN", side: "S" }, //2
  { text: "ボールやおもちゃを見ると遊びたくなる", axis: "JP", side: "P" }, //3
  { text: "ひとりでいても、落ち着いて過ごせる", axis: "EI", side: "I" }, //4
  { text: "飼い主が立つとついてくる", axis: "EI", side: "E" }, //5
  { text: "撫でてもらうのを自分から求める", axis: "TF", side: "F" }, //6
  { text: "ごはんの時間が近いとアピールする", axis: "SN", side: "S" }, //7
  { text: "初めての場所でも動き回る", axis: "SN", side: "N" }, //8
  { text: "物音（インターホン等）に反応しやすい", axis: "SN", side: "S" }, //9
  { text: "寝る場所に強いこだわりがある", axis: "JP", side: "J" }, //10

  { text: "初対面の人に自分から近づく", axis: "EI", side: "E" }, //11
  { text: "他の犬を見ると一緒に遊びたがる", axis: "EI", side: "E" }, //12
  { text: "新しい匂い・物に興味を示す", axis: "SN", side: "N" }, //13
  { text: "飼い主の指示をよく聞く", axis: "TF", side: "F" }, //14
  { text: "散歩コースが変わると落ち着かない", axis: "JP", side: "J" }, //15
  { text: "何か起きると、まず飼い主の反応を見る", axis: "TF", side: "F" }, //16
  { text: "イタズラをよくする", axis: "TF", side: "T" }, //17
  { text: "留守番が苦手", axis: "EI", side: "E" }, //18

  { text: "興奮した後、落ち着くまでに時間がかかる", axis: "JP", side: "P" }, //19
  { text: "遊びは短時間でも満足しやすい", axis: "JP", side: "J" }, //20
  { text: "外出のあと、家に帰るとぐったりしやすい", axis: "EI", side: "I" }, //21
  { text: "家の中でも、周りの様子をよく気にしている", axis: "SN", side: "S" }, //22
  { text: "好きな遊びを自分で決めたがる", axis: "TF", side: "T" }, //23
  { text: "気分で「やる／やらない」がはっきりしている", axis: "TF", side: "T" }, //24
  { text: "新しい芸を覚えるのが早い", axis: "SN", side: "N" }, //25
  { text: "ルール（ダメと言われた事）を守ろうとする", axis: "JP", side: "J" }, //26
  { text: "ひとりで過ごすより、誰かのそばにいたがる", axis: "EI", side: "E" }, //27
];

// ====== 16タイプ表示名（犬版ラベル） ======
const TYPE_META = {
  INTJ: { group: "分析家（NT）", name: "段取り職人" },
  INTP: { group: "分析家（NT）", name: "観察マニア" },
  ENTJ: { group: "分析家（NT）", name: "仕切り隊長" },
  ENTP: { group: "分析家（NT）", name: "いたずら頭脳" },

  INFJ: { group: "外交官（NF）", name: "気配レーダー" },
  INFP: { group: "外交官（NF）", name: "寄り添い係" },
  ENFJ: { group: "外交官（NF）", name: "みんなのまとめ役" },
  ENFP: { group: "外交官（NF）", name: "祭りスイッチ" },

  ISTJ: { group: "番人（SJ）", name: "ルーティン番" },
  ISFJ: { group: "番人（SJ）", name: "おうちガード" },
  ESTJ: { group: "番人（SJ）", name: "きっちり監督" },
  ESFJ: { group: "番人（SJ）", name: "お世話名人" },

  ISTP: { group: "探検家（SP）", name: "無言職人" },
  ISFP: { group: "探検家（SP）", name: "まったり派" },
  ESTP: { group: "探検家（SP）", name: "即ダッシュ" },
  ESFP: { group: "探検家（SP）", name: "遊び番長" },
};

// ====== 3択 → 点数（はい2 / どちらでもない1 / いいえ0） ======
function answerToPoints(ans) {
  if (ans === "yes") return 2;
  if (ans === "neutral") return 1;
  return 0; // "no" or null
}

// ====== ローカル保存（途中復帰） ======
const STORAGE_KEY = "dog16_answers_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { index: 0, answers: Array(QUESTIONS.length).fill(null) };
    const parsed = JSON.parse(raw);
    if (!parsed.answers || parsed.answers.length !== QUESTIONS.length) {
      return { index: 0, answers: Array(QUESTIONS.length).fill(null) };
    }
    return parsed;
  } catch {
    return { index: 0, answers: Array(QUESTIONS.length).fill(null) };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ====== UI要素 ======
const qNo = document.getElementById("qNo");
const qText = document.getElementById("qText");
const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");
const btnNeutral = document.getElementById("btnNeutral");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const unansweredText = document.getElementById("unansweredText");

const quizView = document.getElementById("quizView");
const resultView = document.getElementById("resultView");
const backToQuizBtn = document.getElementById("backToQuizBtn");

const resultCode = document.getElementById("resultCode");
const resultName = document.getElementById("resultName");
const resultGroup = document.getElementById("resultGroup");
const axisDetails = document.getElementById("axisDetails");

// ====== 状態 ======
let state = loadState();

// ====== 表示更新 ======
function renderQuestion() {
  const i = state.index;
  const q = QUESTIONS[i];

  qNo.textContent = `Q${i + 1}`;
  qText.textContent = q.text;

  // 選択状態
  const ans = state.answers[i];
  [btnYes, btnNo, btnNeutral].forEach(b => b.classList.remove("selected"));
  if (ans === "yes") btnYes.classList.add("selected");
  if (ans === "no") btnNo.classList.add("selected");
  if (ans === "neutral") btnNeutral.classList.add("selected");

  prevBtn.disabled = i === 0;

  // 次へボタン文言
  if (i === QUESTIONS.length - 1) {
    nextBtn.textContent = "結果を見る →";
  } else {
    nextBtn.textContent = "次へ →";
  }

  updateProgress();
}

function updateProgress() {
  const answeredCount = state.answers.filter(a => a !== null).length;
  const percent = Math.round((answeredCount / QUESTIONS.length) * 100);

  progressText.textContent = `進捗 ${percent}% / ${answeredCount}/${QUESTIONS.length}問`;
  progressFill.style.width = `${percent}%`;

  const unanswered = QUESTIONS.length - answeredCount;
  unansweredText.textContent = `未回答 ${unanswered}問`;
}

// ====== 集計 ======
function calcScores() {
  // 各側の合計（EとI両方持つ）
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0,
  };

  state.answers.forEach((ans, idx) => {
    if (!ans) return;
    const pts = answerToPoints(ans);
    const { side } = QUESTIONS[idx];
    scores[side] += pts;
  });

  return scores;
}

// 同点は I/S/F/J に倒す（安全側）
function decideLetter(aSide, bSide, scores, tiePick) {
  if (scores[aSide] > scores[bSide]) return aSide;
  if (scores[bSide] > scores[aSide]) return bSide;
  return tiePick;
}

function buildType(scores) {
  const EorI = decideLetter("E", "I", scores, "I");
  const SorN = decideLetter("S", "N", scores, "S");
  const TorF = decideLetter("T", "F", scores, "F");
  const JorP = decideLetter("J", "P", scores, "J");
  return `${EorI}${SorN}${TorF}${JorP}`;
}

function renderResult() {
  const scores = calcScores();
  const type = buildType(scores);

  resultCode.textContent = type;

  const meta = TYPE_META[type] || { group: "タイプ", name: "" };
  resultName.textContent = meta.name ? `「${meta.name}」` : "";
  resultGroup.textContent = meta.group || "";

  axisDetails.innerHTML = "";
  axisDetails.appendChild(axisRow("E", scores.E, "I", scores.I, "EI"));
  axisDetails.appendChild(axisRow("S", scores.S, "N", scores.N, "SN"));
  axisDetails.appendChild(axisRow("T", scores.T, "F", scores.F, "TF"));
  axisDetails.appendChild(axisRow("J", scores.J, "P", scores.P, "JP"));
}

function axisRow(a, aScore, b, bScore, label) {
  const div = document.createElement("div");
  div.className = "axis-row";
  div.innerHTML = `
    <div>${label}</div>
    <div><span>${a}</span> ${aScore} / <span>${b}</span> ${bScore}</div>
  `;
  return div;
}

// ====== 画面切替 ======
function showResultView() {
  quizView.classList.add("hidden");
  resultView.classList.remove("hidden");
  renderResult();
  updateProgress();
}

function showQuizView() {
  resultView.classList.add("hidden");
  quizView.classList.remove("hidden");
  renderQuestion();
}

// ====== 入力処理 ======
function setAnswer(ans) {
  state.answers[state.index] = ans;
  saveState(state);
  renderQuestion();
}

btnYes.addEventListener("click", () => setAnswer("yes"));
btnNo.addEventListener("click", () => setAnswer("no"));
btnNeutral.addEventListener("click", () => setAnswer("neutral"));

prevBtn.addEventListener("click", () => {
  if (state.index > 0) {
    state.index--;
    saveState(state);
    renderQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  // 最後の問題なら結果へ
  if (state.index === QUESTIONS.length - 1) {
    showResultView();
    return;
  }
  state.index++;
  saveState(state);
  renderQuestion();
});

backToQuizBtn.addEventListener("click", () => {
  showQuizView();
});

resetBtn.addEventListener("click", () => {
  if (!confirm("回答をリセットします。よろしいですか？")) return;
  state = { index: 0, answers: Array(QUESTIONS.length).fill(null) };
  saveState(state);
  showQuizView();
});

// ====== 初期表示 ======
showQuizView();
