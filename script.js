class Game{
    currentPlayer = "X"
    computerTurn = false;
    scores = {
        x: 0,
        o: 0
    }
    level = ""
    gameEnded = false;
    winningCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    allBoxes = Array.from(document.getElementsByClassName('boxes'));
    playerTabs = Array.from(document.getElementsByClassName("player-tab"));
    playingAreas = Array.from(document.getElementsByClassName("playing-area"));

    start(){
        this.addEventListenerToBoxes();
        document.getElementById("restart-btn").addEventListener("click", ()=>this.restart());
        this.setGameLevel();
    }
    restart(){
        this.gameEnded = false;
        document.getElementById("player-turn-container").innerHTML = "<span id='player-turn'>X</span> <span class='text-secondary'>Turn</span>"
        this.currentPlayer = "X";
        this.clearAllBoxes();
        this.setActiveTab(true);
        this.playingAreas.forEach( area =>{
            area.classList.remove("d-none")
        })
        this.playingAreas[1].classList.add("d-none")
        document.getElementById("gameLevelIndicator").disabled = false;
    }
    getEmptyCells(){
        let emptyCells = []
        this.allBoxes.forEach((box, index) =>{
            if(!box.textContent){
                emptyCells.push(index);
            }
        })
        return emptyCells;
    }
    setGameLevel(level = false){
        let levelIndicator = document.getElementById("gameLevelIndicator")
        let emptyCells = this.getEmptyCells();
        if(emptyCells.length === 9){
            if(!level){
                levelIndicator.textContent = "Play against a friend"
                this.level = "Play against a friend"
            }else{
                levelIndicator.textContent = level;
                this.level = level
            }
        }
    }
    checkForWinner(){
        let winnerDeclared = false
        console.log("checking for winner ...")
        this.winningCombinations.forEach( member =>{
            if(this.allBoxes[member[0]].textContent === this.currentPlayer && 
                this.allBoxes[member[1]].textContent === this.currentPlayer && 
                this.allBoxes[member[2]].textContent === this.currentPlayer)
            {
                this.endGame()
                setTimeout(() => {
                    if(!winnerDeclared){
                        this.declareWinner()
                        winnerDeclared = true;
                    }
                }, 1000);
            }
        })
    }
    declareWinner(){
        console.log("winner about to be declared")
        this.playingAreas.forEach( area =>{
            area.classList.remove("d-none")
        })
        this.playingAreas[1].innerHTML = `
            <li class="text-center">
                <span class="player player-x ${this.currentPlayer === "O" && "text-light2"}">
                    ${this.currentPlayer}
                </span>
            </li>
            <li class="message text-center">WINNER!</li>
        `
        this.playingAreas[0].classList.add("d-none");
        this.setScore(this.currentPlayer)
    }
    setScore(winner){
        console.log("score board about to be updated")
        if(winner === "X"){
            this.scores.x++;
            this.playerTabs[0].getElementsByTagName("div")[1].textContent = this.scores.x
        }else{
            this.scores.o++;
            this.playerTabs[1].getElementsByTagName("div")[1].textContent = this.scores.o
        }
    }
    endGame(){
        this.gameEnded = true;
        document.getElementById("player-turn-container").innerHTML = "Game Over"
    }
    clearAllBoxes(){
        this.allBoxes.forEach( element =>{
            element.textContent = ""
            element.classList.remove("text-light2")
        })
    }
    setActiveTab(restart = false){
        if(!this.gameEnded){
            this.playerTabs.forEach( tab =>{
                tab.classList.remove("player-tab-active");
            })
            if(restart){
                this.playerTabs[0].classList.add("player-tab-active")
                document.getElementById("player-turn").textContent = "X"
                return;
            }
            if(this.currentPlayer === "X"){
                this.playerTabs[0].classList.add("player-tab-active")
                document.getElementById("player-turn").textContent = "X"
            }else{
                this.playerTabs[1].classList.add("player-tab-active")
                document.getElementById("player-turn").textContent = "O"
            }
        }        
    }
    switchCurrentPlayer(){
        if(!this.gameEnded){
            this.currentPlayer = this.currentPlayer === "X" ? "O" : "X"
        }
        if( this.level !== "Play against a friend" && this.currentPlayer === "O"){
            this.computerTurn = true
            this.computer()
        }
    }
    checkForDraw(){
        let count = 0;
        let drawDeclared = false
        this.allBoxes.forEach( element =>{
            if(element.textContent){
                count++;
            }
        })
        if(count === 9 && !this.gameEnded){
            
            this.endGame();
            setTimeout(() => {
                if(!drawDeclared){
                    this.declareDraw();
                    drawDeclared = true;
                }
            }, 1000);
        }
    }
    declareDraw(){
        this.playingAreas.forEach( area =>{
            area.classList.remove("d-none")
        })
        this.playingAreas[1].innerHTML = `
            <li class="text-center">
                <span class="player player-x">X</span>
                <span class="player player-o">O</span>
            </li>
            <li class="message text-center">DRAW!</li>
        `
        this.playingAreas[0].classList.add("d-none");
    }
    handleClick(el){
        if(el.textContent || this.gameEnded){
            return;
        }
        if(!this.computerTurn){
            el.textContent = this.currentPlayer;
            if(el.textContent === "O"){
                el.classList.add("text-light2")
            }
            this.checkForWinner()
            this.checkForDraw()
            this.switchCurrentPlayer()
            this.setActiveTab()
        }
        document.getElementById("gameLevelIndicator").disabled = true;
    }
    addEventListenerToBoxes() {
        this.allBoxes.forEach(element => {
            element.addEventListener("click", ()=>this.handleClick(element))
        });
    }

    computer(){
        setTimeout(() => {
            if(this.computerTurn){
                if(this.level === "Easy"){
                    this.easy()
                }else if(this.level === "Medium"){
                    this.medium()
                }
                
                this.checkForWinner()
                this.checkForDraw()
                this.switchCurrentPlayer()
                this.setActiveTab()
                this.computerTurn = false;
            }
        }, 500);
    }
    easy(){
        let emptyCells = this.getEmptyCells()
        let randomCellPosition = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        this.allBoxes[randomCellPosition].textContent = "O";
        this.allBoxes[randomCellPosition].classList.add("text-light2");
    }
    medium(){
        let emptyCells = this.getEmptyCells()
        let randomCellPosition = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        let playedTurn = false;
        
        for (let i = 0; i < this.winningCombinations.length; i++) {
            if(this.playerAboutToWin(this.winningCombinations[i]) === "O"){
                console.log("player O is about to win")
                this.winningCombinations[i].forEach(position =>{
                    if(!this.allBoxes[position].textContent){
                        this.allBoxes[position].textContent = "O"
                        this.allBoxes[position].classList.add("text-light2");
                    }
                })
                playedTurn = true
                break;
            }            
        }
        if(!playedTurn){
            for (let i = 0; i < this.winningCombinations.length; i++) {
                if(this.playerAboutToWin(this.winningCombinations[i]) === "X"){
                    console.log("player X is about to win")
                    this.winningCombinations[i].forEach(position =>{
                        if(!this.allBoxes[position].textContent){
                            this.allBoxes[position].textContent = "O"
                            this.allBoxes[position].classList.add("text-light2");
                        }
                    })
                    playedTurn = true
                    break;
                }            
            }
        }
        if(!playedTurn){
            this.allBoxes[randomCellPosition].textContent = "O";
            this.allBoxes[randomCellPosition].classList.add("text-light2");
        }
    }
    playerAboutToWin(array){
        let Xcount = 0
        let Ocount = 0
        array.forEach( position =>{
            if(this.allBoxes[position].textContent === "X"){
                Xcount++
            }
            if(this.allBoxes[position].textContent === "O"){
                Ocount++
            }
        })
        if(Xcount === 2 && Ocount === 0){
            return "X"
        }else if(Ocount === 2 && Xcount === 0){
            return "O"
        }
    }
}

const TicTacToe = new Game();
TicTacToe.start();
