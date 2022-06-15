const PLAYERARRAY = [];

class Player{
    constructor(name, shape, playerTurn, soldierCall, url){
    this.name = name;
    this.number = PLAYERARRAY.length;
    this.shape = shape;
    this.soldierCount = 0;
    this.resourceCount = 0;
    this.soldierArray = [];
    this.soldierCall = soldierCall
    this.playerTurn = playerTurn;
    this.turnPoints = 15;
    this.soldierPrime = [];
    this.validPath = [];
    this.baseImg = url
    this.turnMoves = [];
    this.loss = [];
    }
}

class gameState{
    constructor(timer){
        this.round = 0;
        this.timer = timer;
        this.turnPhase = 0;
        this.started = false;
    }
}

class gameBoard{
    constructor(){
        this.board = [];
        this.terrainRes = [];
        this.turnRecap = [];

    }
    makeBoard = function(sizing){
        if (sizing[0] === 'Small'){
            newBoard.height = 25;
            newBoard.width = 35;
            newBoard.size = 'sm'
        }

        if (sizing[0] === 'Medium'){
            newBoard.height = 30;
            newBoard.width = 45;
            newBoard.size = 'med'
        }
        if (sizing[0] ==='Large'){
            newBoard.height = 40;
            newBoard.width = 60;
            newBoard.size = 'lg'
        }


       for (let y = 0; y < this.height; y++){
            for(let x=0; x < this.width; x++){
                let coord = [];
                coord = [y, x, findIndex([y,x]),'empty'];
                this.board.push(coord); 
            }
    
        }
    }
    updateBoard = function(bCoord, status){
        let index = findIndex(bCoord);
        this.board[index].pop();
        this.board[index].push(status);
        return true;
    }
}

const newBoard = new gameBoard();