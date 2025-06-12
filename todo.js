// DOM Elements
const taskInput = document.getElementById("taskInput");
const descriptionInput = document.getElementById("descriptionInput");
const dueDateInput = document.getElementById("dueDateInput");
const priorityInput = document.getElementById("priorityInput");
const categoryInput = document.getElementById("categoryInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const statusFilter = document.getElementById("statusFilter");
const sortBy = document.getElementById("sortBy");
const searchInput = document.getElementById("searchInput");

// Task storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Add task to array and localStorage
function addTask() {
  const title = taskInput.value.trim();
  const description = descriptionInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;
  const category = categoryInput.value;

  if (!title) return;

  const newTask = {
    id: Date.now(),
    title,
    description,
    dueDate,
    priority,
    category,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  clearInputs();
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Clear input fields
function clearInputs() {
  taskInput.value = "";
  descriptionInput.value = "";
  dueDateInput.value = "";
  priorityInput.value = "";
  categoryInput.value = "";
  taskInput.focus();
}

// Render task list
function renderTasks() {
  taskList.innerHTML = "";

  let filtered = tasks.filter(task => {
    const statusMatch =
      statusFilter.value === "all" ||
      (statusFilter.value === "completed" && task.completed) ||
      (statusFilter.value === "pending" && !task.completed);

    const searchMatch =
      task.title.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      task.description.toLowerCase().includes(searchInput.value.toLowerCase());

    return statusMatch && searchMatch;
  });

  if (sortBy.value === "priority") {
    const priorityRank = { high: 1, medium: 2, low: 3, "": 4 };
    filtered.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
  } else if (sortBy.value === "dueDate") {
    filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  } else {
    filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  filtered.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "");

    const content = `
      <div>
        <strong>${task.title}</strong> (${task.category || "Uncategorized"})
        <p>${task.description}</p>
        <small>Priority: ${task.priority || "None"} | Due: ${task.dueDate || "No due date"}</small>
      </div>
    `;

    li.innerHTML = content;

    const completeBtn = document.createElement("button");
    completeBtn.textContent = task.completed ? "Undo" : "✅";
    completeBtn.onclick = () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.onclick = () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    };

    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

// Event listeners
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", e => e.key === "Enter" && addTask());
statusFilter.addEventListener("change", renderTasks);
sortBy.addEventListener("change", renderTasks);
searchInput.addEventListener("input", renderTasks);

// Initial render
renderTasks();
