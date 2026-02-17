// =============================
// 犬の16タイプ診断
// =============================
const QUESTIONS = [
  { text: "散歩の準備になるとソワソワする", axis: "EI", side: "E" },
  { text: "おやつの気配を感じると、すぐ来る", axis: "SN", side: "S" },
  { text: "ボールやおもちゃを見ると遊びたくなる", axis: "JP", side: "P" },
  { text: "ごはんの時間が近いとアピールする", axis: "SN", side: "S" },
  { text: "初対面の人に自分から近づく", axis: "EI", side: "E" },
  { text: "撫でてもらうのを自分から求める", axis: "TF", side: "F" },

  { text: "他の犬を見ると一緒に遊びたがる", axis: "EI", side: "E" },
  { text: "新しい匂い・物に興味を示す", axis: "SN", side: "N" },
  { text: "物音（インターホン等）に反応しやすい", axis: "SN", side: "S" },
  { text: "好きな遊びを自分で決めたがる", axis: "TF", side: "T" },
  { text: "ひとりで過ごすより、誰かのそばにいたがる", axis: "EI", side: "E" },
  { text: "ルール（ダメと言われた事）を守ろうとする", axis: "JP", side: "J" },

  { text: "初めての場所でも動き回る", axis: "SN", side: "N" },
  { text: "飼い主の指示をよく聞く", axis: "TF", side: "F" },
  { text: "散歩コースが変わると落ち着かない", axis: "JP", side: "J" },
  { text: "何か起きると、まず飼い主の反応を見る", axis: "TF", side: "F" },
  { text: "イタズラをよくする", axis: "TF", side: "T" },
  { text: "外出のあと、家に帰るとぐったりしやすい", axis: "EI", side: "I" },

  { text: "興奮した後、落ち着くまでに時間がかかる", axis: "JP", side: "P" },
  { text: "遊びは短時間でも満足しやすい", axis: "JP", side: "J" },
  { text: "ひとりでいても、落ち着いて過ごせる", axis: "EI", side: "I" },
  { text: "家の中でも、周りの様子をよく気にしている", axis: "SN", side: "S" },
  { text: "気分で「やる／やらない」がはっきりしている", axis: "TF", side: "T" },
  { text: "遊んでいる途中でも、呼ばれたらすぐやめられる", axis: "JP", side: "J" },

  { text: "新しい芸を覚えるのが早い", axis: "SN", side: "N" },
  { text: "びっくりした時、考える前に噛んだり飛びつくことがある", axis: "TF", side: "T" },
];

// =============================
// タイプ → ブログURL
// =============================
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

// =============================
// 状態
// =============================
let index = 0;
let answers = Array(QUESTIONS.length).fill(null);

const qText = document.getElementById("qText");
const qNo = document.getElementById("qNo");
const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");
const btnNeutral = document.getElementById("btnNeutral");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

// =============================
// 表示
// =============================
function render() {
  qText.textContent = QUESTIONS[index].text;
  qNo.textContent = `Q${index + 1}`;
  prevBtn.disabled = index === 0;
}

render();

// =============================
// 回答処理
// =============================
function setAnswer(val) {
  answers[index] = val;
}

btnYes.onclick = () => setAnswer("yes");
btnNo.onclick = () => setAnswer("no");
btnNeutral.onclick = () => setAnswer("neutral");

prevBtn.onclick = () => {
  if (index > 0) {
    index--;
    render();
  }
};

nextBtn.onclick = () => {
  if (index === QUESTIONS.length - 1) {
    calculate();
    return;
  }
  index++;
  render();
};

// =============================
// 集計（はい=＋1 / いいえ=反対側＋1）
// =============================
function calculate() {
  const score = {
    E:0,I:0,S:0,N:0,T:0,F:0,J:0,P:0
  };

  answers.forEach((ans, i) => {
    if (!ans) return;

    const { axis, side } = QUESTIONS[i];
    const opposite = axis.replace(side, "");

    if (ans === "yes") {
      score[side]++;
    } else if (ans === "no") {
      score[opposite]++;
    }
  });

  const type =
    (score.E >= score.I ? "E" : "I") +
    (score.S >= score.N ? "S" : "N") +
    (score.T >= score.F ? "T" : "F") +
    (score.J >= score.P ? "J" : "P");

  // ブログへ飛ばす
  window.location.href = TYPE_URL[type];
}
