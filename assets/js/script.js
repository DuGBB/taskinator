var taskIdCounter = 0;
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasks = [];

var taskFormHandler = function (event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }

  formEl.reset();

  var isEdit = formEl.hasAttribute("data-task-id");
  console.log("I am editing:   " + isEdit);

  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  } else {
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to-do",
    };

    createTaskEl(taskDataObj);
  }
};

var createTaskEl = function (taskDataObj) {
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  listItemEl.setAttribute("data-task-id", taskIdCounter);

  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML =
    "<h3 class='task-name'>" +
    taskDataObj.name +
    "</h3><span class='task-type'>" +
    taskDataObj.type +
    "</span>";
  listItemEl.appendChild(taskInfoEl);

  var taskActionEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionEl);

  tasksToDoEl.appendChild(listItemEl);

  console.log(taskDataObj);
  console.log(taskDataObj.status);

  taskDataObj.id = taskIdCounter;
  console.log(taskDataObj);
  console.log(tasks);
  tasks.push(taskDataObj);

  saveTasks();

  taskIdCounter++;
};

// create a new task
formEl.addEventListener("submit", taskFormHandler);

var createTaskActions = function (taskId) {
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(editButtonEl);

  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(deleteButtonEl);

  var statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(statusSelectEl);
  var statusChoices = ["To Do", "In Progress", "Completed"];
  for (var i = 0; i < statusChoices.length; i++) {
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);

    statusSelectEl.appendChild(statusOptionEl);
  }

  return actionContainerEl;
};

var completeEditTask = function (taskName, taskType, taskId) {
  console.log("in completeEditTask:  " + taskName, taskType, taskId);
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  }

  saveTasks();

  alert("Task Updated!");

  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";
};

var taskButtonHandler = function (event) {
  var targetEl = event.target;
  console.log("Inside Edit button event handler");
  if (targetEl.matches(".edit-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  } else if (targetEl.matches(".delete-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

var editTask = function (taskId) {
  console.log("editing task #" + taskId);

  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  console.log(taskName);

  var taskType = taskSelected.querySelector("span.task-type").textContent;
  console.log(taskType);

  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;

  document.querySelector("#save-task").textContent = "Save Task";

  formEl.setAttribute("data-task-id", taskId);
};

var deleteTask = function (taskId) {
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );
  taskSelected.remove();

  var updatedTaskArr = [];

  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  }
  tasks = updatedTaskArr;

  saveTasks();
};

//pageContentEl.addEventListener("change", taskStatusChangeHandler)

var taskStatusChangeHandler = function (event) {
  var taskId = event.target.getAttribute("data-task-id");

  var statusValue = event.target.value.toLowerCase();

  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } else if (statusValue === "in progress") {
    console.log(taskSelected);
    console.log(tasksInProgressEl);
    tasksInProgressEl.appendChild(taskSelected);
  } else if (statusValue === "completed") {
    console.log(taskSelected);
    console.log(tasksCompletedEl);
    tasksCompletedEl.appendChild(taskSelected);
  }

  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
    console.log(tasks);
  }
  saveTasks();
};

var saveTasks = function () {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

//1. Gets task items form loccalStorage
//2. Converts tasks from the string format back into an array of objects.
//3. Iterates through a tasks array and creates task elements on the page from it.
var loadTasks = function () {
  console.log("FU");
  tasks = localStorage.getItem("tasks");
  //console.log('FU TOO');
  console.log(tasks);
  if (!tasks) {
    tasks = [];
    return false;
  }
  console.log(tasks);
  tasks = JSON.parse(tasks);
  for (var i = 0; i < tasks.length; i++) {
    console.log(tasks[i]);
    tasks[i].id = taskIdCounter;
    console.log(tasks[i]);

    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    listItemEl.setAttribute("data-task-id", tasks[i].id);
    console.log(listItemEl);
  }
};
loadTasks();

pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
