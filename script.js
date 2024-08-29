// Get the buttons from html

const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

// Listener for user clicks

addTaskBtn.addEventListener("click", addTask);

//Load tasks
loadTasksFromLocalStorage();

// Task priority
const prioritySelect = document.getElementById("task-priority");

// Due date
const dueDateInput = document.getElementById("task-due-date");

// Add task
function addTask() {
  const taskText = taskInput.value;
  const taskPriority = prioritySelect.value;
  const taskDueDate = dueDateInput.value;

  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  const task = {
    text: taskText,
    completed: false,
    priority: taskPriority,
    dueDate: taskDueDate,
  };
  saveTaskToLocalStorage(task);

  renderTask(task);

  taskInput.value = "";
  dueDateInput.value = "";
}

// Save task to the browser
function saveTaskToLocalStorage(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from browser
function loadTasksFromLocalStorage() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    renderTask(task);
  });
}

// Rendering the loaded tasks on screen
function renderTask(task) {
  const listItem = document.createElement("li");
  listItem.textContent = task.text;

  if (task.completed) {
    listItem.classList.add("completed");
  }

  // Display due date
  if (task.dueDate) {
    const dueDateSpan = document.createElement("span");
    dueDateSpan.textContent = ` (Due: ${task.dueDate})`;
    dueDateSpan.style.marginLeft = "10px";
    listItem.appendChild(dueDateSpan);
  }

  // Apply priority styles
  switch (task.priority) {
    case "high":
      listItem.style.color = "red";
      break;
    case "medium":
      listItem.style.color = "orange";
      break;
    case "low":
      listItem.style.color = "green";
      break;
  }

  // Add edit button
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.style.marginRight = "10px";
  editBtn.addEventListener("click", () => {
    const newTaskText = prompt("Edit task:", task.text);
    if (newTaskText !== null && newTaskText.trim() !== "") {
      task.text = newTaskText.trim();
      listItem.firstChild.textContent = task.text;
      updateLocalStorage();
    }
  });

  // Add complete button
  const completeBtn = document.createElement("button");
  completeBtn.textContent = "Complete";
  completeBtn.style.marginRight = "10px";
  completeBtn.addEventListener("click", () => {
    task.completed = !task.completed;
    listItem.classList.toggle("completed");
    updateLocalStorage();
  });

  // Add delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => {
    taskList.removeChild(listItem);
    deleteTaskFromLocalStorage(task);
  });

  listItem.appendChild(editBtn);
  listItem.appendChild(completeBtn);
  listItem.appendChild(deleteBtn);
  taskList.appendChild(listItem);
}

// Update saved tasks
function updateLocalStorage() {
  let tasks = [];
  taskList.childNodes.forEach((listItem) => {
    tasks.push({
      text: listItem.textContent.replace("CompleteDelete", "").trim(),
      completed: listItem.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Delete task
function deleteTaskFromLocalStorage(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((t) => t.text !== task.text);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
