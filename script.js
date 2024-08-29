const priorityColors = {
  low: "lightgreen",
  medium: "lightyellow",
  high: "lightcoral",
};

const priorityOptions = ["low", "medium", "high"];

document.addEventListener("DOMContentLoaded", () => {
  loadTasksFromLocalStorage();

  document.getElementById("add-task-btn").addEventListener("click", () => {
    const text = document.getElementById("task-input").value;
    const priority = document.getElementById("task-priority").value;
    const dueDate = document.getElementById("task-due-date").value;

    if (text) {
      const task = {
        id: Date.now(), // Unique identifier for the task
        text: text,
        priority: priority,
        dueDate: dueDate, // Include due date
        completed: false,
      };

      saveTaskToLocalStorage(task);
      renderTask(task);

      // Clear input fields after adding task
      document.getElementById("task-input").value = "";
      document.getElementById("task-priority").value = "low";
      document.getElementById("task-due-date").value = "";
    }
  });
});

function saveTaskToLocalStorage(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => renderTask(task));
}

function renderTask(task) {
  const listItem = document.createElement("li");
  listItem.setAttribute("data-id", task.id); // Store the unique id in the li element

  listItem.style.backgroundColor = priorityColors[task.priority] || "#f9f9f9";

  const taskText = document.createElement("span");
  taskText.textContent = task.text;

  const dueDateText = document.createElement("span");
  dueDateText.textContent = task.dueDate ? `Due: ${task.dueDate}` : "";
  dueDateText.style.marginLeft = "10px";
  dueDateText.style.fontStyle = "italic"; // Optional styling

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "edit";
  editBtn.style.marginLeft = "5px";
  editBtn.addEventListener("click", () => {
    showEditModal(task, listItem);
  });

  const completeBtn = document.createElement("button");
  completeBtn.textContent = "Complete";
  completeBtn.className = "complete";
  completeBtn.style.marginLeft = "5px";
  completeBtn.addEventListener("click", () => {
    task.completed = !task.completed;
    listItem.classList.toggle("completed");
    updateLocalStorage();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete";
  deleteBtn.style.marginLeft = "5px";
  deleteBtn.addEventListener("click", () => {
    listItem.remove();
    deleteTaskFromLocalStorage(task.id);
  });

  listItem.appendChild(taskText);
  listItem.appendChild(dueDateText); // Append due date to list item
  listItem.appendChild(editBtn);
  listItem.appendChild(completeBtn);
  listItem.appendChild(deleteBtn);

  document.getElementById("task-list").appendChild(listItem);
}

function showEditModal(task, listItem) {
  document.getElementById("edit-task-text").value = task.text;
  document.getElementById("edit-task-priority").value = task.priority;
  document.getElementById("edit-task-due-date").value = task.dueDate;

  document.getElementById("save-edit-btn").onclick = () => {
    const newText = document.getElementById("edit-task-text").value;
    const newPriority = document.getElementById("edit-task-priority").value;
    const newDueDate = document.getElementById("edit-task-due-date").value;

    if (newText) {
      task.text = newText;
      task.priority = newPriority;
      task.dueDate = newDueDate; // Update due date

      // Update UI
      listItem.querySelector("span").textContent = newText;
      listItem.querySelector("span").nextSibling.textContent = newDueDate
        ? `Due: ${newDueDate}`
        : ""; // Update due date in UI
      listItem.style.backgroundColor = priorityColors[newPriority] || "#f9f9f9";

      updateLocalStorage();
      hideEditModal();
    }
  };

  document.getElementById("cancel-edit-btn").onclick = () => {
    hideEditModal();
  };

  document.getElementById("edit-task-modal").style.display = "block";
}

function hideEditModal() {
  document.getElementById("edit-task-modal").style.display = "none";
}

function updateLocalStorage() {
  const tasks = Array.from(document.querySelectorAll("li")).map((li) => {
    const taskText = li.querySelector("span").textContent;
    const priority = Object.keys(priorityColors).find(
      (color) => priorityColors[color] === li.style.backgroundColor,
    );
    const completed = li.classList.contains("completed");
    const dueDate = li.querySelector("span").nextSibling
      ? li.querySelector("span").nextSibling.textContent.replace("Due: ", "")
      : ""; // Get due date
    const id = parseInt(li.getAttribute("data-id")); // Ensure the id is parsed as an integer
    return {
      id: id,
      text: taskText,
      priority: priority || "low",
      dueDate: dueDate,
      completed: completed,
    };
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTaskFromLocalStorage(taskId) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((task) => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
