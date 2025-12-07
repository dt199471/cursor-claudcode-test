let todos = JSON.parse(localStorage.getItem('todos')) || [];

const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const clearCompletedBtn = document.getElementById('clearCompleted');

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    todoList.innerHTML = '';

    if (todos.length === 0) {
        todoList.innerHTML = '<div class="empty-state">タスクがありません。上のボックスに新しいタスクを追加してください。</div>';
        return;
    }

    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodo(index));

        const text = document.createElement('span');
        text.className = 'todo-text';
        text.textContent = todo.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '×';
        deleteBtn.addEventListener('click', () => deleteTodo(index));

        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}

function addTodo() {
    const text = todoInput.value.trim();

    if (text === '') {
        return;
    }

    todos.push({
        text: text,
        completed: false,
        id: Date.now()
    });

    todoInput.value = '';
    saveTodos();
    renderTodos();
}

function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
}

function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
}

function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
}

addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

clearCompletedBtn.addEventListener('click', clearCompleted);

renderTodos();
