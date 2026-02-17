// ================================
// 1) ブログURL（タイプごとに飛ばす）
// ================================
const TYPE_URL = {
  INTJ: "https://everyday-dog.com/?p=53",
  INTP: "https://everyday-dog.com/?p=50",
  ENTJ: "https://everyday-dog.com/?p=48",
  ENTP: "https://everyday-dog.com/?p=46",

  INFJ: "https://everyday-dog.com/?p=44",
  INFP: "https://everyday-dog.com/?p=42",
  ENFJ: "https://everyday-dog.com/?p=40",
  ENFP: "https://everyday-dog.com/?p=38",

  ISTJ: "https://everyday-dog.com/?p=36",
  ISFJ: "https://everyday-dog.com/?p=34",
  ESTJ: "https://everyday-dog.com/?p=30",
  ESFJ: "https://everyday-dog.com/?p=30",

  ISTP: "https://everyday-dog.com/?p=28",
  ISFP: "https://everyday-dog.com/?p=26",
  ESTP: "https://everyday-dog.com/?p=24",
  ESFP: "https://everyday-dog.com/?p=16",
};

// ================================
// 2) 質問（26問）
// - axis: "EI" | "SN" | "TF" | "JP"
// - side: その質問が「+側」として扱う文字
// - scoring: 基本は はい:+1 / どちらでもない:0 / いいえ:-1
//   ※反転したい質問だけ yes/no を入れ替えればOK
// ================================
const QUESTIONS = [
  { text: "散歩の準備になるとソワソワする", axis: "EI", side: "E" }, //1
  { text: "おやつの気配を感じると、すぐ来る", axis: "SN", side: "S" }, //2
  { text: "ボールやおもちゃを見ると遊びたくなる", axis: "JP", side: "P" }, //3
  { text: "ごはんの時間が近いとアピールする", axis: "SN", side: "S" }, //4
  { text: "初対面の人に自分から近づく", axis: "EI", side: "E" }, //5
  { text: "撫でてもらうのを自分から求める", axis: "TF", side: "F" }, //6

  { text: "他の犬を見ると一緒に遊びたがる", axis: "EI", side: "E" }, //7
  { text: "新しい匂い・物に興味を示す", axis: "SN", side: "N" }, //8
  { text: "物音（インターホン等）に反応しやすい", axis: "SN", side: "S" }, //9
  { text: "好きな遊びを自分で決めたがる", axis: "TF", side: "T" }, //10
  { text: "ひとりで過ごすより、誰かのそばにいたがる", axis: "EI", side: "E" }, //11
  { text: "ルール（ダメと言われた事）を守ろうとする", axis: "JP", side: "J" }, //12

  { text: "初めての場所でも動き回る", axis: "SN", side: "N" }, //13
  { text: "飼い主の指示をよく聞く", axis: "TF", side: "F" }, //14
  { text: "散歩コースが変わると落ち着かない", axis: "JP", side: "J" }, //15
  { text: "何か起きると、まず飼い主の反応を見る", axis: "TF", side: "F" }, //16
  { text: "イタズラをよくする", axis: "TF", side: "T" }, //17
  { text: "外出のあと、家に帰るとぐったりしやすい", axis: "EI", side: "I" }, //18

  { text: "興奮した後、落ち着くまでに時間がかかる", axis: "JP", side: "P" }, //19
  { text: "遊びは短時間でも満足しやすい", axis: "JP", side: "J" }, //20
  { text: "ひとりでいても、落ち着いて過ごせる", axis: "EI", side: "I" }, //21
  { text: "家の中でも、周りの様子をよく気にしている", axis: "SN", side: "S" }, //22
  { text: "気分で「やる／やらない」がはっきりしている", axis: "TF", side: "T" }, //23
  { text: "遊んでいる途中でも、呼ばれたらすぐやめられる", axis: "JP", side: "J" }, //24

  { text: "新しい芸を覚えるのが早い", axis: "SN", side: "N" }, //25
  { text: "びっくりした時、考える前に噛んだり飛びつくことがある", axis: "TF", side: "T" }, //26
];

// ================================
// 3) スコア設計（質問ごとに反転できる）
// 기본: はい:+1 / どちらでもない:0 / いいえ:-1
// 反転したい場合は、その質問に yesScore/noScore を追加すればOK
// 例）いいえが+1にしたい： { ..., yesScore: -1, noScore: +1, neutralScore: 0 }
// ================================
function getAnswerPoints(question, ans) {
  const yes = (typeof question.yesScore === "number") ? question.yesScore : 1;
  const no = (typeof question.noScore === "number") ? question.noScore : -1;
  const neutral = (typeof question.neutralScore === "number") ? question.neutralScore : 0;

  if (ans === "yes") return yes;
  if (ans === "no") return no;
  return neutral; // "neutral"
}

function oppositeLetter(letter) {
  const map = { E:"I", I:"E", S:"N", N:"S", T:"F", F:"T", J:"P", P:"J" };
  return map[letter];
}

