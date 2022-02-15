const twoWaySystemCombinations = [
    [0,6,8,3,7],
    [3,6,7,0,8],
    [0,6,7,3,8],
    [3,6,8,0,7],
    [0,2,8,1,5],
    [1,2,5,0,8],
    [1,2,8,0,5],
    [0,2,5,1,8],
    [2,0,6,1,3],
    [1,0,6,2,3],
    [1,0,3,2,6],
    [2,0,3,1,6],
    [2,8,6,5,7],
    [2,8,7,5,6],
    [5,8,7,2,6],
    [5,8,6,2,7],
    [4,6,8,0,2],
    [4,6,8,2,7],
    [4,6,8,0,7], 
    [2,4,5,3,8],
    [2,4,5,6,8],
    [2,4,5,3,6],
    [1,4,5,3,7],
    [4,5,7,3,7],
    [4,5,8,2,3],
    [4,5,8,0,3],
    [1,3,4,5,7],
    [0,3,4,6,8],
    [0,3,4,5,6],
    [3,4,7,1,5],
    [4,6,7,0,8],
    [4,6,7,2,8],
    [4,6,7,8,1],
    [1,7,6,8,4],
    [4,7,8,6,1],
    [1,7,8,4,6],
    [0,2,4,6,8],
    [0,2,4,1,8],
    [0,2,4,1,6],
    [2,4,8,0,6],
    [2,4,8,5,6],
    [2,4,8,0,5],
    [0,4,6,2,8],
    [0,4,6,3,8],
    [0,4,6,2,3],
]
class Game{
    currentPlayer = "X"
    previousStarter = "O";
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
    restartBtn = document.getElementById("restart-btn");
    levelBtn = document.getElementById("gameLevelIndicator");
    playerCountDown; 
    winningCombinationIndicator = document.getElementById("winningCombinationIndicator");
    winningCombinationIndex; //To know which of the combinations the player won in
    winningCombinationIndicatorClasses = [
        'winningCombination0', 'winningCombination1', 'winningCombination2', 'winningCombination3', 'winningCombination4', 'winningCombination5', 'winningCombination6', 'winningCombination7', 'playerOIndicator', 'playerXIndicator'
    ]
    computerIsPlaying = false;

