const HUMAN_MARK = 1;
const COMPUTER_MARK = 5;
const DISPLAY_HUMAN_MARK = "background-color:blue"
const DISPLAY_COMPUTER_MARK = "background-color:red"
const HUMAN_WINNING_SCORE = HUMAN_MARK * 3;
const COMPUTER_WINNING_SCORE = COMPUTER_MARK * 3;
const HORIZONTAL_OFFSET_FROM_MIDDLE = 1;
const HORIZONTAL_OFFSET_FROM_END = 2;
const VERTICAL_OFFSET_FROM_MIDDLE = 3;
const VERTICAL_OFFSET_FROM_END = 6;
const MIDDLE_SQUARE = 4;
let mark_tracker = Array(9).fill(null);
let _quadrant = ``;
let _header_text = document.querySelector("#header");
let container = document.querySelector(".container");
console.log('QUERY SELECTOR --> ', container)
let tac_toe = 'white';
// console.log('offsetWidth --> ',container.offsetWidth)
// console.log('offsetHeight --> ',container.offsetHeight)
let _quadrant_box_width = container.offsetWidth / 3;
let _quadrant_box_height = container.offsetHeight / 3;
for (let i=0; i<9; i++){
    if(i % 2 == 0) { 
        tac_toe = 'darkgrey' 
    } else tac_toe = 'lightgrey'
    _quadrant += `<canvas class="quadrant" id="quad_${i}" width="${_quadrant_box_width}" height="${_quadrant_box_height}" style="background-color:${tac_toe}"></canvas>`;

}

container.innerHTML = _quadrant;

addEventListenersToGameGrid();

function addEventListenersToGameGrid(){
    for (let i=0; i<9; i++){
        let quad_box = document.querySelector(`#quad_${i}`);
        // console.log(quad_box)
        quad_box.addEventListener("mouseover", mouseOverFunction)
        quad_box.addEventListener("click", clickFunction)
        quad_box.addEventListener("mouseout", mouseOutFunction)
    }
    
}

function mouseOverFunction(e){
    // console.log("mouse over at ", e.target);
    _header_text.innerHTML = "Are You sure?";
}

/*
if (isSquareEmpty) {
    1. add mark to display
    2. add mark to array tracker (backend)
    3. check for winning placement
    4. if (!isGameWon) {
        computer makes selection
    }
}
*/
function clickFunction(e){
    // console.log('e --> ', e.path[0].id.substring(5));
    let mark_tracker_index = e.path[0].id.substring(5);
    if (isSquareEmpty(mark_tracker_index)) {
        _header_text.innerHTML = "CLICKED!!";

        e.path[0].style = DISPLAY_HUMAN_MARK
        mark_tracker[mark_tracker_index] = HUMAN_MARK;
        if (isGameWon(mark_tracker_index)) {
            console.log("+++++++++++ WINNER +++++++++++");
            _header_text.innerHTML = "You are a WINNER!"
            clearEventListenersFromGameGrid();
            // remove eventListeners from the game grid
        } else {
            // computer makes the move
            if (mark_tracker.includes(null)){
                let arrayOfEmptySquares = []
                let computer_index = 0;
                
                mark_tracker.forEach((value, index) => {
                    if (value == null) {arrayOfEmptySquares.push(index)}
                    console.log('computer valid index choices --> ', arrayOfEmptySquares)
                })
                // always get middle square
                if (arrayOfEmptySquares.includes(MIDDLE_SQUARE)) {
                    computer_index = MIDDLE_SQUARE;
                } else {
                    // do some calculations to determine best defensive or offensive move
                    computer_index = arrayOfEmptySquares[Math.floor(Math.random() * arrayOfEmptySquares.length)];
                    checkForWinningSum(computer_index);
                }
                document.querySelector('#quad_'+computer_index).style = DISPLAY_COMPUTER_MARK
                mark_tracker[computer_index] = COMPUTER_MARK;

                // check for computer win
                if (isGameWon(computer_index)) {
                    console.log('COMPUTER WINS')
                    _header_text.innerHTML = "The computer WINS."

                    // remove eventListeners from the game grid
                    clearEventListenersFromGameGrid();
                }
            } else {
                console.log('CAT GAME');
                _header_text.innerHTML = "It's a TIE game."
                clearEventListenersFromGameGrid();
            }
        }
    }

    // console.log("mouse click!");
}

