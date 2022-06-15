//To try to reduce confusion in this application:
//I have tried to remain consistent in naming the many different moving parts.
//the BOARD is referencing the BOARD variable which keeps track of the cells 'memory'  [[0,1, 'empty'],[0,2, 'base']]
//the map is in reference to what the user sees on the front end.
//bcoord refers to array/BOARD coordinate [y,x] mcoord refers to map coordinate 'y - x'


//TIMER function
//p0 scouting/ p2 deploy/ p1 recap
setInterval(function(){
    if (newState.started === true){
//if end scout...
    if (newState.round === 0 && newState.turnPhase === 0 && newState.timer === 0){
        $('#phase').html('Deploy')
        newState.turnPhase = 2;
        newState.timer = 27;
        newState.round ++;
        updateHtmlColumn();
    }
//if end recap...
    if (newState.turnPhase === 1 && newState.timer === 0){
        newState.turnPhase = 2;
        newState.timer = 27;
        recapClass();
        newBoard.turnRecap = [];
        if (pTurn() === PLAYERARRAY[PLAYERARRAY.length -1]){
            newState.round ++;
        }
        changeTurn();
        soldierLoss();
        updateHtmlColumn();
        
        $('#phase').html('Deploy');
    }

//if end deployment...
    if (newState.turnPhase === 2 && newState.timer === 0){
        endTurn();
        newState.turnPhase = 1;
        newState.timer = 7;
        $('#phase').html('Recap');
    }


    if (newState.timer > 0){
        newState.timer --;
        $('#timer').html(`Timer: ${newState.timer}`);
    }
}}, 1000)


//Gets the player whose turn it is.
const pTurn = function(){
   for (let i = 0; i< PLAYERARRAY.length; i++){
       if (PLAYERARRAY[i].playerTurn === true){
           return PLAYERARRAY[i];
       }}
}

//TO REVISIT. The terrain creation might be moved to use this function. Reducing redundancy
function coordCheck(coordinate, checkStyle){
    let checkArray = [];
    let arrayCopy = [];
    let x = 1;
    let i = 1;

    const downi= [coordinate[0] + i, coordinate[1]];
    const upi=[coordinate[0] - i, coordinate[1]];
    const lefti=[coordinate[0], coordinate[1] - i];
    const righti=[coordinate[0], coordinate[1] + i];
    const diagUpiLeftx=[coordinate[0] - i, coordinate[1] - x];
    const diagUpiRightx=[coordinate[0] - i, coordinate[1] + x];
    const diagDowniRightx=[coordinate[0] + i, coordinate[1] + x];
    const diagDowniLeftx=[coordinate[0] + i, coordinate[1] - x];
    const diagUpxLefti=[coordinate[0] - x, coordinate[1] - i];
    const diagUpxRighti=[coordinate[0] - x, coordinate[1] + i];
    const diagDownxRighti=[coordinate[0] + x, coordinate[1] + i];
    const diagDownxLefti=[coordinate[0] + x, coordinate[1] - i];

    

    const cross = [downi,upi,lefti,righti];
    if (checkStyle === 'cross'){
        arrayCopy = cross;
    }
    const horizontal = [lefti, righti];
    if (checkStyle === 'horizontal'){
        arrayCopy = horizontal;
    }
    const vertical = [downi, upi];
    if (checkStyle === 'vertical'){
        arrayCopy = vertical;
    }
    const surround = [downi,upi,lefti,righti,diagUpiLeftx, diagUpiRightx, diagDowniLeftx, diagDowniRightx];
    if (checkStyle === 'surround'){
        arrayCopy = surround
    }
    for (let element of arrayCopy){
        if (findIndex(element) >= 0 && findIndex(element) <= newBoard.height * newBoard.width){
            checkArray.push(newBoard.board[findIndex(element)]);
        }
    }
    return checkArray;
}

//return the number of times, by count or array, something is surrounded by desired type.
function returnNumber(bCoord, checkStyle, checkType){
    coordChecker = coordCheck(bCoord, checkStyle);
    counter = 0;
        for (let coords of coordChecker){
                if (coords[3] === checkType){
                    counter ++;
                }
        }
    return counter;
}  


