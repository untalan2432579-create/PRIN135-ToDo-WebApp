
const todoForm = document.getElementById('todoForm');
const taskInput = document.getElementById('taskInput');
const hoursInput = document.getElementById('hoursInput');

const taskList = document.getElementById('taskList');
const emptyMessage = document.getElementById('emptyMessage');

const itemsLeft = document.getElementById('itemsLeft');
const allHoursDisplay = document.getElementById('allHours');
const remainingHoursDisplay = document.getElementById('remainingHours');

const toggleAllButton = document.getElementById('toggleAllButton');
const clearCompletedButton = document.getElementById('clearCompletedButton');

const filterButtons = document.querySelectorAll('.filter');

// DIFFICULTY SUMMARY ELEMENTS

const easyCount = document.getElementById('easyCount');
const easyHours = document.getElementById('easyHours');

const mediumCount = document.getElementById('mediumCount');
const mediumHours = document.getElementById('mediumHours');

const hardCount = document.getElementById('hardCount');
const hardHours = document.getElementById('hardHours');

// INITIAL TASKS

let tasks = [
    {
        id: 1,
        text: 'Learn variables',
        hours: 1,
        completed: true
    },
    {
        id: 2,
        text: 'Learn data types',
        hours: 2.5,
        completed: false
    },
    {
        id: 3,
        text: 'Learn Functions',
        hours: 6,
        completed: false
    }
];

let currentFilter = 'all';
let nextId = 4;


// AUTOMATIC DIFFICULTY CLASSIFICATION

function getDifficulty(hours) {

    if (hours <= 2) {
        return {
            label: 'Easy',
            className: 'easy'
        };
    }

    if (hours <= 5) {
        return {
            label: 'Medium',
            className: 'medium'
        };
    }

    return {
        label: 'Hard',
        className: 'hard'
    };
}


// FORMAT HOURS

function formatHours(hours) {
    return Number(hours.toFixed(2)).toString();
}


// FILTER TASKS

function getVisibleTasks() {

    if (currentFilter === 'active') {
        return tasks.filter(task => !task.completed);
    }

    if (currentFilter === 'completed') {
        return tasks.filter(task => task.completed);
    }

    return tasks;
}


// DISPLAY TASKS

function renderTasks() {

    taskList.innerHTML = '';

    const visibleTasks = getVisibleTasks();

    visibleTasks.forEach(task => {

        const row = document.createElement('li');

        row.className = `task-row ${
            task.completed ? 'completed' : ''
        }`;

        // CHECKBOX

        const checkbox = document.createElement('input');

        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;

        checkbox.addEventListener('change', () => {

            task.completed = checkbox.checked;

            renderTasks();

        });


        // TASK NAME

        const text = document.createElement('span');

        text.className = 'task-text';
        text.textContent = task.text;

        text.addEventListener('dblclick', () => {

            editTaskText(task, text);

        });


        // AUTOMATIC DIFFICULTY LABEL

        const difficultyInfo = getDifficulty(task.hours);

        const difficulty = document.createElement('span');

        difficulty.className =
            `difficulty ${difficultyInfo.className}`;

        difficulty.textContent =
            `${difficultyInfo.label} · ${formatHours(task.hours)}h`;

        difficulty.addEventListener('dblclick', () => {

            editTaskHours(task, difficulty);

        });


        // DELETE BUTTON

        const deleteButton = document.createElement('button');

        deleteButton.type = 'button';
        deleteButton.className = 'delete-button';
        deleteButton.textContent = '×';

        deleteButton.addEventListener('click', () => {

            tasks = tasks.filter(item => item.id !== task.id);

            renderTasks();

        });


        row.append(
            checkbox,
            text,
            difficulty,
            deleteButton
        );

        taskList.appendChild(row);

    });

    updateFooter(visibleTasks);

}


// UPDATE TOTAL HOURS AND DIFFICULTY SUMMARY

