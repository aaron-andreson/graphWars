const $playerNum = $('#playerNum');
const $mapSize = $('#mapSize');
const $form2Total = $('#form2')
const $form2Body = $('.form2');
const $form1 = $('#form1');
const newState = new gameState(8);
//RUNNING THIS CODE AT BEGINNING OF WEBSITE LOAD.
$('#tutorials').hide();
$('#settings').hide();
$('#mapPage').hide();
$form2Total.hide();

//Create the color options for player colors in a form for choosing.
const colorForm = function(player){
    const $div = $('<div>');
    $div.attr('class', 'form-group');
    const $label = $('<label>');
    $label.attr('for', `${player}Color`);
    const $select = $('<select>');
    $select.addClass('form-control');
    $select.attr('id', `${player}Color`);
    
    $div.append($label, $select);
    const colorArray = ['red', 'lightblue', 'darkblue', 'gold', 'purple', 'orange'];

    for (let element of colorArray){
        const $option = $('<option>');
        $option.html(element);
        $select.append($option);
    }
    return $div;
}
//Update Key for players, colors and shapes;
function tableHtml(){
    
    for (let player of PLAYERARRAY){
        const $tr = $('<tr>');
        const $td = $('<td>');
        $td.html(`${player.name} shape: <img src="/static/images/${player.shape}"> | Base color: <img src="${player.baseImg}">`);
        $tr.append($td);
        $('#key').append($tr);
    }
}

//Form1 - selection of player number and map size.
$('#select').on('click', function(evt){
    evt.preventDefault();
    $form1.hide();
    $form2Body.empty();
    $form2Total.show();
    $optionsDiv = $('.options');
    $mapSizeVal = $mapSize.val();

    if ($mapSizeVal.length === 0){
        $mapSize.val('Medium');
    }

    $optionsDiv.append(`Map Size: ${$mapSize.val()}, ${$playerNum.val()} Players`);
    
    for (let i = 0; i < parseInt($playerNum.val()); i++){
        const $p = $('<p>');
    
        const $input = $('<input>');
        $input.attr('type', 'text')
        $input.attr('placeholder', `Player ${i + 1} name`);
        $input.attr('id', i);
        

        $form2Body.append($p, $input);
        $form2Body.append(colorForm(i));
    }
})

//Back Button, back to form1
$('#back').on('click', function(evt){
    evt.preventDefault();
    $form1.show();
    $form2Total.hide();
    $optionsDiv.empty();
})

//Form2- Player names, color and creation of map.
$('#create').on('click', function(evt){
    evt.preventDefault();
    $form2Total.hide();
    
    newState.started = true;
    createPlayers();
    newBoard.makeBoard($('#mapSize').val());
    makeHtmlMap();
    drawBaseHtml();
    createTerrain();
    createHtmlColumn();
    tableHtml();
    PLAYERARRAY[0].playerTurn = true;
    $('#mapPage').show();
    $('.navMap').addClass('active');
    $('.homeNav').toggleClass('active');

})

//update options button
$(".dropdown-menu").on("click", function(evt){
    evt.preventDefault()
    $('.display').html($(evt.target).html())
})

//Tutorial options.
$('.list-group').on('click', function(evt){
    evt.preventDefault();


        for (let element of $('.list-group').children()){
            const html = $(element).html()
            if ($(element).html() === $(evt.target).html()){
                $(element).addClass('active');
                $(`.${html}li`).show()
            }
            else{
                $(`.${html}li`).hide()
                $(element).removeClass('active');
            }
        }
})


//KEYBOARD SHORTCUTS
$('body').keypress(function(evt){
    if ($('.navMap').hasClass('active')){
        if (evt.key === 'r'){
            $('.display').html('Remove');
        }
        if (evt.key === 'd'){
            $('.display').html('Deploy');
        }
        if (evt.key === 'g'){
            $('.display').html('General');
        }
        if (evt.key === 'b'){
            $('.display').html('Barracks');
        }
    }
})

$( "#map" ).tooltip({
    items: 'td',
    classes: {
      "ui-tooltip": "highlight"
    },
    content: "Awesome"
  });

//hover effect
$('#map').mouseover(function(evt){
    if ($(evt.target).hasClass('rSoldier')){
        console.log('hit')
        $(evt.target).tooltip();
    }
})


//navBar navigation
$('.navbar').on('click', function(evt){
    evt.preventDefault();
if(newState.started){
    if ($(evt.target).html() === 'Map'){
        $('#tutorials').hide();
        $('#settings').hide();
        $('#mapPage').show();
    }
    if ($(evt.target).html() === 'Settings'){
        $('#mapPage').hide();
        $('#tutorials').hide();
        $('#settings').show();
    }}
    if ($(evt.target).html() === "Tutorials"){
        $('#mapPage').hide();
        $('#settings').hide();
        $('#tutorials').show();
        $(`.Phasesli`).hide()
        $(`.Soldiersli`).hide()
        $(`.Shortcutsli`).hide()
    }
})