function clearEventListenersFromGameGrid(){
    for (let i=0; i<9; i++){
        let quad_box = document.querySelector(`#quad_${i}`);
        // console.log(quad_box)
        quad_box.removeEventListener("click", clickFunction);
        quad_box.removeEventListener("mouseover", mouseOverFunction)
        quad_box.removeEventListener("mouseout", mouseOutFunction)
    }
    
}
function mouseOutFunction(){
    // console.log("mouse out!");
    _header_text.innerHTML = "TIC TAC TOE";
}

function isSquareEmpty(index){
    if (mark_tracker[index] == null) return true;
    return false;
}

function isGameWon(index){
    index *= 1;
    let game_state_is_won = false;

    // horizontal
    game_state_is_won = checkHorizontalRow(index)
    if (game_state_is_won) return game_state_is_won
    
    // vertical
    game_state_is_won = checkVerticalColumn(index)
    if (game_state_is_won) return game_state_is_won

    // diagonal
    game_state_is_won = checkDiagonalLines(index)
    return game_state_is_won
}

function checkForWinningSum(left_or_top_box, mid_offset, end_box_offset){
    let score_array = [mark_tracker[left_or_top_box], mark_tracker[left_or_top_box+mid_offset], mark_tracker[left_or_top_box+end_box_offset]]
    let winning_sum = 0;
    // this could be adapted?
    // if score_array.includes(null) && score_array sum == HUMAN_WINNING_SCORE (3) - 1 [i.e. 2], then return the box id of the null location
    if (score_array.includes(null)) {
        console.log("score_array ==> ", score_array)
        let isElementNull = (element) => element == null;
        let indexOfNull = score_array.findIndex(isElementNull);
        if (indexOfNull != -1) {

        }
        console.log("We have a null in our score array at ", indexOfNull)
    }
    
    if (!score_array.includes(null)) {
        score_array.forEach(value => winning_sum += value);
    }
    return (winning_sum == HUMAN_WINNING_SCORE || winning_sum == COMPUTER_WINNING_SCORE)
}

function checkHorizontalRow(index){
    let foundHorizontalWin = false;
    let left_box = 0
    if (index % 3 == 0) { 
        left_box = index;
        } else if (index == 1 || index == 4 || index == 7) {
            left_box = index - HORIZONTAL_OFFSET_FROM_MIDDLE;
        } else {
            left_box = index - HORIZONTAL_OFFSET_FROM_END;
        }
        foundHorizontalWin = checkForWinningSum(left_box, HORIZONTAL_OFFSET_FROM_MIDDLE, HORIZONTAL_OFFSET_FROM_END)
    return foundHorizontalWin;
}

function checkVerticalColumn(index){
    let foundVerticalWin = false;
    let top_box = 0;
    if (index < 3){
        top_box = index;
    } else if (index < 6) {
        top_box = index - VERTICAL_OFFSET_FROM_MIDDLE;
        } else {
            top_box = index - VERTICAL_OFFSET_FROM_END;
        }
        foundVerticalWin = checkForWinningSum(top_box, VERTICAL_OFFSET_FROM_MIDDLE, VERTICAL_OFFSET_FROM_END)
    return foundVerticalWin;
}

function checkDiagonalLines(index){
    let foundDiagonalWin = false;

    let top_left_corner = 0;
    let middle_square_offset_from_left = 4;
    let bottom_right_corner_offset = 8;

    let top_right_corner = 2;
    let middle_square_offset_from_right = 2;
    let bottom_left_corner_offset = 4;
    switch (index % 2) {
        case 0:
            if (checkForWinningSum(top_left_corner, middle_square_offset_from_left, bottom_right_corner_offset)) { 
                foundDiagonalWin = true;
                break; 
            } 
            else {
                foundDiagonalWin = checkForWinningSum(top_right_corner, middle_square_offset_from_right, bottom_left_corner_offset);
                break;
            }
        default:
            break;
    }
    return foundDiagonalWin;
}