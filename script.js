// ========================
// 犬の16タイプ性格診断
// ========================
const QUESTIONS = [
  { text: "散歩の準備になるとソワソワする", axis: "EI", side: "E" },
  { text: "おやつの気配を感じると、すぐ来る", axis: "SN", side: "S" },
  { text: "ボールやおもちゃを見ると遊びたくなる", axis: "JP", side: "P" },
  { text: "ごはんの時間が近いとアピールする", axis: "SN", side: "S" },
  { text: "初対面の人に自分から近づく", axis: "EI", side: "E" },
  { text: "撫でてもらうのを自分から求める", axis: "TF", side: "F" },
  { text: "他の犬を見ると一緒に遊びたがる", axis: "EI", side: "E" },
  { text: "新しい匂い・物に興味を示す", axis: "SN", side: "N" },
  { text: "物音に反応しやすい", axis: "SN", side: "S" },
  { text: "好きな遊びを自分で決めたがる", axis: "TF", side: "T" },
  { text: "ひとりで過ごすより、誰かのそばにいたがる", axis: "EI", side: "E" },
  { text: "ルールを守ろうとする", axis: "JP", side: "J" },
  { text: "初めての場所でも動き回る", axis: "SN", side: "N" },
  { text: "飼い主の指示をよく聞く", axis: "TF", side: "F" },
  { text: "散歩コースが変わると落ち着かない", axis: "JP", side: "J" },
  { text: "何か起きるとまず飼い主を見る", axis: "TF", side: "F" },
  { text: "イタズラをよくする", axis: "TF", side: "T" },
  { text: "外出後はぐったりしやすい", axis: "EI", side: "I" },
  { text: "興奮すると落ち着くまで時間がかかる", axis: "JP", side: "P" },
  { text: "遊びは短時間でも満足しやすい", axis: "JP", side: "J" },
  { text: "ひとりでいても落ち着いて過ごせる", axis: "EI", side: "I" },
  { text: "家の中でも周りをよく気にしている", axis: "SN", side: "S" },
  { text: "気分でやる・やらないがはっきりしている", axis: "TF", side: "T" },
  { text: "遊び中でも呼ばれたらやめられる", axis: "JP", side: "J" },
  { text: "新しい芸を覚えるのが早い", axis: "SN", side: "N" },
  { text: "びっくりすると飛びつくことがある", axis: "TF", side: "T" },
];

let index = 0;
let answers = Array(QUESTIONS.length).fill(null);

// ========================
// 要素
// ========================
const qText = document.getElementById("qText");
const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");
const btnNeutral = document.getElementById("btnNeutral");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const quizView = document.getElementById("quizView");
const resultView = document.getElementById("resultView");


// ========================
// 点数（-1〜+1方式）
// ========================
function answerScore(ans, side){
  if(ans === "neutral") return 0;
  if(ans === "yes") return 1;
  if(ans === "no") return -1;
  return 0;
}


// ========================
// 表示
// ========================
function render(){
  qText.textContent = QUESTIONS[index].text;
  updatePaws();
  showMotivation();
}

function updatePaws(){
  const paws = document.getElementById("paws");
  const progress = index;
  paws.textContent = "🐾".repeat(progress) + "▫️".repeat(QUESTIONS.length-progress);
}

function showMotivation(){
  const msg = document.getElementById("progressMsg");
  if(index === 9) msg.textContent = "あと半分！🐶";
  else if(index === 19) msg.textContent = "もう少し！ラストスパート🐾";
  else msg.textContent = "";
}


// ========================
// 次へ自動
// ========================
function selectAnswer(ans){
  answers[index] = ans;
  setTimeout(()=>{
    if(index < QUESTIONS.length -1){
      index++;
      render();
    }else{
      showFinish();
    }
  },400);
}

btnYes.onclick = ()=>selectAnswer("yes");
btnNo.onclick = ()=>selectAnswer("no");
btnNeutral.onclick = ()=>selectAnswer("neutral");

prevBtn.onclick = ()=>{
  if(index>0){
    index--;
    render();
  }
};


// ========================
// 結果
// ========================
function showFinish(){
  quizView.classList.add("hidden");
  resultView.classList.remove("hidden");
}

nextBtn.onclick = ()=>{
  const type = calculateType();
  window.location.href = getBlogURL(type);
};

function calculateType(){
  const scores = {E:0,I:0,S:0,N:0,T:0,F:0,J:0,P:0};

  answers.forEach((ans,i)=>{
    if(ans===null) return;
    const q = QUESTIONS[i];
    const pts = answerScore(ans);
    scores[q.side] += pts;
  });

  const EI = scores.E >= scores.I ? "E":"I";
  const SN = scores.S >= scores.N ? "S":"N";
  const TF = scores.T >= scores.F ? "T":"F";
  const JP = scores.J >= scores.P ? "J":"P";

  return EI+SN+TF+JP;
}


// ========================
// ブログ遷移
// ========================
function getBlogURL(type){
  const urls = {
    ESFP:"https://everyday-dog.com/?p=16",
    ESTP:"https://everyday-dog.com/?p=24",
    ISFP:"https://everyday-dog.com/?p=26",
    ISTP:"https://everyday-dog.com/?p=28",
    ESFJ:"https://everyday-dog.com/?p=30",
    ESTJ:"https://everyday-dog.com/?p=30",
    ISFJ:"https://everyday-dog.com/?p=34",
    ISTJ:"https://everyday-dog.com/?p=36",
    ENFP:"https://everyday-dog.com/?p=38",
    ENFJ:"https://everyday-dog.com/?p=40",
    INFP:"https://everyday-dog.com/?p=42",
    INFJ:"https://everyday-dog.com/?p=44",
    ENTP:"https://everyday-dog.com/?p=46",
    ENTJ:"https://everyday-dog.com/?p=48",
    INTP:"https://everyday-dog.com/?p=50",
    INTJ:"https://everyday-dog.com/?p=53",
  };
  return urls[type];
}

render();
