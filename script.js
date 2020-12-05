const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');

// ILista de itens
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');




// Itens
let updatedOnLoad = false;


// Arrays para inicialização
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];



// Função Drag
  let draggedItem;
  let dragging = false;
  let currentColumn;




 
// Pega arrays do localStorage se disponíveis ou seta valores se não houverem
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Terminar Projeto', 'Fazer deploy'];
    progressListArray = ['Curso em progresso', 'Ouvir música'];
    completeListArray = ['Jogar video game', 'Fazer refaturação de código'];
    onHoldListArray = ['Ver documentário'];
  }
}

 

// Leva arrays para  localStorage 
function updateSavedColumns() {
  listArrays = [
    backlogListArray, progressListArray,
    completeListArray, onHoldListArray
  ];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  }); 
}



// Filtra arrays e remove itens vazios
  function filterArray(array){
    const filteredArray = array.filter(item => item !== null);
    return filteredArray;

  }




 
// Cria elementos do DOM para cada lista de elemento
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);

  // Faz o append
  columnEl.appendChild(listEl);

}

 
// Atualiza  as colunas no DOM, reseta o HTML, filtra array e atualiza localStorage
function updateDOM() { 
    if(!updatedOnLoad){
      getSavedColumns();
    }


  // Coluna Backlog  
    backlogList.textContent = '';
    backlogListArray.forEach((backlogItem, index) => {
      createItemEl(backlogList, 0, backlogItem, index);
    })
    backlogListArray = filterArray(backlogListArray);


  // Coluna Progress  
  progressList.textContent = '';
    progressListArray.forEach((progressItem, index) => {
      createItemEl(progressList, 1, progressItem, index);
    })
    progressListArray = filterArray(progressListArray);


  // Coluna Complete 
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  })
  completeListArray = filterArray(completeListArray);

  
  // Coluna On Hold 
  onHoldList.textContent = '';
    onHoldListArray.forEach((onHoldItem, index) => {
      createItemEl(onHoldList, 3, onHoldItem, index);
    })
    onHoldListArray = filterArray(onHoldListArray);



 
  // Procuara por  getSavedColumns  apenas uma vez e atualiza o loacalStorage
    updatedOnLoad = true;
    updateSavedColumns();
}


 
// Atualiza o item, deleta e atualiza os valores do array
  function updateItem(id, column) {
    const selectedArray = listArrays[column];
    const selectedColumnEl = listColumns[column].children;
     if(!dragging){

      if(!selectedColumnEl[id].textContent){
        delete selectedArray[id];
      } else{
        selectedArray[id] = selectedColumnEl[id].textContent;
      }
      updateDOM();
     }
  }


//  Adiciona o item à lista de coluna  
  function addToColumn(column) {
      const itemText = addItems[column].textContent;
      const selectedArray = listArrays[column];
      selectedArray.push(itemText);
      addItems[column].textContent = '';
      updateDOM();
  } 


 
// Mostra itens do input box
  function showInputBox(column){
    addBtns[column].style.visibility = 'hidden';
    saveItemBtns[column].style.display = 'flex';
    addItemContainers[column].style.display = 'flex';
  }


  //  Esconde itens  do input box
  function hideInputBox(column){
    addBtns[column].style.visibility = 'visible';
    saveItemBtns[column].style.display = 'none';
    addItemContainers[column].style.display = 'none';
    addToColumn(column);
  }




 
// Permite que arrays reagam ao pegar e arrastar
  function rebuildArrays(){  
      backlogListArray = Array.from(backlogListEl.children).map(i => i.textContent);
      progressListArray = Array.from(progressListEl.children).map(i => i.textContent);
      completeListArray = Array.from(completeListEl.children).map(i => i.textContent);
      onHoldListArray = Array.from(onHoldListEl.children).map(i => i.textContent);
  
    updateDOM();
  } 


//  permite arrastar o item
function drag(e){
  draggedItem = e.target; 
  dragging = true
}  


//  Permite dropar o item
 function allowDrop(e){
   e.preventDefault();
 }

 // Permite entrar com item na coluna
   function dragEnter(column) {
     listColumns[column].classList.add('over');
     currentColumn = column;
   }

 // Permite dropar item dentro da coluna
 function drop(e){
   e.preventDefault();

   // Remove  a cor e padding do background
     listColumns.forEach((column) => {
       column.classList.remove('over');
     })

     // Adiciona item  à coluna
     const parent =  listColumns[currentColumn];
     parent.appendChild(draggedItem);

     //  Completa ação do arraste
     dragging = false;
     rebuildArrays()
 }


// on Load
updateDOM();

