const addBtn = document.getElementById('add__btn');
const content = document.querySelector('.container');
const col1 = document.querySelector('.col-1');
const col2 = document.querySelector('.col-2');
const col3 = document.querySelector('.col-3');
const addTag = document.querySelectorAll('.add__tag');
let Notes = JSON.parse(localStorage.getItem('notes')) == null ? [] : JSON.parse(localStorage.getItem('notes')); //checks if localStorage exists

let id = Notes.length > 0 ? Notes[Notes.length-1].id+1 : 0; //sets actual id

let colors = [
    [250, 128, 114],
    [152, 251, 152],
    [255, 192, 203],
    [176, 196, 222],
    [240, 230, 140],
    [220, 220, 220] 
]
let color; //sets global color variable
drawNotes() // draws existing notes on the first loading

addBtn.addEventListener('click', () => {
    noteMaker();
});

//creates a note's layout
function noteMaker() {
    let date = new Date();
    let newdate = formatDate(date, 'DD.MM.YY  hh:mm')//formats date
    color = colors[Math.floor(Math.random()*colors.length)]; //gets random color
    let noteObj = createMaketDiv(newdate) //creates html object of a note's layout

    Notes.forEach(note => {
        moveCol(note, 'r'); //moves each note into the next column to make space for a new one
    })

    id++ //increases id
    clearHTML(); //removes an old display
    drawNotes(); //draws a new one
    col1.insertAdjacentHTML('afterbegin', noteObj); //inserts the layout into the first column
}

//creates a note, pushes the note to the Notes
function addNoteToList(id) {
    const note = document.getElementById('note' + id); //gets the current value of the note's layout
    const title = document.getElementById('title' + id); 
    const text = document.getElementById('text' + id);
    const date = document.getElementById('date' + id);

    //creates a note object
    let noteObj = {
        id: id,
        title: title.value,
        text: text.value,
        date: date.innerText,
        column: 'col1',
        color: color,
        tags: []
    }

    //checks if the note's inputs are filled
    if (noteObj.title != '' && noteObj.text != '') {
        Notes.push(noteObj);
        note.remove(); //delets the creating layout
        drawNotes(); //draws the new display
    }
}

//draws display, inserts notes to columns
function drawNotes() {
    clearHTML();
    localStorage.setItem('notes', JSON.stringify(Notes)) //saves Notes to the localStorage
    Notes.forEach(note => {
        let noteObj = createNoteDiv(note); //creates the note's div object
        getColumn(note.column).insertAdjacentHTML('afterbegin', noteObj);//getColumn is used since JSON can't store html-objects
        drawTags(note); //drawing the note's tags
    })
}

//clear all notes before drawing the new ones 
function clearHTML() {
    let notes = Array.from(document.querySelectorAll('.note__box')); //gets all of the notes divs
    notes.forEach(note => {
        note.remove(); //delete a note's div
    })
}

//moves a note to the right or the left column
function moveCol(note, dir) {
    let col = note.column;
    if (dir == 'r') {
        if (col == 'col1') {
            note.column = 'col2';
        }
        if (col == 'col2') {
            note.column = 'col3';
        }
        if (col == 'col3') {
            note.column = 'col1';
        }
    }
    if (dir == 'l') {
        if (col == 'col1') {
            note.column = 'col3';
        }
        if (col == 'col2') {
            note.column = 'col1';
        }
        if (col == 'col3') {
            note.column = 'col2';
        }
    }
}

//deletes note
function delNote(id) { 
    Notes.forEach((note, index) => {
        //search for the needed note
        if (note.id == id) {
            //moves the notes after the deleted one to the left
            for (let i = index - 1; i >= 0; i--) {
                moveCol(Notes[i], 'l');
            }
            Notes.splice(index, 1); //deletes the selected note 
            drawNotes(); //draws a new display
            return
        }
    })
}


function formatDate(date, format) {
    const map = {
        MM: ('0' + (date.getMonth() + 1)).slice(-2), //slice(-2) returns the 2 last digits
        DD: date.getDate(),
        YY: date.getFullYear().toString().slice(-2),
        YYYY: date.getFullYear(),
        hh: ('0' + date.getHours()).slice(-2),
        mm: ('0' + date.getMinutes()).slice(-2)
    }
    return format.replace(/MM|DD|YY|YYYY|hh|mm/gi, matched => map[matched]);
}

//adds a tag
function addNewTag(id){
   let inputTags = Array.from(document.querySelectorAll('.input__tag'));
   //search for the needed note
   inputTags.forEach(input =>{
        if(input.parentElement.id == 'tags'+id){
            //display/hide addTagBtn
            input.classList.toggle('active');
            //if the input is active add the tag on the next click
            if(!input.classList.contains('active')){
                Notes.forEach((note, index)=>{
                    if(note.id == id){
                        Notes[index].tags.push(input.value) //adds tags to the note
                        drawNotes(); //drawing a new display
                        return
                    }
                })
            }
        }
   });
}

