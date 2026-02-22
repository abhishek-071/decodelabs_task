if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "login.html";
}
document.addEventListener("DOMContentLoaded", function() {
  // Load tasks
  loadTasks();

  // Update counter
  updateTaskCount();

  // Load dark mode if enabled
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }
});

function addTask() {
  const input = document.getElementById("taskInput");
  const taskText = input.value.trim();

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const task = {
    text: taskText,
    completed: false
  };

  saveTask(task);
  updateTaskCount();
  renderTask(task);

  input.value = "";
}

function renderTask(task) {
  const li = document.createElement("li");

  li.innerHTML = `
    <span class="${task.completed ? 'completed' : ''}">
      ${task.text}
    </span>
    <div class="actions">
      <button onclick="toggleTask(this)">✔</button>
      <button onclick="editTask(this)">✏</button>
      <button class="delete-btn" onclick="deleteTask(this)">✖</button>
    </div>
  `;

  document.getElementById("taskList").appendChild(li);
}

function saveTask(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => renderTask(task));
  updateTaskCount();
}

function deleteTask(button) {
  const li = button.parentElement.parentElement;
  const text = li.querySelector("span").innerText;

  li.remove();
  updateStorage(text, "delete");
}

function toggleTask(button) {
  const span = button.parentElement.parentElement.querySelector("span");
  span.classList.toggle("completed");

  updateStorage(span.innerText, "toggle");
}

function editTask(button) {
  const span = button.parentElement.parentElement.querySelector("span");
  const newText = prompt("Edit your task:", span.innerText);

  if (newText !== null && newText.trim() !== "") {
    updateStorage(span.innerText, "edit", newText);
    span.innerText = newText;
  }
}

function updateStorage(text, action, newText = null) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks = tasks.map(task => {
    if (task.text === text) {
      if (action === "delete") return null;
      if (action === "toggle") task.completed = !task.completed;
      if (action === "edit") task.text = newText;
    }
    return task;
  }).filter(task => task !== null);

  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateTaskCount();
}
function filterTasks(type) {
  const tasks = document.querySelectorAll("#taskList li");
  let visibleCount = 0;

  tasks.forEach(task => {
    const isCompleted = task.querySelector("span").classList.contains("completed");

    if (type === "all") {
      task.style.display = "flex";
      visibleCount++;
    } 
    else if (type === "active") {
      if (!isCompleted) {
        task.style.display = "flex";
        visibleCount++;
      } else {
        task.style.display = "none";
      }
    } 
    else if (type === "completed") {
      if (isCompleted) {
        task.style.display = "flex";
        visibleCount++;
      } else {
        task.style.display = "none";
      }
    }
  });

  document.getElementById("taskCount").innerText =
    visibleCount + " " + type.charAt(0).toUpperCase() + type.slice(1) + " Tasks";
}
function updateTaskCount() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  document.getElementById("taskCount").innerText = tasks.length + " Tasks";
}
function openSettings() {
  document.getElementById("settingsModal").style.display = "flex";
}

function closeSettings() {
  document.getElementById("settingsModal").style.display = "none";
}

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}

function clearAllTasks() {
  localStorage.removeItem("tasks");
  document.getElementById("taskList").innerHTML = "";
  updateTaskCount();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}
function setActive(element) {
  document.querySelectorAll(".sidebar li").forEach(li => {
    li.classList.remove("active");
  });
  element.classList.add("active");
}

function goToTasks(element) {
  setActive(element);
  document.getElementById("taskInput").focus();
}