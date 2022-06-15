
function validateSoldier(bCoord, checkType){
    let arrayReturn = [];
    let $mapCoord = findHtmlId(bCoord);
    if (checkType === 'soldierStart'){
        if (pTurn().base.id === "c" || pTurn().base.id === "d"){
            arrayReturn = coordCheck(bCoord, 'vertical')
        }
        else{
            arrayReturn = coordCheck(bCoord, 'horizontal');
        }
    }

    if (checkType === 'soldierAdd'){
        arrayReturn = coordCheck(bCoord, 'cross');
    }

    if (checkType === 'resourceGathering'){
        arrayReturn = coordCheck(bCoord, 'surround')
    }
    
    if(checkType === 'soldierCheck'){
        arrayReturn = coordCheck(bCoord, 'surround')
    }

    for (let bYX of arrayReturn){
            // TO IMPLIMENT putting disconnected soldiers back into validpath after reconnecting them in turn.
            // if (checkCoord[3] === pTurn()){
            //     soldierPath();
            // }
        if (!$mapCoord.hasClass(`rSoldier ${pTurn().name}`)){
            if (findIndex(bYX) >= 0 && !arrayCompare(bCoord, pTurn().loss, 'bool')){
                if(bYX[3] === `base gate ${pTurn().name}` && checkType === 'soldierStart'){
                    bCoord.push(findIndex(bCoord));
                    pTurn().soldierArray.push(bCoord);
                    pTurn().validPath.push(bCoord);
                    pTurn().soldierPrime.push(bCoord);
                    return true;

                    
                }
            
                if(arrayCompare(bYX, pTurn().validPath, 'bool') && checkType === 'soldierAdd'){
                    bCoord.push(findIndex(bCoord));
                    pTurn().validPath.push(bCoord);
                    pTurn().soldierArray.push(bCoord);
                    return true;
                }

            }}
    }
}

//placing soldiers TO REVISE: scale down redundant code.
function createSoldier(bCoord){
    let bool = 0;
    if (newBoard.board[findIndex(bCoord)][3] === 'empty'){
        if (validateSoldier(bCoord, 'soldierStart')){
                bool = 1;
        }
        if (pTurn().soldierCount > 0 && bool === 0){
            if (validateSoldier(bCoord, 'soldierAdd')){
            bool = 1;
            }
        }
    
        if (bool === 1){
        pTurn().soldierCount ++;
        pTurn().turnPoints --;
        //give coord class and img on Map and board
        updateMap(bCoord, pTurn().soldierCall, true);
        newBoard.updateBoard(bCoord, pTurn());
        //gathering resources
        resArray = returnStyle(bCoord, 'surround', 'terrain');
        for (let element of resArray){
            if (!newBoard.terrainRes.includes(findIndex(element))){
            newBoard.terrainRes.push(findIndex(element))}
        }
        
        
        newBoard.turnRecap.push(newBoard.board[findIndex(bCoord)]);
        pTurn().turnMoves.push(newBoard.board[findIndex(bCoord)]);
    }
    } 
    
}

//Runs at end of turn. Checks to see if enemy soldiers to be removed.
function soldierCheck(){
    for (let soldier of pTurn().soldierArray){
        //coordCheck returns array of valid points that soldier touching.
        let crossArray = coordCheck(soldier, 'cross');
        for (let coord of crossArray){
            //if coord in checked array is a soldier but not the main players ...continue
            if (findHtmlId(coord).hasClass('soldier') && newBoard.board[coord[2]][3] !== pTurn()){
                //if returned number is >= 2 remove soldier from map
                if (returnNumber(coord, 'cross', pTurn(), 'counter') >= 2){
                    //get player of soldier to be removed
                    const enemyPlayer = newBoard.board[coord[2]][3];
                    //add to turn recap to highlight in red.
                    const newCoord = [...coord];
                    newBoard.turnRecap.push(newCoord);
                    //add to turn loss for next turn.
                    enemyPlayer.loss.push(coord);
                    //remove from their array
                    removeArray(coord, enemyPlayer.soldierArray);
                    //remove from map & BOARD and update to empty
                    removeStatus(coord);

                }

            }
        }
    }
        
}



//Checks to see if soldier is 'connected' to base/barracks. Runs at beginning of turn.
function soldierPath(){
    //Not repeat same indexed coords
    let indexArray = [];
    //Build array for valid path
    let pathArray = [];
    //Start the path at base/barracks of player
    for (let prime of pTurn().soldierPrime){
        //start array with first coord
         indexArray.push(prime[2]);
         //find soldiers that connect to prime, haven't been counted yet, add to arrays
         let soldierConnect = returnStyle(prime, 'cross', pTurn());
         for (let element of soldierConnect){
            if (!indexArray.includes(element[2])){ 
                indexArray.push(element[2])
                pathArray.push(element)
            }
         }
    }
    //Check cross squares and if pTurn then put in valid path array. Ignore if not.
    for (let element of pathArray){
        //if soldier of pTurn and not added already then add to arrays, 
        let soldierConnect = returnStyle(element, 'cross', pTurn());
        for (let element of soldierConnect){
            if (!indexArray.includes(element[2])){ 
                indexArray.push(element[2])
                pathArray.push(element)
            }
         }
    }
    //If soldier not on valid path, validSoldier won't place soldier.
    pTurn().validPath = pathArray;
}

//Take back the last action. TO IMPLIMENT feature that allows taking back valid actions from entire turn.
function takeBackMove(boardCoord){
   if (arrayCompare(boardCoord, pTurn().turnMoves, 'index') === pTurn().turnMoves.length - 1){
        removeStatus(boardCoord);
        pTurn().turnMoves.pop();
        removeArray(boardCoord, pTurn().soldierArray);
        pTurn().soldierCount --;
        pTurn().turnPoints ++;
   }
}