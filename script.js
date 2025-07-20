function updateDate() {
    const now = new Date();

    const options = { month: 'long', year: 'numeric' };
    const formattedDate = now.toLocaleDateString('en-US', options);

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    const result = `${formattedDate} ${hours}:${minutes}`;
    document.getElementById('date').textContent = result;
}
setInterval(updateDate, 1000);
updateDate();


const quotes = [
    "Никогда не сдавайся.",
    "Сегодня — лучшее время начать.",
    "Делай или не делай. Не бывает 'попробую'.",
    "Успех — это привычка.",
    "Код пишется не сам. Его пишешь ты."
];

function loadQoute() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById('quote').textContent = quotes[randomIndex];
}
loadQoute();


let tasks = [];

function loadTasks() {
    const data = localStorage.getItem('todo-tasks');
    if (data) {
        tasks = JSON.parse(data);
        renderTasks();
    }
}

function saveTasks() {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
}

function addTask(text) {
    tasks.push({ text, completed: false });
    saveTasks();
    renderTasks();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function renderTasks() {
    const list = document.querySelector(".todo__list");
    list.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = `task ${task.completed ? 'task--done' : ''}`;
        li.innerHTML = `
            <span class="task__number">${String(index + 1).padStart(2, '0')}</span>
            <p class="task__content">${task.text}</p>
            <div class="task__buttons">
                <!-- <button type="button" class="task__button-delete"><img src="./icons/trash_icon.svg"></button> -->
                <button class="task__button-check"><img src="./icons/ckeck_icon.svg"></button>
            </div>
        `;
        li.querySelector(".task__button-check").addEventListener("click", () => toggleTask(index));
        list.appendChild(li);
    });
}


const taskList = document.querySelector('.todo__list');
const addButton = document.getElementById('add_task');
let isInputActive = false;

addButton.addEventListener('click', () => {
    if (isInputActive) return;
    const index = String(taskList.children.length + 1).padStart(2, '0');

    const li = document.createElement('li');
    li.className = 'task task--new';
    li.innerHTML = `
        <span class="task__number">${index}</span>
        <input type="text" id="task__input" placeholder="Write a new Task">
        <div class="task__buttons">
            <!-- <button type="button" class="task__button-delete"><img src="./icons/trash_icon.svg"></button> -->
            <button type="button" class="task__button-check"><img src="./icons/ckeck_icon.svg"></button>
        </div>
        `;
    taskList.appendChild(li);

    const input = li.querySelector('input');
    input.focus();
    isInputActive = true;

    let inputConfirmed = false;

    input.addEventListener('keydown', (e) => {
        if (e.key == 'Enter') {
            const value = input.value.trim();

            inputConfirmed = true;
            isInputActive = false;
            li.remove();
            addTask(value);

        } else if (e.key === 'Escape') {
            li.remove();
            isInputActive = false;
            return;
        }
    });
    input.addEventListener('blur', () => {
        if (!inputConfirmed || input.value.trim() == "") {
            li.remove();
            isInputActive = false;
        }
    });
});

window.addEventListener("DOMContentLoaded", loadTasks);


// function getWeekDay(date) {
//   let days = ['Sun', 'Mon', 'Thu', 'Wed', 'Tue', 'Fri', 'Sut'];
//   return days[date.getDay()];
// }