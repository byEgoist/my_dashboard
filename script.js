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

function loadQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById('quote').textContent = quotes[randomIndex];
}
loadQuote();


const TodoManager = {
    tasks: [],

    init() {
        this.loadTasks();
    },

    saveTasks() {
        localStorage.setItem('todo-tasks', JSON.stringify(this.tasks));
    },

    loadTasks() {
        const data = localStorage.getItem('todo-tasks');
        if (data) this.tasks = JSON.parse(data);
        this.renderTasks();
    },

    addTask(text) {
        this.tasks.push({ text, completed: false });
        this.saveTasks();
        this.renderTasks();
    },

    toggleTask(index) {
        this.tasks[index].completed = !this.tasks[index].completed;
        this.saveTasks();
        this.renderTasks();
    },

    deleteTask(index) {
        this.tasks.splice(index, 1);
        this.saveTasks();
        this.renderTasks();
    },

    renderTasks() {
        const list = document.querySelector(".todo__list");
        if (!list) return;

        list.innerHTML = this.tasks.map((task, index) => `
            <li class="task ${task.completed ? 'task--done' : ''}">
                <span class="task__number">${String(index + 1).padStart(2, '0')}</span>
                <p class="task__content">${task.text}</p>
                <div class="task__buttons">
                    <button type="button" class="task__button-delete"><img src="./icons/trash_icon.svg"></button>
                    <button type="button" class="task__button-check"><img src="./icons/ckeck_icon.svg"></button>
                </div>
            </li>
        `).join('');

        const deleteButtons = list.querySelectorAll('.task__button-delete');
        const checkButtons = list.querySelectorAll('.task__button-check');

        deleteButtons.forEach((button, index) => {
            button.addEventListener('click', () => this.deleteTask(index));
        });

        checkButtons.forEach((button, index) => {
            button.addEventListener('click', () => this.toggleTask(index));
        });
    }
};


const taskList = document.querySelector('.todo__list');
const addButton = document.getElementById('add_task');

addButton.addEventListener('click', () => {
    if (document.querySelector('#task__input')) return;

    const li = document.createElement('li');
    li.className = 'task task--new';
    li.innerHTML = `
        <span class="task__number">${String(TodoManager.tasks.length + 1).padStart(2, '0')}</span>
        <input type="text" id="task__input" placeholder="Write a new Task">
    `;
    taskList.appendChild(li);

    const input = li.querySelector('input');
    input.focus();

    input.addEventListener('blur', () => {
        const value = input.value.trim();
        if (value) TodoManager.addTask(value);
        li.remove();
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') input.blur();
        if (e.key === 'Escape') li.remove();
    });
});


let focusTask = {};

function saveFocusTask() {
    localStorage.setItem('focus-task', JSON.stringify(focusTask));
}

function loadFocusTask() {
    let focusData = localStorage.getItem('focus-task');
    if (focusData) {
        focusTask = JSON.parse(focusData);
        renderFocusTasks();
    }
}

function addFocusTask(text) {
    focusTask = {
        createDate: Date.now(),
        text,
        completed: false
    };
    saveFocusTask();
    renderFocusTasks();
}

function toggleFocusTask() {
    focusTask.completed = !focusTask.completed;
    saveFocusTask();
    renderFocusTasks();
}

function renderFocusTasks() {
    const focus = document.querySelector('.focus');
    focus.querySelector('.focus__content').innerHTML = ``;

    const p = document.createElement('p');
    p.className = `focus__task ${focusTask.completed ? 'focus__task--done' : ''}`;
    p.textContent = focusTask.text;
    focus.querySelector('.focus__content').appendChild(p);

    if (!focus.querySelector('.focus__button-check')) {
        const CheckButton = document.createElement('button');
        CheckButton.className = 'focus__button-check';
        CheckButton.setAttribute('type', 'buuton');
        CheckButton.innerHTML = `<img src="./icons/ckeck_icon.svg">`
        CheckButton.addEventListener('click', () => toggleFocusTask());
        focus.querySelector('.focus__header').appendChild(CheckButton);
    }
}


const focusInput = document.getElementById('focus__input');
let focusInputConfirmed = false;

focusInput.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
        const value = focusInput.value.trim();
        if (value == "") focusInput.blur();
        else {
            focusInputConfirmed = true;
            addFocusTask(value);
        }
    }
    if (e.key === 'Escape') {
        focusInputConfirmed = false;
        focusInput.blur();
    }
});
focusInput.addEventListener('blur', () => {
    if (!focusInputConfirmed) {
        focusInput.value = "";
    }
});

window.addEventListener("DOMContentLoaded", () => {
    TodoManager.init();
    loadFocusTask();
});


// function getWeekDay(date) {
//   let days = ['Sun', 'Mon', 'Thu', 'Wed', 'Tue', 'Fri', 'Sut'];
//   return days[date.getDay()];
// }