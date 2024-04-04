const form = document.querySelector("#form");
const taskInput = document.querySelector("#input");
const toDoList = document.querySelector(".to-do-container");
const clearCompletedBtn = document.querySelector(".clear-btn");
const itemsCount = document.querySelector(".score");
const allBtn = document.querySelector("#all");
const activeBtn = document.querySelector('#active');
const completedBtn = document.querySelector('#completed');

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));  
  tasks.forEach((task) => renderTask(task));
};

form.addEventListener("submit", addTask);
toDoList.addEventListener("click", deleteTask);
toDoList.addEventListener("click", completedTask);
toDoList.addEventListener("click", taskCount);
clearCompletedBtn.addEventListener("click", clearCompleted);

allBtn.addEventListener('click', filterTodos);
activeBtn.addEventListener('click', filterTodos);
completedBtn.addEventListener('click', filterTodos);

function addTask(e) {
  e.preventDefault();
  const taskText = taskInput.value;
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };
  tasks.push(newTask);
  renderTask(newTask);
  taskInput.value = ""; 
  saveToLocalStorage();
};

function deleteTask(e) {
  if(e.target.dataset.action !== "delete") return;
  const parentNode = e.target.closest(".list");
  const id = Number(parentNode.id);
  tasks = tasks.filter((task) => task.id !== id);
  saveToLocalStorage();
  parentNode.remove();
}

function completedTask(e) {
  if (e.target.dataset.action !== "done") return;
  const parentNode = e.target.closest(".list");
  const id = Number(parentNode.id);
  const task = tasks.find((task) => task.id === id);
  task.done = !task.done;
  saveToLocalStorage();
  const toDoTask = parentNode.querySelector(".to-do-task");
  toDoTask.classList.toggle("complete-task"); 
}

function renderTask(task) {
  const cssClass = task.done ? 'to-do-task complete-task' : 'to-do-task';
  const taskHTML = `<li id="${task.id}" class="list" draggable="true">
                  <label for="text"></label>
                  <input class="checkbox" ${task.done ? "checked" : ""} type="checkbox" name="text" data-action="done">
                  <span class="${cssClass}" name="text">${task.text}</span>
                  <button class="delete-task" data-action="delete" type="button"></button>
                  </li>`;
  toDoList.insertAdjacentHTML('afterbegin', taskHTML);
  taskCount();
}

function taskCount() {
  const incompleteTasksCount = tasks.filter((task) => !task.done).length;
  const taskString = incompleteTasksCount === 1 ? "item" : "items";
  itemsCount.innerText = `${incompleteTasksCount} ${taskString} left`;
}

function clearCompleted() {
  tasks = tasks.filter((task) => !task.done);
  const removed = document.querySelectorAll('.list input[type="checkbox"]:checked');
  removed.forEach((task) => {
    removeItems(task.closest(".list"))
  })
  saveToLocalStorage();
}

function removeItems(item){
  item.remove();
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function filterTodos(e) {
  const filter = e.target.id; 
  const todoItems = document.querySelectorAll('.list'); 

  allBtn.classList.remove('active');
  activeBtn.classList.remove('active');
  completedBtn.classList.remove('active');

  todoItems.forEach((item) => {
    if (filter === 'all') {
      item.style.display = 'flex';
      allBtn.classList.add('active');
    } else if (filter === 'active') {
      const checkbox = item.querySelector('.checkbox');
      if (!checkbox.checked) {
        item.style.display = 'flex'; 
        activeBtn.classList.add('active');
      } else {
        item.style.display = 'none'; 
      }
    } else if (filter === 'completed') {
      const checkbox = item.querySelector('.checkbox');
      if (checkbox.checked) {
        item.style.display = 'flex'; 
        completedBtn.classList.add('active');
      } else {
        item.style.display = 'none'; 
      }
    }
  });
}

//Drag and Drop
const draggables = document.querySelectorAll(".list")
draggables.forEach(draggable => {
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add('dragging')
  })

  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging')
  })
})

toDoList.addEventListener('dragover', e => {
  e.preventDefault();
  const afterElement = getDragAfterElement(toDoList, e.clientY)
  const draggable = document.querySelector('.dragging')
  if (afterElement == null) {
    toDoList.appendChild(draggable)
  } else {
    toDoList.insertBefore(draggable, afterElement)
  }
})

function getDragAfterElement(toDoList, y) {
  const draggableElements = [...toDoList.querySelectorAll(".list:not(.dragging)")];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child }
    } else {
      return closest
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;  
}
