let dash_todo_count = document.querySelector("#dash-todo-count")
let todo_in_progressCount = document.querySelector("#todo-in-progressCount")
let todo_completed_count = document.querySelector("#todo-completed-count")
let add_btn = document.querySelector(".add-btn")
let modal = document.querySelector(".modal")
let form = document.querySelector("#task-form")
let formcancel = document.querySelector("#cancel-task")
let formsave = document.querySelector(".save-btn")
let close = document.querySelector(".close-btn")
let todo_count = document.querySelector("#todo_count")

let todo_tasklist = document.querySelector("#todo_tasklist")
let formsavebtn = document.querySelector(".save-btn")
let task_title = document.querySelector("#task-title")
let task_desc = document.querySelector("#task-description")
let task_cat = document.querySelector("#task-category")
let task_priority = document.querySelector("#task-priority")

let progress_tasklist = document.querySelector("#inProgress_tasklist");
let Progress_count = document.querySelector("#progressCount")
let dash_Progress_count = document.querySelector("#dash-todo-in-progressCount")

let done_count = document.querySelector("#doneCount")
let dash_done_count = document.querySelector("#dash-todo-completed-count")
let done_tasklist = document.querySelector("#done_tasklist")

let p = document.querySelector("#p")
let p2 = document.querySelector("#p2")
let p3 = document.querySelector("#p3")

let draggedCard = null;

add_btn.addEventListener("click", function () {
    modal.style.display = "flex";
});
formcancel.addEventListener("click", function () {
    modal.style.display = "none"
})
close.addEventListener("click", function () {
    modal.style.display = "none"
})

function appendcards(task) {
    let taskCard = document.createElement("div");
    taskCard.classList.add("task-card");

    let priority = document.createElement("span");

    if (task.priority === "High") {
        priority.classList.add("priority", "high");
    }
    else if (task.priority === "Medium") {
        priority.classList.add("priority", "medium");
    }
    else {
        priority.classList.add("priority", "low");
    }

    priority.textContent = task.priority;

    let title = document.createElement("h4");
    title.textContent = task.title;

    let description = document.createElement("p");
    description.textContent = task.description;

    let taskFooter = document.createElement("div");
    taskFooter.classList.add("task-footer");

    let category = document.createElement("span");
    category.classList.add("category");
    category.textContent = task.category;

    let date = document.createElement("span");
    date.classList.add("date");
    date.textContent = task.date;

    taskFooter.append(category, date);

    let taskActions = document.createElement("div");
    taskActions.classList.add("task-actions");

    let progressBtn = document.createElement("button");
    progressBtn.classList.add("progress-btn");
    progressBtn.textContent = "In Progress";

    let doneBtn = document.createElement("button");
    doneBtn.classList.add("done-btn");
    doneBtn.textContent = "Done";

    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Delete";

    taskCard.dataset.taskId = task.id;
    taskCard.setAttribute("draggable", "true");

    taskActions.append(progressBtn, doneBtn, deleteBtn);

    taskCard.append(
        priority,
        title,
        description,
        taskFooter,
        taskActions
    );

    if (task.status === "todo") {
        todo_tasklist.append(taskCard);
    }
    else if (task.status === "progress") {
        progress_tasklist.append(taskCard);
    }
    else if (task.status === "done") {
        done_tasklist.append(taskCard);
    }
}

function todocount() {
    let count = todo_tasklist.querySelectorAll(".task-card").length;
    dash_todo_count.textContent = count;
    todo_count.textContent = count;
    return count
}
function prog_count() {
    let progcount = progress_tasklist.querySelectorAll(".task-card").length;
    dash_Progress_count.textContent = progcount;
    Progress_count.textContent = progcount;
    return progcount;
}
function done_counter() {
    let donecount = done_tasklist.querySelectorAll(".task-card").length;
    done_count.textContent = donecount;
    dash_done_count.textContent = donecount;
    return donecount
}

function updateEmptyStates() {
    if (todocount() === 0) {
        todo_tasklist.appendChild(p);
    } else {
        p.remove();
    }

    if (prog_count() === 0) {
        progress_tasklist.appendChild(p2);
    } else {
        p2.remove();
    }

    if (done_counter() === 0) {
        done_tasklist.appendChild(p3);
    } else {
        p3.remove();
    }
}


let columns = [todo_tasklist, progress_tasklist, done_tasklist];

columns.forEach(function (column) {
    column.addEventListener("dragover", function (e) {
        e.preventDefault();
    });
});

document.addEventListener("dragstart", function (e) {
    if (e.target.classList.contains("task-card")) {
        draggedCard = e.target;
    }
});

document.addEventListener("dragend", function () {
    draggedCard = null;
});

columns.forEach(function (column) {
    column.addEventListener("drop", function (e) {
        e.preventDefault();

        if (draggedCard) {
            let card = draggedCard;

            column.append(card);

            let status;

            if (column === todo_tasklist) {
                status = "todo";
            }
            else if (column === progress_tasklist) {
                status = "progress";
            }
            else {
                status = "done";
            }

            changeTaskStatus(card, status);

            updateEmptyStates();
        }
    });
});

let tasks = [];
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadTasks() {
    let savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

function changeTaskStatus(card, status) {
    let taskId = Number(card.dataset.taskId);

    let task = tasks.find(function (t) {
        return t.id === taskId;
    });

    if (task) {
        task.status = status;
        saveTasks();
    }
}

formsave.addEventListener("click", function (e) {
    e.preventDefault();

    if (
        task_title.value.trim() === "" ||
        task_desc.value.trim() === "" ||
        task_cat.value.trim() === "" ||
        task_priority.value.trim() === ""
    ) {
        alert("Please fill All details!");
        return;
    }

    let task = {
        id: Date.now(),
        title: task_title.value,
        description: task_desc.value,
        category: task_cat.value,
        priority: task_priority.value,
        date: new Date().toLocaleDateString(),
        status: "todo"
    };

    tasks.push(task);
    saveTasks();

    modal.style.display = "none";

    appendcards(task);
    updateEmptyStates();

    form.reset();
});

todo_tasklist.addEventListener("click", function (e) {
    if (e.target.classList.contains("progress-btn")) {
        let card = e.target.closest(".task-card");

        progress_tasklist.append(card);

        changeTaskStatus(card, "progress");

        updateEmptyStates();
    }
});

progress_tasklist.addEventListener("click", function (e) {
    if (e.target.classList.contains("done-btn")) {
        let card = e.target.closest(".task-card");

        done_tasklist.append(card);

        changeTaskStatus(card, "done");

        updateEmptyStates();
    }
});

done_tasklist.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
        let card = e.target.closest(".task-card");

        let taskId = Number(card.dataset.taskId);

        tasks = tasks.filter(function (task) {
            return task.id !== taskId;
        });

        saveTasks();

        card.remove();
        updateEmptyStates();
    }
});

loadTasks();

tasks.forEach(function (task) {
    appendcards(task);
});

updateEmptyStates();