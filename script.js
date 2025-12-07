// 認証関連
const loginContainer = document.getElementById('loginContainer');
const todoContainer = document.getElementById('todoContainer');
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('loginError');
const userDisplay = document.getElementById('userDisplay');
const logoutBtn = document.getElementById('logoutBtn');

// デモ用のユーザー情報（実際のアプリではサーバー側で管理）
const DEMO_USERS = {
    'admin': 'admin123',
    'user': 'user123',
    'demo': 'demo123'
};

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentUser = localStorage.getItem('currentUser');

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

// 認証関連の関数
function handleLogin(e) {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (DEMO_USERS[username] && DEMO_USERS[username] === password) {
        currentUser = username;
        localStorage.setItem('currentUser', username);
        showTodoApp();
        loginError.textContent = '';
        usernameInput.value = '';
        passwordInput.value = '';
    } else {
        loginError.textContent = 'ユーザー名またはパスワードが正しくありません';
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLoginPage();
}

function showLoginPage() {
    loginContainer.style.display = 'block';
    todoContainer.style.display = 'none';
}

function showTodoApp() {
    loginContainer.style.display = 'none';
    todoContainer.style.display = 'block';
    userDisplay.textContent = `ようこそ、${currentUser}さん`;
    renderTodos();
}

function checkAuth() {
    if (currentUser) {
        showTodoApp();
    } else {
        showLoginPage();
    }
}

// イベントリスナー
loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);

// 初期化
checkAuth();
