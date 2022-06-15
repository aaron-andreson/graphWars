// Creating the HTML map of game. HTMl table representing the BOARD.
function makeHtmlMap() {
    const htmlMap = document.querySelector('#map');

    for (let y = 0; y < newBoard.height; y++) {
        const row = document.createElement('tr');
        
        for (let x = 0; x < newBoard.width; x++){
            const cell = document.createElement('td');
            cell.setAttribute('id', `${y}-${x}`);
            cell.setAttribute('class', 'empty');
            cell.setAttribute('y', y);
            cell.setAttribute('x',x);
            //for css to color tr borders correctly
            if (y % 5 == 0){
                row.setAttribute('class', 'color5');
            }
            row.append(cell);
        }
        htmlMap.append(row);
    }
}

//Creating the bases of the teams
function makeHtmlBase() {
    
    
    const a = {id: 'a'};
    const b = {id: 'b'};
    const c = {id: 'c'};
    const d = {id: 'd'};

    let random = randomNum(2);
    let random2= randomNum(2);
    let setup = [[a, b], [c, d]];
    let setup3 = [];
    
    if (PLAYERARRAY.length === 2){
        setup3 = (setup[random-1]);
    }
    else if (PLAYERARRAY.length === 3){
        setup3 = setup[random -1];
        if (random === 2){
            setup2 = setup[0][random2 -1];
            setup3.push(setup2);
        }
        else {
            setup2 = setup[1][random2 -1];
            setup3.push(setup2);
        }
    }
    else {
        setup3 = setup[0];
        setup3.push(setup[1][0], setup[1][1]);
    }
    const finalSetup = [];
    let counter = 0;
    for (let player of PLAYERARRAY){
        
        //'Randomizes' starting side of bases.
        //TO IMPLIMENT better random system for more randomness.
        
        //Makes sure x and y coord aren't to close to edge
        let x = randomNum(newBoard.width);
        let md = 0;

        if (newBoard.size === 'sm'){
            md = 3
        }
        if (newBoard.size === 'med'){

        }
        if (x > newBoard.width - (20-md)){
            x = newBoard.width - (20-md);
        }
        if(x < (10-md)){
            x = (10-md);
        }
        let y = randomNum(newBoard.height);
        if (y > newBoard.height - (15-md)){
            y = newBoard.height - (15-md)
        }
        if (y < (15-md)){
            y = (15-md);
        }
        if (setup3[counter].id === 'a'){
            let y = 0;
            a.bottom = [[y,x+1],[y,x+2],[y,x+3],[y,x+4]];
            a.side = [[y+1,x],[y+2,x],[y+1,x+5],[y+2,x+5]];
            a.corner = [[y,x],[y,x+5],[y+3,x],[y+3,x+5]];
            a.gate = [[y+3,x+1],[y+3,x+4]];
            a.player = player;
            a.base = [a.bottom, a.side, a.corner, a.gate];
            finalSetup.push(a);
        }
        if (setup3[counter].id === 'b'){
            let y = newBoard.height-1;
            b.bottom = [[y,x+1],[y,x+2],[y,x+3],[y,x+4]];
            b.side = [[y-1,x],[y-2,x],[y-1,x+5],[y-2,x+5]];
            b.corner = [[y,x],[y,x+5],[y-3,x],[y-3,x+5]];
            b.gate = [[y-3,x+1],[y-3,x+4]];
            b.player = player;
            b.base = [b.bottom, b.side, b.corner, b.gate];
            finalSetup.push(b);
        }
        if (setup3[counter].id === 'c'){
            let x = 0;
            c.bottom = [[y+1, x],[y+2, x],[y+3, x],[y+4, x]];
            c.side = [[y, x+1],[y, x+2],[y+5, x+1],[y+5, x+2]];
            c.corner = [[y, x],[y+5, x],[y, x+3],[y+5, x+3]];
            c.gate = [[y+1, x+3],[y+4, x+3]];
            c.player = player;
            c.base = [c.bottom, c.side, c.corner, c.gate];
            finalSetup.push(c);
        }
        if (setup3[counter].id === 'd'){
            let x = newBoard.width-1;
            d.bottom = [[y+1, x],[y+2, x],[y+3, x],[y+4, x]];
            d.side = [[y, x-1],[y, x-2],[y+5, x-1],[y+5, x-2]];
            d.corner = [[y, x],[y+5, x],[y, x-3],[y+5, x-3]];
            d.gate = [[y+1, x-3],[y+4, x-3]];
            d.player = player;
            d.base = [d.bottom, d.side, d.corner, d.gate];
            finalSetup.push(d);
        }
        player.base = setup3[counter];
        counter ++;
    }
    
    return finalSetup;
    
}

