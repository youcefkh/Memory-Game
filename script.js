const cards = document.querySelectorAll('.memory-card');
let hasFlipped = false;
let cardOne,cardTwo;
let lockBoard=true;//bloquer les carte de se retourné
let running = 0;//le declenchement du temps au moment de cliquer sur start
let time = 0;
let nbrMatchCards=0;//nombre de carte trouvés
let nbrMoves=0;//nbr de move
let timeFreezed = false; //arreter le chrono
let bestTiming = "";
let bestMoves = 0;

const start = document.getElementsByClassName('start-btn');
start[0].addEventListener('click',startGame);

function startGame() {
  if (running) return;
  nbrMoves=0;
  time=0;
  nbrMatchCards=0;
  timeFreezed = false;
  running = 1;
  document.getElementById('moves').innerHTML="0";
  melanger();//mélanger les cartes
  timing();//lancer le chrono
  flipAll();//retourner toutes les cartes
  lockBoard = false;//débloquer le retournement des cartes
}

function flipAll() {
  cards.forEach(card=>card.classList.add('flip'));
  setTimeout(()=>{
    cards.forEach(card=>card.classList.remove('flip'));
  },3000);
}

cards.forEach(card => card.addEventListener('click',flip));
function flip() {
  if(lockBoard) return; //empecher le joueur de retourner une carte avant que les 2 premieres soient cachées
  if(this === cardOne) return; //eviter qu'il y ai un match en cliquant 2 fois sur la meme carte
  this.classList.add('flip');
  if(!hasFlipped){
    hasFlipped = true;
    cardOne = this;
  }
  else {
    hasFlipped = false;
    cardTwo = this;
    checkForMatch();//comparer les deux cartes retournées
    moves();
  }
}

function checkForMatch() {
  if (cardOne.dataset.framework === cardTwo.dataset.framework) {
    nbrMatchCards++;
    cardOne.removeEventListener('click',flip);//desactiver le declencheur d'evenement
    cardTwo.removeEventListener('click',flip);
    if (nbrMatchCards==8) {
      setTimeout(gameOver,1000); //annoncer la fin de la partie
    }
    resetBoard();
  }
  else {
    lockBoard=true;
    setTimeout(()=>{
      cardOne.classList.remove('flip');//desactiver la class 'flip'
      cardTwo.classList.remove('flip');
      resetBoard();
    },1000)//pour eviter que la 2eme carte se retourne immediatement

  }
}

function resetBoard() {
  [lockBoard,hasFlipped] = [false,false];
  [cardOne,cardTwo] = [null,null];
}
function melanger() {
  cards.forEach(card => {
    let order = Math.floor(Math.random()*16); // générer un nombre entier en 0 et 15
    card.style.order = order;
  });
}

function timing() {
  if(timeFreezed) return; //arreter le temps
  if (running == 1) {
    setTimeout(function () {
      time++;
      secs = Math.floor(time/10%60);
      mins = Math.floor(time/10/60);
      if(secs<10)
        secs = "0"+ secs;
      if(mins<10)
        mins = "0"+ mins;
      document.getElementById('chrono').innerHTML = mins +":"+ secs;
      timing();
    },100);
  }
}

 function moves() {
   if (running==1) {
     nbrMoves++;
     document.getElementById('moves').innerHTML = nbrMoves;
   }
 }

 function getMoves() {
   let score = "";
   score+=document.getElementById('moves').textContent;
   return score;
 }
function getScore() {
  let score = "";
  score+=document.getElementById('chrono').textContent;
  return score;
}
function bestScore(timing,nbrMoves) {
  let t = timing.split(':');
  let ct = bestTiming.split(':');
  let t_secs = parseInt(t[0])*60+parseInt(t[1]);
  let ct_secs = parseInt(ct[0])*60+parseInt(ct[1]);
  if (!bestTiming.length && !bestMoves) {
    bestTiming += timing;
    bestMoves = nbrMoves;
    bestScorePopUp(bestMoves,bestTiming);
  }
  else if (t_secs == ct_secs) {
    if (nbrMoves<bestMoves) {
      bestMoves = nbrMoves;
      bestScorePopUp(bestMoves,bestTiming);
    }
  }
  else if (t_secs<ct_secs) {
    bestMoves = nbrMoves;
    bestTiming = "";
    bestTiming += timing;
    bestScorePopUp(bestMoves,bestTiming);
  }
  
  document.getElementById('record-result').innerHTML = bestMoves+" Moves In "+bestTiming;
}

function bestScorePopUp(bestMoves,bestTiming) {
  setTimeout(function(){
    Swal.fire({
      title: 'CONGRATULATIONS',
      text : `you broke a new record : ${bestMoves} Moves In ${bestTiming}`,
      imageUrl: 'https://thumbs.gfycat.com/BitterPassionateCockatiel-size_restricted.gif',
      imageWidth: 400,
      imageHeight: 200,
      showClass: {
        popup: 'animated fadeInDown '
      },
      hideClass: {
        popup: 'animated fadeOutUp faster'
      },
      imageAlt: 'Custom image',
      backdrop: `
        rgba(0,0,123,0.4)
        left top
        no-repeat
      `
    })
  },5000);
}
 function gameOver() {
     timeFreezed=true;
     running=0;//arreter le chrono
     Swal.fire({
      title: 'Game completed',
      text : 'your score is '+getScore(),
      icon : 'success',
      showClass: {
        popup: 'animated flip '
      },
      hideClass: {
        popup: 'animated fadeOutUp faster'
      }
    })
     bestScore(getScore(),getMoves());
     cards.forEach(card => card.addEventListener('click',flip)); //réactiver le addEventListener
 }
