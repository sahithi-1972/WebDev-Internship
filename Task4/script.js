const taskInput =
document.getElementById("taskInput");

const taskDate =
document.getElementById("taskDate");

const taskTime =
document.getElementById("taskTime");

const taskPriority =
document.getElementById("taskPriority");

const addTaskBtn =
document.getElementById("addTask");

const taskList =
document.getElementById("taskList");

const totalTasks =
document.getElementById("totalTasks");

const completedTasks =
document.getElementById("completedTasks");

const pendingTasks =
document.getElementById("pendingTasks");

const filters =
document.querySelectorAll(".filter");

let currentFilter = "all";

let tasks =
JSON.parse(
localStorage.getItem("tasks")
) || [];

function saveTasks(){

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

function updateStats(){

    totalTasks.textContent =
    tasks.length;

    completedTasks.textContent =
    tasks.filter(
        task => task.completed
    ).length;

    pendingTasks.textContent =
    tasks.filter(
        task => !task.completed
    ).length;
}

function renderTasks(){

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if(currentFilter === "completed"){

        filteredTasks =
        tasks.filter(
            task => task.completed
        );
    }

    if(currentFilter === "pending"){
        filteredTasks =
        tasks.filter(
            task => !task.completed
        );
    }

    if (filteredTasks.length === 0) {
    taskList.innerHTML = `
        <div class="empty-state">
            <h3>All caught up!</h3>
            <p>Add a new task above to get started.</p>
        </div>
    `;
        updateStats();
        saveTasks();
        return;
    }

    filteredTasks.forEach(task => {

        const li =
        document.createElement("li");

        li.className =
        `task ${
            task.completed
            ? "completed"
            : ""
        }`;

        li.innerHTML = `
            <div class="task-info">

                <div class="task-title">
                    ${task.title}
                </div>

                <div class="task-meta">
                    ${task.date}
                    ${task.time}
                </div>

                <span class="priority ${task.priority.toLowerCase()}">
                    ${task.priority}
                </span>

            </div>

            <div class="actions">

                <button
                    class="complete-btn"
                    onclick="toggleTask(${task.id})">
                    ✓
                </button>

                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(li);
    });

    updateStats();

    saveTasks();
}

function addTask(){

    const title =
    taskInput.value.trim();

    if(title === "") return;

    tasks.push({
        id:Date.now(),
        title:title,
        date:taskDate.value,
        time:taskTime.value,
        priority:taskPriority.value,
        completed:false
    });

    taskInput.value = "";
    taskDate.value = "";
    taskTime.value = "";

    renderTasks();
}

function toggleTask(id){

    tasks = tasks.map(task => {

        if(task.id === id){

            task.completed =
            !task.completed;
        }

        return task;
    });

    renderTasks();
}

function deleteTask(id){

    tasks =
    tasks.filter(
        task => task.id !== id
    );

    renderTasks();
}

function editTask(id){

    const task =
    tasks.find(
        task => task.id === id
    );

    const newTitle =
    prompt(
        "Edit Task",
        task.title
    );

    if(newTitle){

        task.title =
        newTitle.trim();

        renderTasks();
    }
}

addTaskBtn.addEventListener(
    "click",
    addTask
);

taskInput.addEventListener(
    "keydown",
    event => {

        if(event.key === "Enter"){

            addTask();
        }
    }
);

filters.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filters.forEach(
                btn =>
                btn.classList.remove(
                    "active"
                )
            );

            button.classList.add(
                "active"
            );

            currentFilter =
            button.dataset.filter;

            renderTasks();
        }
    );
});

renderTasks();