//creating the base
function drawBaseHtml() {
    const makeBase = makeHtmlBase();


    for (let base of makeBase){
     for (let x=0; x <= 3; x++){
         getCell(x, base.base[x], base.player)
     }
    }
}

//creating the terrain, 
// TO IMPLIMENT: checks to make sure paths still exist between bases
function createTerrain(){
    indexArray = [];
    // terrain quantity
    const terrainQuantity = (randomNum(3))*3;
    //terrain coordinates for CSS
    const terrainSet = [];
    
    for(let i=0; i<=terrainQuantity; i++){
        //indiv terrain size
        const terrainY = randomNum(3)+2;
        const terrainX = randomNum(newBoard.height/5);
        //terrain origin point
        const originY = randomNum(newBoard.height-6) + 1;
        const originX = randomNum(newBoard.width - 6) + 1;
                
                
        for(let ycoord = 0; ycoord <= terrainY; ycoord++){

            for (let j = 0; j <= terrainX; j++){
                let index = findIndex([originY + ycoord, originX + j]);
                    if(validCheck([originY + ycoord, originX + j], 'terrain')){
                        if (!indexArray.includes(index)){
                        terrainSet.push();
                        indexArray.push(index);
                        updateBoth([originY + ycoord, originX +j], 'terrain', true);
                    }
                }
            }
        }
    }
    // getCell(4, terrainSet, 'p');
}

//find the Html mCoord, jQuery
function findHtmlId(bCoord){
    return $(`#${bCoord[0]}-${bCoord[1]}`);
}

//replaces cells class
function updateMap(bCoord, style, bool){
    const $coordId = findHtmlId(bCoord);
    $coordId.attr('class', style);
    if (bool === true){
        let url = '';
        if (pTurn()){
            url = `static/images/${pTurn().shape}`
        }
        if ($coordId.hasClass('terrain')){
            url = "static/images/forestterrain.png"
        }
        imgMap($coordId, bCoord, url);
    }
    return true;
}

//give mcoord class and image, jQuery
function imgMap($mCoord, bCoord, url){
    const img = $("<img>");
    img.attr('src', url);
    img.attr('y', bCoord[0]);
    img.attr('x', bCoord[1]);
    img.appendTo($mCoord);
}

//checks to see if coordinates are valid before adding new class/terrain/soldiers. Checks MAP.
function validCheck(coordinate, type){
    const indexFinder = findIndex(coordinate);
    if (type === "terrain"){
        for(let i = 1; i <= 2; i++){
            if(
                //TODO: I think there is redundancy here, will take a closer look at formula.
            $(`#${coordinate[0] + i}-${coordinate[1]}`).hasClass('base') ||
            $(`#${coordinate[0]}-${coordinate[1] + i}`).hasClass('base') ||
            $(`#${coordinate[0] + i}-${coordinate[1] + i}`).hasClass('base') ||
            $(`#${coordinate[0] - i}-${coordinate[1]}`).hasClass('base') ||
            $(`#${coordinate[0]}-${coordinate[1] - i}`).hasClass('base') ||
            $(`#${coordinate[0] - i}-${coordinate[1] - i}`).hasClass('base') ||
            $(`#${coordinate[0] - 1}-${coordinate[1] + 1}`).hasClass('base') ||
            $(`#${coordinate[0] + 1}-${coordinate[1] - 1}`).hasClass('base') ||
            $(`#${coordinate[0] + i}-${coordinate[1] + 1}`).hasClass('base') ||
            $(`#${coordinate[0] + i}-${coordinate[1] - 1}`).hasClass('base') ||
            $(`#${coordinate[0] + 1}-${coordinate[1] + i}`).hasClass('base') ||
            $(`#${coordinate[0] - 1}-${coordinate[1] + i}`).hasClass('base')
            ){
                return false;
            }
        }
    }
    if (newBoard.board[indexFinder] === undefined){
        return false;
    }
    if(newBoard.board[indexFinder][3] === 'empty'){
        return true;
    }
    else{
        return false;
    }
}
//TODO format this differently to account for when game is two-four players.



