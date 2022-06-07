//DOCUMENT READY, RENDER WINDOW, GET MATERIAL INFO
$("document").ready(function () {
  addDisplay();
  getMaterials();
});

//DEFINE ITEM/RESULT ROW AND INDEX VARIABLES
let itemRow =
  (resultRow =
  itemCodeIndex =
  itemNameIndex =
  itemWidthIndex =
  itemThickIndex =
  inputMatIndex =
  remainMatIndex =
  resultQuantityIndex =
  resultLotIndex =
    null);

//PARTICULARS OPENED BY DEFAULT
let headerOpen = false;

//GET ALL TITLE ROWS
let titleRows = document.querySelectorAll(".pq-grid-title-row");

//ASSIGN INPUT MATERIAL ITEM ROW FOR INDEXING
for (let i = 0; i < titleRows.length; i++) {
  if (titleRows[i].children.length == 25) {
    itemRow = titleRows[i].children;
    break;
  }
}

//ASSIGN RESULTED MATERIAL ROW FOR INDEXING
for (let i = 0; i < titleRows.length; i++) {
  if (titleRows[i].children.length > 18 && titleRows[i].children.length < 24) {
    resultRow = titleRows[i].children;
    break;
  }
}

//GET CORRECT COLUMN INDEXES
for (let i = 0; i < itemRow.length; i++) {
  if (itemRow[i].textContent.includes("Item Code") && itemCodeIndex == null) {
    itemCodeIndex = i;
  }
  if (itemRow[i].textContent.includes("Item Name") && itemNameIndex == null) {
    itemNameIndex = i;
  }
  if (itemRow[i].textContent.includes("Width") && itemWidthIndex == null) {
    itemWidthIndex = i;
  }
  if (itemRow[i].textContent.includes("Thick") && itemThickIndex == null) {
    itemThickIndex = i;
  }
  if (
    itemRow[i].textContent.includes("Input Quantity") &&
    inputMatIndex == null
  ) {
    inputMatIndex = i;
  }
  if (
    itemRow[i].textContent.includes("Quantity (Remaining)") &&
    remainMatIndex == null
  ) {
    remainMatIndex = i;
  }
}

for (let i = 0; i < resultRow.length; i++) {
  if (
    resultRow[i].textContent.includes("Finishing Quantity") &&
    resultQuantityIndex == null
  ) {
    resultQuantityIndex = i;
  }
  if (
    resultRow[i].textContent.includes("Lot No/Case No") &&
    resultLotIndex == null
  ) {
    resultLotIndex = i;
  }
}

//HIDE MATERIAL WINDOW
function hideShow() {
  $("#material-display").toggle();
}

//OPEN PRODUCTION PARTICULARS (FIRST PRODUCTION PARTICULAR IS OPEN BY DEFAULT)
function openParticulars() {
  if (!headerOpen) {
    headerOpen = !headerOpen;
    let particulars = document.querySelectorAll(".accordion-header");
    for (let i = 2; i < particulars.length - 1; i++) {
      particulars[i].click();
    }
  }
}

//CALCULATE INPUT MATERIAL QUANTITY
function particularMath(gridRows, i) {
  let input = parseInt(
    gridRows[i].children[inputMatIndex].innerText.replace(/,/g, "")
  );
  let remain = parseInt(
    gridRows[i].children[remainMatIndex].innerText.replace(/,/g, "")
  );
  if (!remain) {
    return input;
  } else {
    return input - remain;
  }
}

function displayMaterials(obj, int, str, color) {
  let arr = Object.entries(obj);
  let table =
    "<table><tr class='data-row' style='font-weight: bold'><td>Material</td><td>Width</td><td >Quantity</td></tr>";
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i][0].slice(0, arr[i][0].indexOf(" WIDTH"));
    let width = arr[i][0].slice(arr[i][0].indexOf(":") + 1);
    table += `<tr class='data-row'><td>${item}</td><td>${width}</td><td>${arr[i][1]}</td></tr>`;
  }
  table += `<tr id="blank-row"><td colspan="3"></td></tr>`;
  table += `<tr class = 'data-row'><td>Finishing Quantity</td><td colspan="2">${int}</td></tr>`;
  table += `<tr id="blank-row"><td colspan="3"></td></tr>`;
  table += `<tr class = 'data-row'><td>Lot List: ${str}</td>`;
  if (color) {
    table += `<td colspan="2">Colors: ${color}</td>`;
  }
  table += `</tr></table>`;

  $("#material-display").append(table);
}

function getMaterials() {
  openParticulars();
  let inputMat = [];
  let matList = {};
  let resultMat = 0;
  let lotList = [];
  let lotRange = "";
  let colors = null;

  let gridRows = document.querySelectorAll(".pq-grid-row");

  //CREATE ARRAY OF ARRAYS CONTAINING UNIQUE IDENTIFIER AND NET INPUT QUANTITY
  for (let i = 0; i < gridRows.length; i++) {
    if (gridRows[i].children.length < 21) continue;
    if (
      !Number.isInteger(parseInt(gridRows[i].children[itemCodeIndex].innerText))
    )
      continue;
    //CREATING UNIQUE IDENTIFIER
    let thickness = "";
    if (parseInt(gridRows[i].children[itemThickIndex].innerText) > 12) {
      thickness =
        " W" + parseInt(gridRows[i].children[itemThickIndex].innerText);
    }
    //WIDTH
    let width =
      " WIDTH:" +
      parseInt(gridRows[i].children[itemWidthIndex].innerText.replace(",", ""));
    //CONCATENATE IDENTIFIER
    let key = gridRows[i].children[itemNameIndex].innerText + thickness + width;
    //NET INPUT QUANTITY
    let mat = particularMath(gridRows, i);
    //ADD ARRAY TO MATERIAL ARRAY
    inputMat.push([key, mat]);
  }

  //SUMMARIZE FINISHED LOTS
  for (let i = 0; i < gridRows.length; i++) {
    if (gridRows[i].children.length < 19 || gridRows[i].children.length > 20)
      continue;
    //SUM UP FINISHED QUANTITIES
    resultMat += parseInt(
      gridRows[i].children[resultQuantityIndex].innerText.replace(",", "")
    );
    lotList.push(gridRows[i].children[resultLotIndex].innerText);
  }

  for (let i = 0; i < inputMat.length; i++) {
    if (!(inputMat[i][0] in matList)) {
      matList[inputMat[i][0]] = 0;
      matList[inputMat[i][0]] += inputMat[i][1];
    } else {
      matList[inputMat[i][0]] += inputMat[i][1];
    }
  }

  //CREATE PRODUCED LOT RANGE FROM WORK ORDER
  if (lotList.length == 1) {
    lotRange = lotList[0];
  } else {
    lotRange = lotList[0] + " - " + lotList[lotList.length - 1];
  }

  //RETURN PRINTING COLORS
  if (document.querySelector("#ChangedCylinderQty").value) {
    colors = document.querySelector("#ChangedCylinderQty").value;
  }

  displayMaterials(matList, resultMat, lotRange, colors);
}

//DEFINE ELEMENTS TO BE RENDERED ON THE PAGE
const materialDisplay = `<div id='material-display'></div><a id ='hideShow'>Hide/Show</a>`;

//RENDER ELEMENTS AND ASSIGN BUTTON CLICKS
function addDisplay() {
  $("body").append(materialDisplay);
  $("#hideShow").click(function () {
    hideShow();
  });
}
