class Game{
    currentPlayer = "X"
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
        alert("Starting")
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
    setGameLevel(level = "Medium"){
        let levelIndicator = document.getElementById("gameLevelIndicator")
        let emptyCells = this.getEmptyCells();
        if(emptyCells.length === 9){
            levelIndicator.textContent = level;
            this.level = level
        }
    }
    checkForWinner(){
        let winnerDeclared = false;
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
            if(restart || this.currentPlayer === "X"){
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
        if(this.currentPlayer === "X" || this.level === "Two Players"){
            el.textContent = this.currentPlayer;
            if(el.textContent === "O"){
                el.classList.add("text-light2")
            }
            this.checkForWinner()
            this.checkForDraw()
            this.switchCurrentPlayer()
            this.setActiveTab()
        }
        if( this.level !== "Two Players" && this.currentPlayer === "O"){
            this.computer()
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
            if(this.level === "Easy"){
                this.easy()
            }else if(this.level === "Medium"){
                this.medium()
            }else if(this.level === "Hard"){
                this.hard()
            }else if(this.level === "Impossible"){
                this.impossible()
            }
            this.checkForWinner()
            this.checkForDraw()
            this.switchCurrentPlayer()
            this.setActiveTab()
        }, 500);
    }
    easy(){
        this.playRandomBox()
    }
    medium(){
        let playedTurn = {value: false};
        
        if(!playedTurn.value){
            this.playTo("win", playedTurn)
        }
        if(!playedTurn.value){
            this.playTo("defend", playedTurn)
        }
        if(!playedTurn.value){
            this.playRandomBox();
        }
    }
    hard(){
        let playedTurn = {value: false};
        let corners = [0, 2, 6, 8]

        if(this.getEmptyCells().length === 8 && this.allBoxes[4].textContent){
            let randomCornerPosition = corners[Math.floor(Math.random() * corners.length)];
            this.allBoxes[randomCornerPosition].textContent = "O"
            this.allBoxes[randomCornerPosition].classList.add("text-light2");
            playedTurn.value = true
        }else if(this.getEmptyCells().length === 8 && !this.allBoxes[4].textContent){
            this.allBoxes[4].textContent = "O"
            this.allBoxes[4].classList.add("text-light2");
            playedTurn.value = true
        }
        if(!playedTurn.value){
            this.playTo("win", playedTurn)
        }
        if(!playedTurn.value){
            this.playTo("defend", playedTurn)
        }
        if(!playedTurn.value){
            this.playRandomBox();
        }
    }

    impossible(){
        let playedTurn = {value: false};
        let dangerousCells = [1, 3, 5, 7]
        let dangerousCombinations = [[1, 3], [3, 7], [7, 5], [5, 1]] ;
        let dangerousCombinationResponses = [0, 6, 8, 2]
        let corners = [0, 2, 6, 8]

        // first play decision process
        if(this.getEmptyCells().length === 8 && this.allBoxes[4].textContent){
            let randomCornerPosition = corners[Math.floor(Math.random() * corners.length)];
            this.allBoxes[randomCornerPosition].textContent = "O"
            this.allBoxes[randomCornerPosition].classList.add("text-light2");
            playedTurn.value = true
        }else if(this.getEmptyCells().length === 8 && !this.allBoxes[4].textContent){
            this.allBoxes[4].textContent = "O"
            this.allBoxes[4].classList.add("text-light2");
            playedTurn.value = true
        }

        //second play decision process
        if(!playedTurn.value && this.getEmptyCells().length === 6 && this.playerAboutToWin().player !== "X") {
            for(let i = 0; i < dangerousCombinations.length; i++){
                let combination = dangerousCombinations[i];
                if(this.allBoxes[combination[0]].textContent === "X" && this.allBoxes[combination[1]].textContent === "X"){
                    this.allBoxes[dangerousCombinationResponses[i]].textContent = "O";
                    this.allBoxes[dangerousCombinationResponses[i]].classList.add("text-light2");
                    playedTurn.value = true
                    break;
                }
            }
            if(!playedTurn.value && this.allBoxes[4].textContent === "O"){
                for (let i = 0; i < dangerousCells.length; i++) {
                    if(!this.allBoxes[dangerousCells[i]].textContent){
                        this.allBoxes[dangerousCells[i]].textContent = "O";
                        this.allBoxes[dangerousCells[i]].classList.add("text-light2");
                        playedTurn.value = true
                        break;
                    }
                }
            }else if(!playedTurn.value && this.allBoxes[4].textContent !== "O"){
                for (let i = 0; i < corners.length; i++) {
                    if(!this.allBoxes[corners[i]].textContent){
                        this.allBoxes[corners[i]].textContent = "O";
                        this.allBoxes[corners[i]].classList.add("text-light2");
                        playedTurn.value = true
                        break;
                    }
                }
            }
        }

        if(!playedTurn.value){
            this.playTo("win", playedTurn)
        }
        if(!playedTurn.value){
            this.playTo("defend", playedTurn)
        }
        if(!playedTurn.value){
            this.playRandomBox();
        }
    }
    playRandomBox(){
        let emptyCells = this.getEmptyCells()
        let randomCellPosition = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        this.allBoxes[randomCellPosition].textContent = "O";
        this.allBoxes[randomCellPosition].classList.add("text-light2");
    }
    playTo(goal, playedTurn) {
        if (this.playerAboutToWin().player === (goal === "win" ? "O" : "X")) {
            //console.log(`player ${this.playerAboutToWin().player} is about to win`)
            this.winningCombinations[this.playerAboutToWin().index].forEach(position => {
                if (!this.allBoxes[position].textContent) {
                    this.allBoxes[position].textContent = "O"
                    this.allBoxes[position].classList.add("text-light2");
                }
            })
            playedTurn.value = true
        }
    }
    playerAboutToWin(){
        let Xcount = 0
        let Ocount = 0
        let OCannotWin = false;
        let playerAboutToWinDetails = { player: null, index: null };
        for (let i = 0; i < this.winningCombinations.length; i++) {
            this.winningCombinations[i].forEach( (position) =>{
                if(this.allBoxes[position].textContent === "X"){
                    Xcount++
                }
                if(this.allBoxes[position].textContent === "O"){
                    Ocount++
                }
            })
            if(!OCannotWin){
                if(Ocount === 2 && Xcount === 0){
                    playerAboutToWinDetails = { player: "O", index: i }
                    break;
                }
                if(i === this.winningCombinations.length -1){
                    // if we have checked all winning combinations for a possible win for O
                    // We restart the loop and set the variable OCannotWin to true
                    // This time the loop will only check for possibility of X winning
                    i = -1
                    OCannotWin = true
                }
            }else{
                if(Xcount === 2 && Ocount === 0){
                    playerAboutToWinDetails = { player: "X", index: i }
                    break;
                }
            }
            Xcount = 0;
            Ocount = 0;
        }
        //console.log(playerAboutToWinDetails)
        return playerAboutToWinDetails
    }
}

const TicTacToe = new Game();
TicTacToe.start();