// ================================
// 4) 状態（保存して途中復帰）
// ================================
const STORAGE_KEY = "dog16_simple_v1";
function loadState() {
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return { index:0, answers:Array(QUESTIONS.length).fill(null) };
    const s = JSON.parse(raw);
    if(!s.answers || s.answers.length !== QUESTIONS.length){
      return { index:0, answers:Array(QUESTIONS.length).fill(null) };
    }
    return s;
  }catch{
    return { index:0, answers:Array(QUESTIONS.length).fill(null) };
  }
}
function saveState(s){ localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }

// ================================
// 5) DOM
// ================================
const qText = document.getElementById("qText");
const paws = document.getElementById("paws");

const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");
const btnNeutral = document.getElementById("btnNeutral");

const prevBtn = document.getElementById("prevBtn");
const resetBtn = document.getElementById("resetBtn");

const quizView = document.getElementById("quizView");
const finishView = document.getElementById("finishView");
const goBtn = document.getElementById("goBtn");

let state = loadState();

// ================================
// 6) 足跡（10段階）
// ================================
const PAW_STEPS = 10;
function renderPaws() {
  const answered = state.answers.filter(a => a !== null).length;
  const ratio = answered / QUESTIONS.length;
  const onCount = Math.max(1, Math.round(ratio * PAW_STEPS)); // 0にならないように最低1

  paws.innerHTML = "";
  for(let i=0;i<PAW_STEPS;i++){
    const span = document.createElement("span");
    span.className = "paw" + (i < onCount ? " on" : "");
    span.textContent = "🐾";
    paws.appendChild(span);
  }
}

// ================================
// 7) 表示
// ================================
function renderQuestion() {
  renderPaws();
  const i = state.index;
  qText.textContent = QUESTIONS[i].text;
  prevBtn.disabled = (i === 0);
}

function showQuiz() {
  finishView.classList.add("hidden");
  quizView.classList.remove("hidden");
  renderQuestion();
}

function showFinishAndGo(url) {
  quizView.classList.add("hidden");
  finishView.classList.remove("hidden");
  renderPaws();

  // 自動で飛ぶ（すぐ）
  // ※ボタンも残す（環境によって遷移ブロックされることがあるため）
  goBtn.onclick = () => { window.location.href = url; };

  // “答え終わったら飛ぶ” を優先
  setTimeout(() => {
    window.location.href = url;
  }, 200);
}

// ================================
// 8) 集計 → 16タイプ判定
// 同点は I / S / F / J に倒す
// ================================
function calcLetterScores() {
  const scores = { E:0,I:0,S:0,N:0,T:0,F:0,J:0,P:0 };

  state.answers.forEach((ans, idx) => {
    if(ans === null) return;
    const q = QUESTIONS[idx];
    const pts = getAnswerPoints(q, ans); // +1 / 0 / -1（または質問別）

    if(pts === 0) return;

    const plusSide = q.side;             // 例：E
    const minusSide = oppositeLetter(q.side); // 例：I

    if(pts > 0) scores[plusSide] += pts;
    if(pts < 0) scores[minusSide] += Math.abs(pts);
  });

  return scores;
}

function decide(a, b, scores, tiePick){
  if(scores[a] > scores[b]) return a;
  if(scores[b] > scores[a]) return b;
  return tiePick;
}

function buildType(scores){
  const EorI = decide("E","I",scores,"I");
  const SorN = decide("S","N",scores,"S");
  const TorF = decide("T","F",scores,"F");
  const JorP = decide("J","P",scores,"J");
  return `${EorI}${SorN}${TorF}${JorP}`;
}

// ================================
// 9) 入力：押したら次へ（自動）
// ================================
function answerAndNext(ans){
  state.answers[state.index] = ans;
  saveState(state);

  // 次へ
if(state.index >= QUESTIONS.length - 1){
  // 最後 → タイプ算出 → ブログへ
  const scores = calcLetterScores();
  const type = buildType(scores);
  const url = TYPE_URL[type] || "https://everyday-dog.com/";

  // ★ここ追加：診断完了したら保存データを消す（次回は最初からになる）
  localStorage.removeItem(STORAGE_KEY);

  showFinishAndGo(url);
  return;
}

  state.index++;
  saveState(state);
  renderQuestion();
}

btnYes.addEventListener("click", () => answerAndNext("yes"));
btnNo.addEventListener("click", () => answerAndNext("no"));
btnNeutral.addEventListener("click", () => answerAndNext("neutral"));

// 戻る
prevBtn.addEventListener("click", () => {
  if(state.index === 0) return;
  state.index--;
  saveState(state);
  renderQuestion();
});

// リセット
resetBtn.addEventListener("click", () => {
  if(!confirm("最初からやり直しますか？")) return;
  state = { index:0, answers:Array(QUESTIONS.length).fill(null) };
  saveState(state);
  showQuiz();
});

// 初期表示
showQuiz();
