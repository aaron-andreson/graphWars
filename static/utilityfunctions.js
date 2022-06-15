//To try to reduce confusion in this application:
//I have tried to remain consistent in naming the many different moving parts.
//the BOARD is referencing the BOARD variable which keeps track of the cells 'memory'  [[0,1, 'empty'],[0,2, 'base']]
//the map is in reference to what the user sees on the front end.
//bcoord refers to array/BOARD coordinate [y,x] mcoord refers to map coordinate 'y - x'



//Compare [] -> [[],[]] to see if 1 is in other. Due to formula of index only need to compare index's to know if true.
function arrayCompare(array1, array2, checkStyle){
    index = array1[2];
    for (let element of array2){
        if (element[2] === index && checkStyle === 'bool'){
            return true;
        }
        if (element[2] === index && checkStyle === 'index'){
            return array2.indexOf(element);
        }
    }
}

// Choosing a random number. Useful function throughout app.
function randomNum(x) {
    return Math.floor(Math.random() * x)+1
}

//Finding cell easily in BOARD, handy function throughout app, reduces some tedious code.
function findIndex(bCoord){
    index = bCoord[0] * newBoard.width + bCoord[1];
    indexTotal = (newBoard.height) * (newBoard.width);
    if (index <= indexTotal && index >= 0){
        return index;
    }
}







//update both map and board
function updateBoth(bCoord, style, bool){
    newBoard.updateBoard(bCoord, style);
    updateMap(bCoord, style, bool);
}




//removes mcoord class and img, given bCoord
function removeStatus(bCoord){
    newBoard.board[findIndex(bCoord)].pop();
    newBoard.board[findIndex(bCoord)][3] = 'empty';
    let mCoord = findHtmlId(bCoord);
    mCoord.removeAttr('class');
    mCoord.removeAttr('type');
    mCoord.attr('class', 'empty');
    mCoord.empty();
    mCoord.removeAttr('title');
    mCoord.removeAttr('data-original-title')
}

//checks within array for certain array by index. If there removes.
function removeArray(bCoord, array){
    for (let element of array){
        if (element[2] === bCoord[2]){
            array.splice(array.indexOf(element), 1);
        }
    }
}


function returnStyle(bCoord, checkStyle, style){
    const checkArray = coordCheck(bCoord, checkStyle);
    const returnArray = [];
    for (let element of checkArray){;
        if (element[3] === style){
            returnArray.push(element);
        }
    }
    return returnArray;
}

function arrayRun(array, func){
    for (let element of array){
        func(element);
    }
}