function updateFooter(visibleTasks) {

    // UNFINISHED TASKS

    const activeTasks = tasks.filter(task => !task.completed);


    // TOTAL HOURS ACROSS ALL TASKS

    const allTaskHours = tasks.reduce(
        (total, task) => total + task.hours,
        0
    );


    // REMAINING HOURS ONLY

    const remainingHours = activeTasks.reduce(
        (total, task) => total + task.hours,
        0
    );


    // UPDATE FOOTER

    itemsLeft.textContent =
        `${activeTasks.length} items left`;

    allHoursDisplay.textContent =
        `${formatHours(allTaskHours)} hours total`;

    remainingHoursDisplay.textContent =
        `${formatHours(remainingHours)} hours remaining`;


    // DIFFICULTY TOTALS

    const easyTasks = tasks.filter(
        task => getDifficulty(task.hours).label === 'Easy'
    );

    const mediumTasks = tasks.filter(
        task => getDifficulty(task.hours).label === 'Medium'
    );

    const hardTasks = tasks.filter(
        task => getDifficulty(task.hours).label === 'Hard'
    );


    // EASY TOTAL

    const totalEasyHours = easyTasks.reduce(
        (total, task) => total + task.hours,
        0
    );

    easyCount.textContent =
        `${easyTasks.length} tasks`;

    easyHours.textContent =
        `${formatHours(totalEasyHours)}h total`;


    // MEDIUM TOTAL

    const totalMediumHours = mediumTasks.reduce(
        (total, task) => total + task.hours,
        0
    );

    mediumCount.textContent =
        `${mediumTasks.length} tasks`;

    mediumHours.textContent =
        `${formatHours(totalMediumHours)}h total`;


    // HARD TOTAL

    const totalHardHours = hardTasks.reduce(
        (total, task) => total + task.hours,
        0
    );

    hardCount.textContent =
        `${hardTasks.length} tasks`;

    hardHours.textContent =
        `${formatHours(totalHardHours)}h total`;


    // EMPTY MESSAGE

    emptyMessage.hidden = visibleTasks.length !== 0;


    // BUTTON VISIBILITY

    toggleAllButton.hidden = tasks.length === 0;

    clearCompletedButton.hidden =
        !tasks.some(task => task.completed);


    // MARK ALL DONE / ACTIVE

    const allCompleted =
        tasks.length > 0 &&
        tasks.every(task => task.completed);

    toggleAllButton.textContent =
        allCompleted ? 'Mark all active' : 'Mark all done';

}


// EDIT TASK NAME

function editTaskText(task, oldElement) {

    const input = document.createElement('input');

    input.type = 'text';
    input.className = 'edit-input';
    input.value = task.text;

    startEditing(oldElement, input, value => {

        const newText = value.trim();

        if (newText === '') {

            tasks = tasks.filter(
                item => item.id !== task.id
            );

        } else {

            task.text = newText;

        }

        renderTasks();

    });

}


// EDIT TASK HOURS

function editTaskHours(task, oldElement) {

    const input = document.createElement('input');

    input.type = 'number';
    input.min = '0';
    input.step = '0.5';

    input.className = 'edit-input edit-hours';

    input.value = task.hours;

    startEditing(oldElement, input, value => {

        task.hours = value.trim() === ''
            ? 0
            : Math.max(0, Number(value) || 0);

        // Automatically updates difficulty and totals.

        renderTasks();

    });

}


// ENTER TO SAVE / ESC TO CANCEL

function startEditing(oldElement, input, saveChanges) {

    oldElement.replaceWith(input);

    input.focus();
    input.select();

    let finished = false;

    function finish(save) {

        if (finished) return;

        finished = true;

        if (save) {

            saveChanges(input.value);

        } else {

            renderTasks();

        }

    }

    input.addEventListener('keydown', event => {

        if (event.key === 'Enter') {

            finish(true);

        }

        if (event.key === 'Escape') {

            finish(false);

        }

    });

    input.addEventListener('blur', () => {

        finish(true);

    });

}


// ADD NEW TASK

todoForm.addEventListener('submit', event => {

    event.preventDefault();

    const text = taskInput.value.trim();

    if (text === '') {

        taskInput.focus();

        return;

    }

    const hours = hoursInput.value.trim() === ''
        ? 0
        : Math.max(0, Number(hoursInput.value) || 0);


    tasks.push({

        id: nextId++,

        text: text,

        hours: hours,

        completed: false

    });


    taskInput.value = '';
    hoursInput.value = '';

    currentFilter = 'all';

    filterButtons.forEach(button => {

        button.classList.toggle(
            'active',
            button.dataset.filter === 'all'
        );

    });

    renderTasks();

    taskInput.focus();

});


// ALL / ACTIVE / COMPLETED FILTERS

filterButtons.forEach(button => {

    button.addEventListener('click', () => {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(filterButton => {

            filterButton.classList.toggle(
                'active',
                filterButton === button
            );

        });

        renderTasks();

    });

});


// MARK ALL DONE / MARK ALL ACTIVE

toggleAllButton.addEventListener('click', () => {

    const markAsCompleted =
        !tasks.every(task => task.completed);

    tasks.forEach(task => {

        task.completed = markAsCompleted;

    });

    renderTasks();

});


// CLEAR COMPLETED TASKS

clearCompletedButton.addEventListener('click', () => {

    tasks = tasks.filter(task => !task.completed);

    renderTasks();

});


// INITIAL DISPLAY

renderTasks();
