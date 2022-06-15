//Creating the 'behind the scenes' memory for the front end. Refered to as BOARD to separate from HtmlMap BOARD[y,x,status]



//This function is useful for labeling cells within the HTML Table
function getCell(x, mapType, player){
    //The first four statements are for labeling base components.
    if (x === 0){
        structure = `base bottom ${player.name}`
        type = 'base'
    }
    if (x === 1){
        structure = `base side ${player.name}`
        type = 'base'
    }
    if (x === 2){
        structure = `base corner ${player.name}`
        type = 'base'
    }
    if (x === 3){
        structure = `base gate ${player.name}`
        type = 'base gate'
        img = '../static/images/gate.png'
    }
    //This statement is for terrain creation.

    for (let bCoord of mapType){
        const cell = document.getElementById(`${bCoord[0]}-${bCoord[1]}`);
        const cellArray = [bCoord[0],bCoord[1]];
        
        if (cell){
            if(validCheck(cellArray, type)){
        const img = $("<img>")
        cell.setAttribute('type', type);
        cell.setAttribute('class', structure);
        if (structure === `base gate ${player.name}`){
        imgUrl = "static/images/gate.png";
        }
        
        if (structure ==='terrain'){
        imgUrl = "static/images/forestterrain.png";}
        
        if(type === 'base'){
        imgUrl = player.baseImg;
        }

        img.attr('src', imgUrl)
        img.appendTo(cell);
        newBoard.updateBoard(bCoord,structure)}}
    }
}