    start(){
        this.addEventListenerToBoxes();
        document.getElementById("clearScores").addEventListener("click", ()=>this.clearScores())
        this.restartBtn.addEventListener("click", ()=>this.restart());
        this.setGameLevel();
    }
    restart(){
        this.gameEnded = false;
        this.currentPlayer = this.previousStarter === "X" ? "O" : "X";
        this.previousStarter = this.currentPlayer;
        console.log(this.currentPlayer);
        this.setActiveTab()
        if(this.currentPlayer === "O"){
            this.handleClick();
        }
        this.clearAllBoxes();
        this.setActiveTab(true);
        this.playingAreas.forEach( area =>{
            area.classList.remove("d-none")
        })
        this.playingAreas[1].classList.add("d-none");
        this.removeCountdown();
        this.removeCombinationIndicator()
        this.winningCombinationIndicator.classList.add('d-none')
    }
    clearScores(){
        this.scores = {x:0, o:0};
        this.playerTabs[0].getElementsByTagName("div")[1].textContent = this.scores.x
        this.playerTabs[1].getElementsByTagName("div")[1].textContent = this.scores.o
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
    setGameLevel(level = "intermediate"){
        this.levelBtn.textContent = level;
        this.level = level
        this.restart()
    }
    checkForWinner(){
        let winnerDeclared = false;
        this.winningCombinations.forEach( (combination, index) =>{
            if(this.allBoxes[combination[0]].textContent === this.currentPlayer && 
                this.allBoxes[combination[1]].textContent === this.currentPlayer && 
                this.allBoxes[combination[2]].textContent === this.currentPlayer)
            {
                this.endGame(
                    this.currentPlayer === "X" ? "You Win" : "Computer Wins"
                )
                this.restartBtn.disabled = true
                this.levelBtn.disabled = true
                this.winningCombinationIndex = index
                this.setCombinationIndicator()
                setTimeout(() => {
                    if(!winnerDeclared){
                        this.declareWinner()
                        winnerDeclared = true;
                        this.restartBtn.disabled = false
                        this.levelBtn.disabled = false
                    }
                }, 1500);
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
    setCombinationIndicator(){
        this.winningCombinationIndicator.classList.remove('d-none')
        console.log(this.winningCombinationIndex)
        this.winningCombinationIndicator.classList.add(`winningCombination${this.winningCombinationIndex}`)
        this.winningCombinationIndicator.classList.add(`player${this.currentPlayer}Indicator`)
        console.log(this.winningCombinationIndicator)
    }
    removeCombinationIndicator(){
        this.winningCombinationIndicatorClasses.forEach( classname =>{
            this.winningCombinationIndicator.classList.remove(classname)
        })
        this.winningCombinationIndicator.classList.add('d-none');
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
    endGame(message = "Game Over"){
        this.gameEnded = true;
        document.getElementById("player-turn-container").innerHTML = message
        this.removeCountdown()
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
            if(this.currentPlayer === "X"){
                this.playerTabs[0].classList.add("player-tab-active")
                document.getElementById("player-turn-container").innerHTML = `<span id='player-turn'>${this.currentPlayer === "X" ? "Your" : "Computer"}</span> <span class='text-secondary'>Turn</span>`
            }else{
                this.playerTabs[1].classList.add("player-tab-active")
                document.getElementById("player-turn-container").innerHTML = `<span id='player-turn'>${this.currentPlayer === "X" ? "Your" : "Computer"}</span> <span class='text-secondary'>Turn</span>`
            }
        }        
    }
    switchCurrentPlayer(){
        if(!this.gameEnded){
            this.currentPlayer = this.currentPlayer === "X" ? "O" : "X"
        }
        if(this.currentPlayer === "X"){
            this.setCountdown()
        }
    }
    setCountdown(){
        let count;
        if(this.level === "beginner"){
            count = 10
        }else if(this.level === "intermediate"){
            count = 7
        }else{
            count = 5
        }
        let countDownDiv = document.getElementById("countdownDiv");
        let countDown = document.getElementById("countdown");
        countDown.textContent = count;
        countDownDiv.classList.remove("d-none");
        this.playerCountDown = setInterval(() => {
            countDown.textContent = --count;
            //count--
            if(count < 0){
                clearInterval(this.playerCountDown);
                this.switchCurrentPlayer()
                this.endGame("Your time has run out 😬");
                this.declareWinner();
            }
        }, 1000);
    }
    removeCountdown(){
        let countDownDiv = document.getElementById("countdownDiv");
        let countDown = document.getElementById("countdown");
        countDown.textContent = "5"
        countDownDiv.classList.add("d-none");
        clearInterval(this.playerCountDown);
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
            this.restartBtn.disabled = true
            this.levelBtn.disabled = true
            setTimeout(() => {
                if(!drawDeclared){
                    this.declareDraw();
                    drawDeclared = true;
                    this.restartBtn.disabled = false
                    this.levelBtn.disabled = false
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
    handleClick(el = false){
        if(el?.textContent || this.gameEnded){
            return;
        }
        else if(this.currentPlayer === "X" || this.level === "two players"){
            el.textContent = this.currentPlayer;
            if(el.textContent === "O"){
                el.classList.add("text-light2")
            }
            this.checkForWinner()
            this.checkForDraw()
            this.switchCurrentPlayer()
            this.setActiveTab()
            this.removeCountdown()
        }
        if(this.level !== "two players" && this.currentPlayer === "O"){
            if(!this.computerIsPlaying){
                this.computer()
            }
        }
    }
    addEventListenerToBoxes() {
        this.allBoxes.forEach(element => {
            element.addEventListener("click", ()=>this.handleClick(element))
        });
    }

    computer(){
        this.computerIsPlaying = true;
        setTimeout(() => {
            if(this.level === "beginner"){
                this.beginner()
            }else if(this.level === "intermediate"){
                this.intermediate()
            }else if(this.level === "professional"){
                this.professional()
            }
            this.checkForWinner()
            this.checkForDraw()
            this.switchCurrentPlayer()
            this.setActiveTab()
            this.computerIsPlaying = false;
        }, 500);
    }
    beginner(){
        this.playRandomBox()
    }
    intermediate(){
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
            this.playTo("attack", playedTurn)
        }
        if(!playedTurn.value){
            this.playRandomBox();
        }
    }

    professional(){
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
                        console.log('this is the case handled')
                        if(dangerousCells[i] === 1 && this.allBoxes[7].textContent){
                            console.log('this condition is true')
                            continue;
                        }else{
                            this.allBoxes[dangerousCells[i]].textContent = "O";
                            this.allBoxes[dangerousCells[i]].classList.add("text-light2");
                            playedTurn.value = true
                            break;
                        }
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
            this.playTo("attack", playedTurn)
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
        if(goal === "attack"){
            console.log("checking for possibility of two-way-combo");
            for (let i = 0; i < twoWaySystemCombinations.length; i++) {
                let combo = twoWaySystemCombinations[i];
                if(!this.allBoxes[combo[3]].textContent && !this.allBoxes[combo[4]].textContent){
                    //console.log(`box ${combo[3]} and box ${combo[4]} are free`)
                    let firstThreePositions = combo.slice(0, 3);
                    let emptyPositions = [];
                    let positionsOccupiedByComputer = []
                    firstThreePositions.forEach( (position, index ) =>{
                        if(!this.allBoxes[position].textContent){
                            emptyPositions.push(position)
                        }else if(this.allBoxes[position].textContent === "O"){
                            positionsOccupiedByComputer.push(position)
                        }
                    })
                    if(emptyPositions.length === 1 && positionsOccupiedByComputer.length === 2){
                        console.log("created a two-way-system")
                        this.allBoxes[emptyPositions[0]].textContent = "O";
                        this.allBoxes[emptyPositions[0]].classList.add("text-light2");
                        playedTurn.value = true;
                        break;
                    }
                }                
            }
        }else if (this.playerAboutToWin().player === (goal === "win" ? "O" : "X")) {
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
        return playerAboutToWinDetails
    }
}

const TicTacToe = new Game();
TicTacToe.start();