function drawTags(note){
    let noteTags = document.getElementById('tags'+note.id); //gets tags container of a note
    let tags = note.tags; //gets the note's tags
    if(noteTags !== null){
        tags.forEach(tag=>{
            const div = document.createElement('div') //tag div
            div.classList='note__tag' 
            div.innerText = '#'+tag 
            noteTags.appendChild(div)
        })
    }
}

//return the needed column
function getColumn(col){
    if(col == 'col1'){
        return col1;
    }
    if(col == 'col2'){
        return col2;
    }
    if(col == 'col3'){
        return col3;
    }
}

function changeNote(event, id){
    let note;
    //search for the needed note
    Notes.forEach(noteObj=>{
        if(noteObj.id == id){
            note = noteObj
        }
    })
    let colorList = getColorList();
    colorList.id = 'colorList'+note.id
    let Title = document.getElementById('title'+note.id)//gets the note's title div
    let Text = document.getElementById('text'+note.id)//gets the note's text div
    let parent = Title.parentElement //gets the parent
    let newTitle = document.createElement('input'); //creates an input for editing
    let newText = document.createElement('textarea');//creates a textarea for editing
    newTitle.classList.add('title__input')
    newTitle.classList.add('note__title')
    newTitle.value = Title.innerText //inserts the current title
    newTitle.id = 'title'+id
    newText.classList.add('text__input')
    newText.classList.add('note__text')
    newText.innerText = Text.innerText //inserts the current text
    newText.id = 'text'+id
    parent.replaceChild(newTitle, Title); //replaces the note's title div by input
    parent.replaceChild(newText, Text); //replaces the note's text div by textarea
    parent.appendChild(colorList)
    let target = event.target.parentElement //gets the edit button
    target.onclick = function(){confirmChanges(id)} //changes the button action   
}

//saves edit changes 
function confirmChanges(id){
    let title = document.getElementById('title'+id) //gets input
    let text = document.getElementById('text'+id)
    //search for the needed note
    Notes.forEach(note=>{
        if(note.id==id){
            note.title = title.value //sets the new note's title 
            note.text = text.value
	    drawNotes(); //drawing a new display
        }  
    })   
}

//creates a colorList
function getColorList(){
    let colorList = document.createElement('div')
    colorList.classList = 'color__list'
    for(let i=0; i<colors.length; i++){
        let colorItem = document.createElement('div')
        colorItem.classList = 'color__item'
        colorItem.onclick = function(){changeColor(event, i)}
        colorItem.style.backgroundColor = 'rgb('+colors[i][0]+','+colors[i][1]+','+colors[i][2] +')'
        colorList.appendChild(colorItem);
    }
    return colorList
}

//changes color on click
function changeColor(e, i){
    let parent = e.target.parentElement
    let noteId = +/\d+/.exec(parent.id) //gets the note's id
    //search for the needed note
    Notes.forEach(note=>{
        if(note.id == noteId){
            note.color = colors[i] //sets the new color
        }
    drawNotes(); //drawing a new display
    })
}


function createNoteDiv(note){
    return ` <div id='note${note.id}' class="note__box" style='background:linear-gradient(225deg, transparent 40px, rgba(${note.color[0]}, ${note.color[1]}, ${note.color[2]}, 1) 0);'>
    <div class='corner' style='background:linear-gradient(225deg, transparent 40px, rgba(${note.color[0]-30}, ${note.color[1]-40}, ${note.color[2]-40}, 1) 0);'></div>
    <div class="container__note">
        <div id='title${note.id}' class="note__title">${note.title}</div>
        <div id='text${note.id}' class="note__text">
            <p>${note.text}</p>
        </div>
        <div id='date${note.id}' class="note__date">${note.date}</div>
        <div class='note__bottom'>    
            <div class="tags__container" id='tags${note.id}'>
            <input type='submit' value='+' class='add__tag' onclick='addNewTag(${note.id})'/>
                <input type='text' class='input__tag' placeholder='#'/>
            </div>
            <div class='note__btns'>
                
                <div class='btn__change'  onclick='changeNote(event, ${note.id})'><img src='./img/2.png'/></div>
                <div class='btn__del'  onclick='delNote(${note.id})'><img src='./img/1.png'/></div>
            </div>
        </div>
    </div>
</div>`
}

function createMaketDiv(newdate){
    return `<div id='note${id}' class='note__box' style='background: rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)'>
    <div class="container__note">
        <input id='title${id}' type='text' class="note__title title__input" placeholder='Title'/>
        <textarea id='text${id}' class="note__text text__input" placeholder='Type your note...'></textarea>
          
        </div>
        <div id='date${id}' class="note__date">${newdate}</div>
        <input type='submit' class="btn_note_add" onclick='addNoteToList(${id})' value='+'>
    </div>
</div>`
}