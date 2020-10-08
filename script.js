let gameController = (() => {
    let gamingBoard = [];
    let currentRound = 1;
    let playerCount = 0;
    let boardSize = 3;
    let cellElements = document.getElementsByClassName("cell");

    let _get2DCell = cell => {
        return [Math.floor(cell / boardSize), cell % boardSize];//1D array index translated to 2D
    }
    let _get1DCell = cell2D => {
        return cell2D[0] * boardSize + cell2D[1];
    }

    function _updateHTMLCell(HTMLCell, player) {
        if(player) {
            HTMLCell.querySelector(".cell-content").innerHTML = player.sign === 1 ? "X" : "O";
        } else {
            HTMLCell.querySelector(".cell-content").innerHTML = "";
        }
        
    }

    function _changeCellValue(arr, player) {
        if(!gamingBoard[arr[0]][arr[1]]) {
            gamingBoard[arr[0]][arr[1]] = player.sign;
            _updateHTMLCell(cellElements[_get1DCell(arr)], player);
            currentRound++;
        }
    }

    let createPlayer = (name) => {
        if(playerCount < 3) {
            let obj = Object.create(createPlayer.proto);
            obj.name = name;
            obj.sign = playerCount ? -1 : 1; //1 stands for x for first player
            obj.getName = () => {
                return obj.name;
            }

            playerCount++;
            return obj;
        }
    }
    createPlayer.proto = {

    }
    //creating player objects
    let player1 = createPlayer("Player 1");
    let player2 = createPlayer("Player 2");

    let initializeBoard = () => {
        gamingBoard = [];
        for(let i = 0; i < boardSize; i++) {
            let temp = [];
            for(let j = 0; j < boardSize; j++) temp.push(0);
            gamingBoard.push(temp);
        }
    }
    initializeBoard();

    let restartGame = () => {
        currentRound = 1;
        fader.style.display = "none";
        fader.style.opacity = 0;
        initializeBoard();
        for(let i = 0; i < cellElements.length; i++) {
            _updateHTMLCell(cellElements[i]);                    
        }
    }

    let fader = document.getElementById("congratulations");
    fader.addEventListener("click", restartGame);
    let _checkWin = () => {
        // function "same" checks if all elements of array are the same
        function same(arr) {
            let first = arr[0];
            let checker = true;
            for(let i = 1; i < arr.length; i++) {
                if(arr[i] !== first) checker = false;
            }
            return checker;
        }
        function getCurrentCombinations() {
            let currentCombinations = [];
            let leftDiagonal = [];
            let rightDiagonal = []
            for(let i = 0; i < gamingBoard.length; i++) {
                currentCombinations.push(gamingBoard[i]);
                let horizontalArr = [];
                for(let j = 0; j < gamingBoard.length; j++) {
                    horizontalArr.push(gamingBoard[j][i]);
                }
                currentCombinations.push(horizontalArr);
                leftDiagonal.push(gamingBoard[i][i]);
                rightDiagonal.push(gamingBoard[i][gamingBoard.length - i - 1]);
            }
            currentCombinations.push(leftDiagonal, rightDiagonal);
            return currentCombinations;
        }
        let combinationState = getCurrentCombinations();
        
        combinationState.forEach(e => {
            if(same(e) && e[0] !== 0) {
                let winner = e[0] === 1 ? player1.getName() : player2.getName();
                setTimeout(() => {
                    fader.querySelector("#winner").innerHTML = `The winner is ${winner}`;
                    fader.style.display = "block";
                    fader.style.opacity = 1;
                }, 0)
            }
        })
    }

    let _makeMove = cell => {
        let player = currentRound % 2 ? player1 : player2;
        let currentCell = _get2DCell(cell); 
        _changeCellValue(currentCell, player);
        _checkWin();
    }

    document.addEventListener("click", e => {
        if(e.target.getAttribute("class")) {
            if(e.target.getAttribute("class").includes("cell")) {
            for(let i = 0; i < cellElements.length; i++) {
                if(cellElements[i] === e.target) _makeMove(i);
            }
        }}
    })

    let getBoard = () => {
        console.log(gamingBoard);
    }

    return {
        getBoard
    }
})()