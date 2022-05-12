
$('document').ready(function(){
    addDisplay()
    getMaterials()
});

//DEFINE ITEM ROW AND INDEX VARIABLES
let itemRow = itemCodeIndex = itemNameIndex = itemWidthIndex = itemThickIndex = inputMatIndex = remainMatIndex = null


//PARTICULARS OPENED BY DEFAULT
let headerOpen = false;

//GET ALL TITLE ROWS
let titleRows = document.querySelectorAll('.pq-grid-title-row')

//ASSIGN ITEM ROW FOR INDEXING
for (let i = 0; i < titleRows.length; i++){
    if(titleRows[i].children.length == 25) {
        itemRow = titleRows[i].children;
        break;
    }
}

//GET CORRECT COLUMN INDEXES
for(let i = 0; i < itemRow.length; i++){
    if(itemRow[i].textContent.includes('Item Code') && itemCodeIndex == null) {
        itemCodeIndex = i;
    }
    if(itemRow[i].textContent.includes('Item Name') && itemNameIndex == null) {
        itemNameIndex = i;
    }
    if(itemRow[i].textContent.includes('Width') && itemWidthIndex == null) {
        itemWidthIndex = i;
    }
    if(itemRow[i].textContent.includes('Thick') && itemThickIndex == null) {
        itemThickIndex = i;
    }
    if(itemRow[i].textContent.includes('Input Quantity') && inputMatIndex == null) {
        inputMatIndex = i;
    }
    if(itemRow[i].textContent.includes('Quantity (Remaining)') && remainMatIndex == null) {
        remainMatIndex = i;
    }
}

//HIDE MATERIAL WINDOW
function hideShow(){
    $('#material-display').toggle()
}

//CLICK FIRST PRODUCTION LINK
// function openProd (){
//     let prodTag = $("a[href='/upone/MF/Production']")
//     prodTag[0].click()
// }

//OPEN PRODUCTION PARTICULARS (FIRST PRODUCTION PARTICULAR IS OPEN BY DEFAULT)
function openParticulars() {
    if(!headerOpen) {
        headerOpen = !headerOpen;
        let particulars = document.querySelectorAll('.accordion-header')
        for(let i = 2; i < particulars.length-1; i++){
            particulars[i].click();
        }
    }
}

//CALCULATE INPUT MATERIAL QUANTITY
function particularMath(gridRows,i){
    let input = parseInt(gridRows[i].children[inputMatIndex].innerText.replace(/,/g,''))
    let remain = parseInt(gridRows[i].children[remainMatIndex].innerText.replace(/,/g,''))
    if(!remain){
        return input
    } else {
        return input - remain
    }
}

function displayMaterials(obj) {
    let arr = Object.entries(obj)
    let table = "<table border='1'><tr><td style='font-weight: bold'>Material</td><td style='font-weight: bold'>Width</td><td style='font-weight: bold'>Quantity</td></tr>"
        for(let i = 0; i < arr.length; i++) {
            let item = arr[i][0].slice(0,arr[i][0].indexOf(' WIDTH'))
            let width = arr[i][0].slice(arr[i][0].indexOf(':')+1)
            table +=    `
                        <tr><td>${item}</td><td>${width}</td><td>${arr[i][1]}</td></tr>
                        `
        }
    table += "</table>"
    $('#material-display').append(table)
}

function getMaterials(){
    openParticulars()
    let inputMat = [];
    let matList = {};

    let gridRows = document.querySelectorAll('.pq-grid-row')

    //CREATE ARRAY OF ARRAYS CONTAINING UNIQUE IDENTIFIER AND NET INPUT QUANTITY
    for(let i = 0; i < gridRows.length; i++) {
        if(gridRows[i].children.length < 21) continue;
        if(!Number.isInteger(parseInt(gridRows[i].children[itemCodeIndex].innerText))) continue;
        //CREATING UNIQUE IDENTIFIER
        let thickness = "";
        if(parseInt(gridRows[i].children[itemThickIndex].innerText) > 12) {
            thickness = " W" + parseInt(gridRows[i].children[itemThickIndex].innerText)
        }
        //WIDTH
        let width = ' WIDTH:' + parseInt(gridRows[i].children[itemWidthIndex].innerText)
        //CONCATENATE IDENTIFIER
        let key = gridRows[i].children[itemNameIndex].innerText + thickness + width
        //NET INPUT QUANTITY
        let mat = particularMath(gridRows,i)
        //ADD ARRAY TO MATERIAL ARRAY
        inputMat.push([key,mat])
    }

    for(let i = 0; i < inputMat.length; i++) {
        //add array inputMat items to matList object
        if(!(inputMat[i][0] in matList)) {
            matList[inputMat[i][0]] = 0;
            matList[inputMat[i][0]] += inputMat[i][1]
        } else {
            matList[inputMat[i][0]] += inputMat[i][1]
        }
        
    }

    console.log(Object.entries(matList))

    displayMaterials(matList);
}


//DEFINE ELEMENTS TO BE RENDERED ON THE PAGE
const materialDisplay = `<div id='material-display'></div><a id ='hideShow'>Hide/Show</a>`

//RENDER ELEMENTS AND ASSIGN BUTTON CLICKS
function addDisplay() {
    $('body').append(materialDisplay)
    $('#hideShow').click(function(){
        hideShow()
    })
}


