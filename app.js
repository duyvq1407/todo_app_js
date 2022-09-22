const todo_list = document.querySelector('#todo_list ul:last-child')
const form = document.querySelector('form:last-child')
const btn_add = form.querySelector(".btn_add")
const btn_edit = form.querySelector(".btn_edit")
const title = form.querySelector("#title")
const deadline = form.querySelector("#deadline")
const statusTodo = form.querySelector("#status")

btn_add.querySelector('button:first-child').addEventListener('click', () => {
    let {titleValue, deadlineValue, statusValue} = getValueInput()
    addTodoElement(titleValue, deadlineValue, statusValue)
    saveTodoList()
    resetInput()  
});

function addTodoElement(title1, deadline1, status1, index) {
    let todoList = getTodoInLocal()
    let li = createElementLi(title1, deadline1, status1)

    li.querySelector(".btnEdit").addEventListener("click", () => {
        resetButton('edit')
        btn_edit.querySelector('button:first-child').setAttribute('onclick', `editTodo(${index !== undefined ? index : todoList.length})`)
        btn_edit.querySelector('button:last-child').addEventListener('click', () => {
            resetInput();
            resetButton()
        })

        resetInput(title1, deadline1, status1)
    })
    
} 

function createElementLi(title, deadline, status){
    let li = document.createElement('li');
    li.innerHTML = `
        <span class="title">${title}</span> 
        <span class="deadline">${deadline}</span>
        <span class="status"></span>
        <span>
            <button class="btnEdit btn-outline-primary btn">Edit</button>
            <button class="btnRemove btn-outline-danger btn">Remove</button>
        </span>
    `
    
    li.querySelector(".btnRemove").addEventListener("click", () => {
        todo_list.removeChild(li);
        saveTodoList();
    })

    setStatus(li, status, deadline)
    todo_list.appendChild(li)
    return li
}

function setStatus(li, status, deadline) {
    let now = new Date();
    let deadline1 = new Date(deadline);
    let statusSpan = li.querySelector('.status');

    if (status === 'todo') {
        statusSpan.classList.add('todo')
        statusSpan.innerText = 'TO DO'
    } else if (status === 'in_progress') {
        statusSpan.classList.add('in_progress')
        statusSpan.innerText = 'IN PROGRESS'
    } else {
        statusSpan.classList.add('done')
        statusSpan.innerText = 'DONE'
    }
    if (now > deadline1 && status === 'in_progress') {
        statusSpan.classList.add('fail')
        statusSpan.innerText = 'MISSING'
    }
    
}

function saveTodoList() {
    let todoList = todo_list.querySelectorAll("li")
    let todoArr = []
    todoList.forEach((item, index) => {
        todoArr.push({
            index: index,
            title: item.querySelector(".title").textContent,
            deadline: item.querySelector(".deadline").textContent,
            status: item.querySelector(".status").classList[1]
        })
    })
    localStorage.setItem("todo_list", JSON.stringify(todoArr))
}

function editTodo(index) {
    const todoList = getTodoInLocal();
    const {titleValue, deadlineValue, statusValue} = getValueInput();
    todoList.splice(index, 1, {index, title: titleValue, deadline: deadlineValue, status:statusValue});
    localStorage.setItem("todo_list", JSON.stringify(todoList))
    resetButton();
    resetInput();
    showTodoList();
}

function resetInput(title1 = '', deadline1 = '', status1 = '') {
    title.value = title1;
    deadline.value = deadline1;
    statusTodo.options[0].selected = true
    for (let i = 0; i < statusTodo.options.length; i++) {
        if (statusTodo.options[i].value === status1) {
            statusTodo.options[i].selected = true
        }
    }
}

function resetButton(arg) {
    if (arg === 'edit') {
        btn_add.setAttribute('hidden', true);
        btn_edit.removeAttribute('hidden')  
    } else {      
        btn_add.removeAttribute('hidden');
        btn_edit.setAttribute('hidden', true);
    }
}

function showTodoList() {
    todo_list.innerHTML = '';
    let todoList = JSON.parse(localStorage.getItem('todo_list'));
    todoList.forEach((item) => {
        addTodoElement(item.title, item.deadline, item.status, item.index);
    })
}

function getTodoInLocal(){
    let todoList = JSON.parse(localStorage.getItem('todo_list'));
    return todoList;
}

function getValueInput(){
    let titleValue = title.value.trim();
    let deadlineValue = deadline.value;
    let statusValue;
    for (let i = 0; i < statusTodo.options.length; i++) {
        if (statusTodo.options[i].selected === true) {
            statusValue = statusTodo.options[i].value
        }
    }
    return {
        titleValue, deadlineValue, statusValue
    }

}


// ------------SEARCH----------------

const titleSearch = document.querySelector("#title_search")
const deadlineSearchFrom = document.querySelector("#deadline_search_from")
const deadlineSearchTo = document.querySelector("#deadline_search_to")
const statusSearch = document.querySelector("#status_search")

function handleSearch(){
    let searchResult = [...getTodoInLocal()]

    //filter by title
    if(titleSearch.value){
        searchResult = searchResult.filter(item => item.title.includes(titleSearch.value))
    }

    //filter by deadline
    if (deadlineSearchFrom.value && deadlineSearchTo.value) {
        searchResult = searchResult.filter(item => (item.deadline >= deadlineSearchFrom.value && item.deadline <= deadlineSearchTo.value))
    } else if (deadlineSearchFrom.value || deadlineSearchTo.value) {
        if (deadlineSearchFrom.value) {
            searchResult = searchResult.filter(item => item.deadline >= deadlineSearchFrom.value)
        } else {
            searchResult = searchResult.filter(item => item.deadline <= deadlineSearchTo.value)
        }
    }

    //filter by value
    let statusSearchValue;
    for (let i = 0; i < statusSearch.options.length; i++) {
        if (statusSearch.options[i].selected === true) {
            statusSearchValue = statusSearch.options[i].value
        }
    }

    if (statusSearch.options[0].selected !== true) {
        searchResult = searchResult.filter(item => item.status === statusSearchValue)
    }

    console.log(searchResult);
    todo_list.innerHTML = ''

    searchResult.forEach((item) => {
        addTodoElement(item.title, item.deadline, item.status, item.index);
    })

}

function clearSearch() {
    titleSearch.value = '';
    deadlineSearchFrom.value = '';
    deadlineSearchTo.value = '';
    statusSearch.options[0].selected = true
    showTodoList()
}

showTodoList()