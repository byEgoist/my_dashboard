// Текущее время в шапке
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

// Случайная цитата
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

// Бургер
document.getElementById('menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('open');
});

// ToDo-Lisst
const StorageManager = {
    get(key, fallback = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : fallback;
        } catch (e) {
            console.error(`Ошибка чтения ${key}`, e);
            return fallback;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error(`Ошибка записи ${key}`, e);
        }
    },
    remove(key) {
        localStorage.removeItem(key);
    }
};
const TodoManager = {
    tasks: [],

    init() {
        this.loadTasks();
        this.renderTasks();
        this.renderFocusTask();
    },
    saveTasks() {
        StorageManager.set('todo-tasks', this.tasks);
    },
    loadTasks() {
        this.tasks = StorageManager.get('todo-tasks', []);
        const today = new Date().toISOString().split('T')[0];

        this.tasks.forEach(task => {
            if (task.focus && task.focusDate !== today) {
                task.focus = false;
                task.focusDate = null;
            }
        });
        this.saveTasks();
    },
    addTask(text) {
        this.tasks.push({
            date: Date.now(),
            text,
            completed: false,
            focus: false
        });
        this.saveTasks();
        this.renderTasks();
    },
    editTask(input, index) {
        const text = input.value.trim() || this.tasks[index].text;
        this.tasks[index].text = text;
        input.remove();
        this.saveTasks();
        this.renderTasks();
        this.renderFocusTask();
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
        this.renderFocusTask();
    },
    setFocusTask(index) {
        if (this.tasks[index].focus) {
            this.tasks[index].focus = false;
            this.tasks[index].focusDate = null;
        }
        else {
            const today = new Date().toISOString().split('T')[0];

            this.tasks.forEach(task => {
                if (task.focus && task.date !== today) {
                    task.focus = false;
                    task.focusDate = null;
                };
            });
            this.tasks[index].focus = true;
            this.tasks[index].focusDate = today;
        }

        this.saveTasks();
        this.renderTasks();
        this.renderFocusTask();
    },
    setFocusFromInput(text) {
        const today = new Date().toISOString().split('T')[0];
        this.tasks.forEach(t => { t.focus = false; t.focusDate = null; });

        this.tasks.push({
            date: Date.now(),
            text,
            completed: false,
            focus: true,
            focusDate: today
        });

        this.saveTasks();
        this.renderTasks();
        this.renderFocusTask();
    },
    getFocusTask() {
        return this.tasks.find(task => task.focus);
    },
    renderFocusTask() {
        const focus = document.querySelector('.focus'); // для кнопки
        const container = focus.querySelector('.focus__content');

        const task = this.getFocusTask();
        container.innerHTML = task
            ? `<p class="focus__task">${task.text}</p>`
            : `<input type="text" id="focus__input" placeholder="Write a new focus task">`;

        if (!task) {
            const focusInput = document.getElementById('focus__input');
            focusInput.addEventListener('keydown', (e) => {
                if (e.key == 'Enter') {
                    const value = focusInput.value.trim();
                    if (!value) focusInput.blur();
                    else this.setFocusFromInput(value);
                }
                if (e.key === 'Escape') focusInput.blur();
            });
            focusInput.addEventListener('blur', () => focusInput.value = "");
        }
    },
    renderTasks() {
        const list = document.querySelector(".todo__list");
        if (!list) return;

        list.innerHTML = this.tasks.map((task, index) => `
            <li class="task ${task.completed ? 'task--done' : ''}">
                <button type="button" class="task__button task__button-check" aria-label="Check task">
                    <svg class="icon icon--check" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M33.8889 20C33.8889 27.6706 27.6705 33.8889 20 33.8889C12.3293 33.8889 6.11108 27.6706 6.11108 20C6.11108 12.3294 12.3293 6.11111 20 6.11111C27.6705 6.11111 33.8889 12.3294 33.8889 20ZM25.5976 15.7912C26.0044 16.198 26.0044 16.8576 25.5976 17.2643L18.6532 24.2088C18.2464 24.6156 17.5869 24.6156 17.1801 24.2088L14.4023 21.431C13.9955 21.0242 13.9955 20.3647 14.4023 19.9579C14.8091 19.5511 15.4686 19.5511 15.8754 19.9579L17.9166 21.999L21.0205 18.8951L24.1246 15.7912C24.5314 15.3844 25.1908 15.3844 25.5976 15.7912Z" stroke="#393939"/>
                    </svg>
                </button>
                <div class="task__content">
                    <span class="task__text">${task.text}</span>
                    <div class="task__buttons">
                        <button type="button" class="task__button task__button-edit" aria-label="Edit task">
                            <svg class="icon icon--edit" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M2.84375 19.25C2.84375 18.8876 3.13757 18.5938 3.5 18.5938H17.5C17.8624 18.5938 18.1562 18.8876 18.1562 19.25C18.1562 19.6124 17.8624 19.9062 17.5 19.9062H3.5C3.13757 19.9062 2.84375 19.6124 2.84375 19.25Z" fill="#393939" />
                                <path d="M10.0801 13.0629L15.2572 7.88573C14.5526 7.59247 13.718 7.11075 12.9287 6.32149C12.1394 5.53209 11.6576 4.69741 11.3644 3.99274L6.18718 9.16992C5.7832 9.57391 5.58115 9.77594 5.40743 9.99872C5.2025 10.2614 5.0268 10.5457 4.88344 10.8465C4.76192 11.1015 4.67157 11.3726 4.49089 11.9146L3.53812 14.7729C3.4492 15.0397 3.51862 15.3338 3.71744 15.5326C3.91626 15.7314 4.21034 15.8008 4.47709 15.7119L7.33542 14.7592C7.87746 14.5785 8.14849 14.4881 8.40348 14.3665C8.70428 14.2232 8.98861 14.0475 9.25129 13.8426C9.47406 13.6688 9.6761 13.4669 10.0801 13.0629Z" fill="#393939" />
                                <path d="M16.6938 6.44913C17.7687 5.37414 17.7687 3.63124 16.6938 2.55624C15.6188 1.48125 13.8759 1.48125 12.8009 2.55624L12.1799 3.17717C12.1884 3.20285 12.1973 3.22888 12.2064 3.25524C12.434 3.91125 12.8634 4.77121 13.6713 5.57902C14.4791 6.38683 15.339 6.81624 15.995 7.04383C16.0213 7.05294 16.0472 7.06172 16.0727 7.07018L16.6938 6.44913Z" fill="#393939" />
                            </svg>
                        </button>
                        <button type="button" class="task__button task__button-focus" aria-label="Focus task">
                            <svg class="icon icon--focus" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.2263 12.3315L17.3868 10.8398C17.4723 10.044 17.5289 9.51851 17.4845 9.18741L17.5 9.1875C18.2248 9.1875 18.8125 8.59988 18.8125 7.875C18.8125 7.15012 18.2248 6.5625 17.5 6.5625C16.7751 6.5625 16.1875 7.15012 16.1875 7.875C16.1875 8.20283 16.3077 8.50258 16.5064 8.73261C16.2211 8.90872 15.8482 9.28025 15.2867 9.83946C14.8542 10.2703 14.6379 10.4857 14.3966 10.5192C14.2629 10.5376 14.1268 10.5186 14.0033 10.4643C13.7805 10.3661 13.632 10.0999 13.3349 9.56725L11.7692 6.75972C11.5859 6.43114 11.4325 6.15612 11.2942 5.93482C11.8615 5.64539 12.25 5.05556 12.25 4.375C12.25 3.4085 11.4665 2.625 10.5 2.625C9.53347 2.625 8.75 3.4085 8.75 4.375C8.75 5.05556 9.1385 5.64539 9.70576 5.93482C9.56751 6.15614 9.41412 6.43111 9.23081 6.75972L7.66505 9.56725C7.36799 10.0999 7.21946 10.3661 6.99668 10.4643C6.87325 10.5186 6.73704 10.5376 6.60336 10.5192C6.3621 10.4857 6.14583 10.2703 5.71331 9.83946C5.15189 9.28025 4.77886 8.90872 4.49359 8.7326C4.69231 8.50258 4.8125 8.20283 4.8125 7.875C4.8125 7.15012 4.22488 6.5625 3.5 6.5625C2.77512 6.5625 2.1875 7.15012 2.1875 7.875C2.1875 8.59988 2.77512 9.1875 3.5 9.1875L3.5155 9.18741C3.47114 9.51851 3.52767 10.044 3.61327 10.8398L3.7737 12.3315C3.86276 13.1594 3.93681 13.9471 4.02751 14.6562H16.9725C17.0632 13.9471 17.1372 13.1594 17.2263 12.3315Z" fill="#393939" />
                                <path d="M9.54805 18.375H11.4519C13.9334 18.375 15.174 18.375 16.0019 17.6341C16.3632 17.3106 16.592 16.7275 16.7571 15.9688H4.2428C4.4079 16.7275 4.6367 17.3106 4.99803 17.6341C5.82586 18.375 7.06657 18.375 9.54805 18.375Z" fill="#393939" />
                            </svg>
                        </button>
                    </div>
                </div>
                <button type="button" class="task__button task__button-delete" aria-label="Delete task">
                    <svg class="icon icon--delete" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.535 12.535C13.2483 11.8217 14.4048 11.8217 15.1181 12.535L19.9151 17.3318L24.7118 12.535C25.4251 11.8217 26.5817 11.8217 27.295 12.535C28.0083 13.2483 28.0083 14.4048 27.295 15.1181L22.498 19.915L27.295 24.7117C28.0083 25.4251 28.0083 26.5816 27.295 27.2949C26.5817 28.0083 25.4251 28.0083 24.7118 27.2949L19.9151 22.4982L15.1181 27.2949C14.4048 28.0083 13.2483 28.0083 12.535 27.2949C11.8217 26.5816 11.8217 25.4251 12.535 24.712L17.3319 19.915L12.535 15.1181C11.8217 14.4048 11.8217 13.2483 12.535 12.535Z" stroke="#393939" />
                    </svg>
                </button>
            </li>
        `).join('');

        list.querySelectorAll('.task__button-check').forEach((button, index) => {
            button.addEventListener('click', () => this.toggleTask(index));
        });

        list.querySelectorAll('.task__button-delete').forEach((button, index) => {
            button.addEventListener('click', () => this.deleteTask(index));
        });

        list.querySelectorAll('.task__button-focus').forEach((button, index) => {
            button.addEventListener('click', () => this.setFocusTask(index));
        });

        list.querySelectorAll('.task__button-edit').forEach((button, index) => {
            button.addEventListener('click', () => {
                const taskItem = button.closest('.task');
                taskItem.classList.add('task--edit');
                const taskContent = taskItem.querySelector('.task__content');
                const span = taskContent.querySelector('.task__text');

                const editInput = document.createElement('input');
                editInput.type = 'text';
                editInput.value = span.textContent.trim();
                editInput.className = 'task__text';

                span.replaceWith(editInput);
                editInput.select();

                editInput.addEventListener('blur', () => this.editTask(editInput, index));
                editInput.addEventListener('keydown', e => {
                    if (e.key === 'Enter' || e.key === 'Escape') editInput.blur();
                });
            });
        });
    }
}

function createNewTaskInput() {
    if (document.querySelector('#task__input')) return;

    const taskList = document.querySelector('.todo__list');
    const li = document.createElement('li');
    li.className = 'task task--new';
    li.innerHTML = `<input type="text" id="task__input" placeholder="Write a new Task">`;
    taskList.appendChild(li);

    const input = li.querySelector('input');
    input.focus();

    let confirmed = false;

    input.addEventListener('keydown', (e) => {
        if (e.key == 'Enter') {
            const value = input.value.trim();
            if (value) {
                confirmed = true;
                TodoManager.addTask(value);
                li.remove();
                createNewTaskInput();
            }
            else input.blur();
        }
        if (e.key === 'Escape') input.blur();
    });
    input.addEventListener('blur', () => {
        if (!confirmed) li.remove()
    });
}
document.getElementById('add_task').addEventListener('click', createNewTaskInput);

// Подгрузка localStorage
window.addEventListener("DOMContentLoaded", () => {
    TodoManager.init();
});

// function getWeekDay(date) {
//   let days = ['Sun', 'Mon', 'Thu', 'Wed', 'Tue', 'Fri', 'Sut'];
//   return days[date.getDay()];
// }