function resourceCheck(){
    for (let i = newBoard.terrainRes.length - 1; i >= 0; i --){
        let terrainCoords = newBoard.terrainRes[i];
        let counter = returnNumber(newBoard.board[terrainCoords], 'surround', pTurn());
        if (counter >= 3){
            newCoord = [...newBoard.board[terrainCoords]]
            newBoard.turnRecap.push(newCoord);
            newBoard.terrainRes.splice(i,1);
            removeStatus(newBoard.board[terrainCoords]);
            pTurn().resourceCount ++;
            
         }
    }
}  
//Runs at end of turn. Gives cells that have changed since beginning of turn a class to style them.
function recapClass(){
    for (let element of newBoard.turnRecap){
        let style = "";
        const $coordId = findHtmlId(element);
        //soldiers placed this turn
        if (element[3] === pTurn()){
            style = 'sRecap'
        }
        //terrain removed this turn
        else if (element[3] === 'terrain'){
           style = 'tRecap'
        }
        else if ($coordId.hasClass('empty')){
            style = 'eRecap'
        }
        $coordId.toggleClass(style);
    }
}

//Runs at begininng of turn. styles map cell to show where soldiers where lost from/ valid and invalid moves.
function soldierLoss(){
    for (let player of PLAYERARRAY){
        let url = '';
        let title = `${player.name}`;
        if (player.playerTurn === true){
            url = '/static/images/playerlost.png'
        }
        else {
            url = '/static/images/enemylost.png'
        }
        if (player.loss.length >= 1){
        for (let coord of player.loss){
            removeStatus(coord);
            const $coordId = findHtmlId(coord);
            $coordId.addClass(`rSoldier ${player.name}`);
            $coordId.attr('title', title);
            imgMap($coordId, coord, url);
        }}
    }
}




//changes turn to next player in row.
function changeTurn(){
   
    let index = 0;
    (pTurn().number + 1 < PLAYERARRAY.length)?index=pTurn().number+1:index=0;
    pTurn().playerTurn = false;
    PLAYERARRAY[index].playerTurn = true;
    PLAYERARRAY[index].turnPoints = 15;
    soldierPath();

}

//creates column with all current players.
function createHtmlColumn(){
    const $htmlColumn = $('#info');
    for (let player of PLAYERARRAY){
        const $h4a = $("<h4></h4>");
        $h4a.attr('id', `${player.name}sold`);
        $h4a.html(`${player.name} soldiers: ${player.soldierCount}`);
        $htmlColumn.append($h4a);
        const $h4b = $("<h4></h4>");
        $h4b.attr('id', `${player.name}res`);
        $h4b.html(`${player.name} resources: ${player.resourceCount}`);
        $htmlColumn.append($h4b);
    }
}

//updates the right column after 'finalize' button is pressed.
function updateHtmlColumn(){
    $('#turnHtml').html(`${pTurn().name}`);
    $(`#turnPoints`).html(`Turn points: ${pTurn().turnPoints}/15`)
    for (let player of PLAYERARRAY){
    $(`#${player.name}sold`).html(`${player.name} soldiers: ${player.soldierCount}`);
    $(`#${player.name}res`).html(`${player.name} resources: ${player.resourceCount}`);
    
    $('#round').html(`Round ${newState.round}`);}
}


//Creating the players.
function createPlayers(){
    const shapeArray = ['square1.png', 'circle1.png', 'starmark.png', 'xmark.png'];
    const colorObj = {
        lightblue   : 'static/images/skybluebase25.png',
        darkblue   : 'static/images/bluebase25.png',
        orange : 'static/images/orangebase25.png',
        purple : 'static/images/purplebase25.png',
        red    : 'static/images/redbase25.png',
        gold  : 'static/images/goldbase25.png'

    }
    for (let i = 0; i < $('#playerNum').val(); i++){
        
        const newPlayer = new Player($(`#${i}`).val(), shapeArray[i], false, `soldier p${i+1}`, colorObj[$(`#${i}Color`).val()]);
        PLAYERARRAY.push(newPlayer);
    }
}


function endTurn(){
    $('.display').html('Deploy');
    resourceCheck();
    soldierCheck();
    arrayRun(pTurn().loss, removeStatus);
    pTurn().turnMoves = [];
    pTurn().loss = [];
    updateHtmlColumn();
    recapClass();
}



//Clicking on the graph
$("#map").on("click", "td", function(evt){
        cY = parseInt(evt.target.getAttribute('y'));
        cX = parseInt(evt.target.getAttribute('x'));
        cYX = [cY, cX];
        boardCoord = newBoard.board[findIndex(cYX)];

        if(pTurn().turnPoints > 0 && $('.display').html() === 'Deploy' && newState.turnPhase === 2){
            createSoldier(cYX);
        }
        if($('.display').html() === 'Remove' && newState.turnPhase === 2){
            takeBackMove(boardCoord);
        }
        updateHtmlColumn();
})



$('.finalize').on('click', function(evt){
    
    //TO IMPLEMENT: Warning if player has not used all move points
    if (newState.turnPhase === 2){
        $('#phase').html('Recap')
        newState.timer = 0;
    }
    
        
})