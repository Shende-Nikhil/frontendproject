'use strict';
const human = 'X'; const ai = 'O';
let board = Array(9).fill(null);
let current = 'X'; let gameOver = false;
let mode = 'hard'; const scores = { X: 0, O: 0, D: 0 };

const boardEl = document.getElementById('board');
const statusText = document.getElementById('statusText');
const resultText = document.getElementById('resultText');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const scoreD = document.getElementById('scoreD');
const modeSel = document.getElementById('mode');
const turnDot = document.getElementById('turnDot');
mode = modeSel.value;

const combos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function createBoard(){
  boardEl.innerHTML = '';
  for(let i=0;i<9;i++){
    const btn = document.createElement('button');
    btn.className = 'cell btn';
    btn.setAttribute('role','gridcell');
    btn.setAttribute('aria-label', `Cell ${i+1}`);
    btn.dataset.index = i;
    btn.type = 'button';
    btn.addEventListener('click', onCellClick);
    boardEl.appendChild(btn);
  }
  render();
}

function onCellClick(e){
  const i = +e.currentTarget.dataset.index;
  if (board[i] || gameOver) return;
  place(i, current);
  const end = evaluateEnd(board);
  if (end){ finish(end); return; }
  switchTurn();
  if (isCpuTurn()) {
    statusText.textContent = "CPU thinking…";
    setTimeout(cpuMove, 400);
  }
}

function isCpuTurn(){ return (mode!=='human' && current===ai && !gameOver); }

function place(i, player){ if (!board[i] && !gameOver){ board[i] = player; render(); } }

function render(){
  [...boardEl.children].forEach((cell,i)=>{
    cell.textContent = board[i] ? board[i] : '';
    cell.classList.toggle('x', board[i]==='X');
    cell.classList.toggle('o', board[i]==='O');
    cell.classList.toggle('disabled', !!board[i] || gameOver);
    cell.setAttribute('aria-disabled', (!!board[i] || gameOver).toString());
  });
  statusText.textContent = gameOver ? 'Game over' : `${current}'s turn`;
  turnDot.className = `dot ${current.toLowerCase()}`;
  scoreX.textContent = scores.X; scoreO.textContent = scores.O; scoreD.textContent = scores.D;
}

function evaluateEnd(b){
  for(const line of combos){
    const [a,b1,c] = line;
    if (b[a] && b[a]===b[b1] && b[a]===b[c]) return { winner: b[a], line };
  }
  if (b.every(Boolean)) return { winner: 'D', line:null };
  return null;
}

function finish(end){
  gameOver = true;
  if (end.winner==='D'){ scores.D++; resultText.textContent='🤝 Draw!'; }
  else {
    scores[end.winner]++; resultText.textContent=`🎉 Player ${end.winner} wins!`;
    end.line?.forEach(i=> boardEl.children[i].classList.add('win'));
  }
  render(); resultText.tabIndex=-1; resultText.focus();
}

function switchTurn(){ current = current==='X' ? 'O':'X'; render(); }

function cpuMove(){
  if (gameOver) return;
  const free = board.map((v,i)=> v===null?i:null).filter(v=>v!==null);
  if (!free.length) return;
  let move = null;
  if (mode==='easy'){ move = free[Math.floor(Math.random()*free.length)]; }
  else { move = bestMoveMinimax() ?? free[Math.floor(Math.random()*free.length)]; }
  place(move, ai);
  const end = evaluateEnd(board);
  if (end){ finish(end); return; }
  switchTurn();
}

function bestMoveMinimax(){
  let best = {score:-Infinity, move:null};
  for(let i=0;i<9;i++){
    if (!board[i]){
      board[i]=ai;
      const score = minimax(board,0,false);
      board[i]=null;
      if (score>best.score) best={score,move:i};
    }
  }
  return best.move;
}

function minimax(b,depth,isMax){
  const end=evaluateEnd(b);
  if (end){
    if (end.winner===ai) return 100-depth;
    if (end.winner===human) return depth-100;
    return 0;
  }
  if (isMax){
    let best=-Infinity;
    for(let i=0;i<9;i++){ if(!b[i]){ b[i]=ai; best=Math.max(best,minimax(b,depth+1,false)); b[i]=null; } }
    return best;
  } else {
    let best=Infinity;
    for(let i=0;i<9;i++){ if(!b[i]){ b[i]=human; best=Math.min(best,minimax(b,depth+1,true)); b[i]=null; } }
    return best;
  }
}

document.getElementById('newGame').addEventListener('click', newGame);
document.getElementById('resetScores').addEventListener('click', ()=>{ scores.X=0;scores.O=0;scores.D=0; newGame(); });
modeSel.addEventListener('change', e=>{ mode=e.target.value; newGame(); });

function newGame(){
  board=Array(9).fill(null); current='X'; gameOver=false; resultText.textContent='';
  [...boardEl.children].forEach(c=>c.classList.remove('win'));
  render();
  if (isCpuTurn()) { statusText.textContent="CPU thinking…"; setTimeout(cpuMove,400); }
}

createBoard();
