document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.memory-card');
  
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
  
    function flipCard() {
      if (lockBoard) return;
      if (this === firstCard) return;
  
      this.classList.add('flip');
  
      if (!hasFlippedCard) {
        // First click
        hasFlippedCard = true;
        firstCard = this;
  
        return;
      }
  
      // Second click
      secondCard = this;
  
      checkForMatch();
    }
  
    function checkForMatch() {
      let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  
      isMatch ? disableCards() : unflipCards();
    }
  
    function disableCards() {
      firstCard.removeEventListener('click', flipCard);
      secondCard.removeEventListener('click', flipCard);
  
      resetBoard();
    }
  
    function unflipCards() {
      lockBoard = true;
  
      setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
  
        resetBoard();
      }, 1500);
    }
  
    function resetBoard() {
      [hasFlippedCard, lockBoard] = [false, false];
      [firstCard, secondCard] = [null, null];
    }
  
    function startGame() {
      cards.forEach(card => {
        card.classList.remove('flip');
        card.addEventListener('click', flipCard);
      });
  
      resetBoard();
  
      // Shuffle the cards
      setTimeout(() => {
        cards.forEach(card => {
          let randomPos = Math.floor(Math.random() * 16);
          card.style.order = randomPos;
        });
      }, 500);
    }
  
    // Initial game start
    startGame();
  
    // Add event listener for the play again button
    document.getElementById('play-again-button').addEventListener('click', startGame);
  });
  