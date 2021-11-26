class Game{
    currentPlayer = "X"
    scores = {
        x: 0,
        o: 0
    }
    gameEnded = false;
    winningCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    allBoxes = Array.from(document.getElementsByClassName('boxes'));
    playerTabs = Array.from(document.getElementsByClassName("player-tab"));
    playingAreas = Array.from(document.getElementsByClassName("playing-area"));

    start(){
        this.addEventListenerToBoxes()
        document.getElementById("restart-btn").addEventListener("click", ()=>this.restart())
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
    }
    checkForWinner(){
        this.winningCombinations.forEach( member =>{
            if(this.allBoxes[member[0]].textContent === this.currentPlayer && 
                this.allBoxes[member[1]].textContent === this.currentPlayer && 
                this.allBoxes[member[2]].textContent === this.currentPlayer)
            {
                this.declareWinner()
                this.endGame()
            }
        })
    }
    declareWinner(){
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
    }
    checkForDraw(){
        let count = 0;
        this.allBoxes.forEach( element =>{
            if(element.textContent){
                count++;
            }
        })
        if(count === 9 && !this.gameEnded){
            this.declareDraw();
            this.endGame();
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
        el.textContent = this.currentPlayer;
        if(el.textContent === "O"){
            el.classList.add("text-light2")
        }
        this.checkForWinner()
        this.checkForDraw()
        this.switchCurrentPlayer()
        this.setActiveTab()
    }
    addEventListenerToBoxes() {
        this.allBoxes.forEach(element => {
            element.addEventListener("click", ()=>this.handleClick(element))
        });
    }
}

const TicTacToe = new Game();
TicTacToe.start();
