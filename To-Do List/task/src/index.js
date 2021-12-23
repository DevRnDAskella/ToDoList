const btnAddTask = document.querySelector('#add-task-button');
const inputField = document.querySelector('#input-task');
const elementTaskList = document.querySelector('#task-list');
const KEY = "tasks";
let numberTasks = 0; 

// ====== HANDLERS ======

btnAddTask.addEventListener('click', e => {
    const task = createTask(inputField.id, inputField.value);
    saveDataToLocalStorage(KEY, addDataToLocalStorage(loadDataFromLocalStorage(KEY), task));
    renderTaskElement(createTaskElement(task), elementTaskList);
    refreshField(inputField);
});

document.addEventListener('click', e => {
    if (e.target.classList.contains('delete-btn') || e.target.classList.contains('material-icons-outlined')) {
        deleteTaskFromLocalStorage(KEY, e.target.parentNode.tagName === "li" ?
            e.target.parentNode :
            e.target.parentNode.parentNode);
        deleteTaskFromListElement(elementTaskList, e.target);
    }
});

document.addEventListener('change', e => {
    if (e.target.id.match(/task\d/)) {
        const [name, id] = e.target.id.split('task');
        const [oldTask] = loadDataFromLocalStorage(KEY).filter(el => el.id === +id);
        updateDataInLocalStorage(KEY, updateTask(oldTask));
        let toggle = createToggle(e.target, 'task--decoration');
        toggle();
    }
})

window.addEventListener('load', e => renderTasksList(loadDataFromLocalStorage(KEY), elementTaskList));

// ====== HANDLERS ======

function createTask(id, desc, marked = false) {
    return {id: ++numberTasks, desc, marked};
}

function updateTask({id, desc, marked}) {
    return {id, desc, marked: !marked}
}

function createTaskElement({id, desc, marked}) {
    const createElementTask = (input, label, btn) => {
        const li = document.createElement('li');
        li.appendChild(input);
        li.appendChild(label);
        li.appendChild(btn);

        return li;
    }
    const createElementInput = () => {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = `task${id}`;
        input.checked = marked;

        return input;
    }
    const createElementLabel = () => {
        const label = document.createElement('label');
        const spanOfLabel = document.createElement('span');

        label.htmlFor = `task${id}`;
        if (marked) {
            spanOfLabel.classList.add('task', 'task--decoration');
        }
        spanOfLabel.classList.add('task');
        spanOfLabel.textContent = desc;
        label.appendChild(spanOfLabel);

        return label;
    }
    const createElementBtnDelete = () => {
        const btn = document.createElement('button');
        const btnIcon = document.createElement('span');

        btn.classList.add('delete-btn');
        btnIcon.classList.add('material-icons-outlined');
        btnIcon.textContent = 'close';
        btn.appendChild(btnIcon);

        return btn;
    }

    return createElementTask(createElementInput(), createElementLabel(), createElementBtnDelete());
}

function renderTaskElement(taskElement, selector) {
    selector.appendChild(taskElement);
}

function refreshField(field) {
    field.value = '';
}

function deleteTaskFromListElement(listTasks, taskElement) {
    if (taskElement.classList.contains('material-icons-outlined')) {
        listTasks.removeChild(taskElement.parentNode.parentNode);
    }

    if (taskElement.classList.contains('delete-btn')) {
        listTasks.removeChild(taskElement.parentNode);
    }
}

function createToggle(evt, selectorForDecoration) {
    let toggle = evt.nextElementSibling.firstChild;
    return () => {
        const element = evt.nextElementSibling.firstChild;
        toggle = element.classList.toggle(selectorForDecoration);

        return toggle;
    };
}

function renderTasksList(data, selector) {
    data.forEach(el => {
        renderTaskElement(createTaskElement(el), selector);
    });
}

// ====== LOCAL STORAGE ======

function deleteTaskFromLocalStorage(key, task) {
    let data = loadDataFromLocalStorage(key);
    const index = data.findIndex(elem => elem.id === task.id);
    data.splice(index, 1);
    console.log(data);
    saveDataToLocalStorage(key, data);
}

function loadDataFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function addDataToLocalStorage(data, task) {
    data.push(task);
    return data;
}

function updateDataInLocalStorage(key, task) {
    const data = loadDataFromLocalStorage(key);
    const index = data.findIndex(item => item.id === task.id);
    data[index] = task;
    saveDataToLocalStorage(key, data);
}

function saveDataToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// ====== LOCAL STORAGE ======