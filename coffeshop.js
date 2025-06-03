// Основные переменные
let currentUser = null;
const owner = {
    username: "Gaidrs",
    password: "Popiplaytime100"
};

let levels = JSON.parse(localStorage.getItem('gd-levels')) || [];
let moderators = JSON.parse(localStorage.getItem('gd-moderators')) || [];
let forumTopics = JSON.parse(localStorage.getItem('gd-forum')) || [];

// DOM элементы
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const navBtns = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('main section');

const levelsSection = document.getElementById('levels-section');
const forumSection = document.getElementById('forum-section');
const moderationSection = document.getElementById('moderation-section');

const levelsList = document.getElementById('levels-list');
const addLevelBtn = document.getElementById('add-level-btn');
const levelNameInput = document.getElementById('level-name');
const levelCreatorInput = document.getElementById('level-creator');
const levelIdInput = document.getElementById('level-id');
const levelDifficultySelect = document.getElementById('level-difficulty');

const newModeratorInput = document.getElementById('new-moderator');
const addModeratorBtn = document.getElementById('add-moderator-btn');
const removeModeratorBtn = document.getElementById('remove-moderator-btn');
const moderatorsList = document.getElementById('moderators-list');

const searchLevelInput = document.getElementById('search-level');
const searchBtn = document.getElementById('search-btn');

const forumTopicsContainer = document.getElementById('forum-topics');
const newTopicBtn = document.getElementById('new-topic-btn');

// Инициализация приложения
function init() {
    loadLevels();
    loadModerators();
    loadForumTopics();
    checkAuth();
    
    // Навигация
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            sections.forEach(section => section.classList.remove('active-section'));
            document.getElementById(`${btn.dataset.section}-section`).classList.add('active-section');
        });
    });
    
    // Авторизация
    loginBtn.addEventListener('click', login);
    logoutBtn.addEventListener('click', logout);
    
    // Управление уровнями
    addLevelBtn.addEventListener('click', addLevel);
    
    // Управление модераторами
    addModeratorBtn.addEventListener('click', addModerator);
    removeModeratorBtn.addEventListener('click', removeModerator);
    
    // Поиск
    searchBtn.addEventListener('click', searchLevels);
    
    // Форум
    newTopicBtn.addEventListener('click', createNewTopic);
}

// Функции авторизации
function login() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (username === owner.username && password === owner.password) {
        currentUser = { username, isOwner: true };
        alert('Вы вошли как владелец!');
        updateUI();
        return;
    }
    
    if (moderators.includes(username) {
        if (password === 'moderator123') { // Стандартный пароль для модераторов
            currentUser = { username, isModerator: true };
            alert('Вы вошли как модератор!');
            updateUI();
            return;
        }
    }
    
    alert('Неверные данные!');
}

function logout() {
    currentUser = null;
    usernameInput.value = '';
    passwordInput.value = '';
    updateUI();
}

function checkAuth() {
    if (currentUser) {
        usernameInput.style.display = 'none';
        passwordInput.style.display = 'none';
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
    } else {
        usernameInput.style.display = 'inline-block';
        passwordInput.style.display = 'inline-block';
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
    }
}

// Функции для уровней
function loadLevels() {
    levelsList.innerHTML = '';
    
    levels.forEach(level => {
        const levelCard = document.createElement('div');
        levelCard.className = 'level-card';
        levelCard.innerHTML = `
            <h3>${level.name}</h3>
            <p><strong>Создатель:</strong> ${level.creator}</p>
            <p><strong>ID:</strong> ${level.id}</p>
            <p><strong>Сложность:</strong> ${getDifficultyName(level.difficulty)}</p>
            ${currentUser && (currentUser.isOwner || currentUser.isModerator) ? 
                `<button class="remove-level-btn" data-id="${level.id}">Удалить</button>` : ''}
        `;
        levelsList.appendChild(levelCard);
    });
    
    // Добавляем обработчики для кнопок удаления
    document.querySelectorAll('.remove-level-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (confirm('Вы уверены, что хотите удалить этот уровень?')) {
                removeLevel(e.target.dataset.id);
            }
        });
    });
}

function addLevel() {
    if (!currentUser || (!currentUser.isOwner && !currentUser.isModerator)) {
        alert('Только модераторы могут добавлять уровни!');
        return;
    }
    
    const name = levelNameInput.value.trim();
    const creator = levelCreatorInput.value.trim();
    const id = levelIdInput.value.trim();
    const difficulty = levelDifficultySelect.value;
    
    if (!name || !creator || !id) {
        alert('Заполните все поля!');
        return;
    }
    
    const newLevel = { name, creator, id, difficulty };
    levels.push(newLevel);
    saveData();
    
    levelNameInput.value = '';
    levelCreatorInput.value = '';
    levelIdInput.value = '';
    
    loadLevels();
    alert('Уровень успешно добавлен!');
}

function removeLevel(id) {
    levels = levels.filter(level => level.id !== id);
    saveData();
    loadLevels();
}

function searchLevels() {
    const query = searchLevelInput.value.trim().toLowerCase();
    
    if (!query) {
        loadLevels();
        return;
    }
    
    const filtered = levels.filter(level => 
        level.name.toLowerCase().includes(query) || 
        level.creator.toLowerCase().includes(query) ||
        level.id.toLowerCase().includes(query)
    );
    
    levelsList.innerHTML = '';
    
    filtered.forEach(level => {
        const levelCard = document.createElement('div');
        levelCard.className = 'level-card';
        levelCard.innerHTML = `
            <h3>${level.name}</h3>
            <p><strong>Создатель:</strong> ${level.creator}</p>
            <p><strong>ID:</strong> ${level.id}</p>
            <p><strong>Сложность:</strong> ${getDifficultyName(level.difficulty)}</p>
            ${currentUser && (currentUser.isOwner || currentUser.isModerator) ? 
                `<button class="remove-level-btn" data-id="${level.id}">Удалить</button>` : ''}
        `;
        levelsList.appendChild(levelCard);
    });
    
    // Добавляем обработчики для кнопок удаления
    document.querySelectorAll('.remove-level-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (confirm('Вы уверены, что хотите удалить этот уровень?')) {
                removeLevel(e.target.dataset.id);
            }
        });
    });
}

// Функции для модераторов
function loadModerators() {
    moderatorsList.innerHTML = '';
    
    moderators.forEach(moderator => {
        const item = document.createElement('div');
        item.textContent = moderator;
        moderatorsList.appendChild(item);
    });
}

function addModerator() {
    if (!currentUser || !currentUser.isOwner) {
        alert('Только владелец может добавлять модераторов!');
        return;
    }
    
    const username = newModeratorInput.value.trim();
    
    if (!username) {
        alert('Введите никнейм модератора!');
        return;
    }
    
    if (moderators.includes(username)) {
        alert('Этот пользователь уже модератор!');
        return;
    }
    
    moderators.push(username);
    saveData();
    newModeratorInput.value = '';
    loadModerators();
    alert('Модератор добавлен!');
}

function removeModerator() {
    if (!currentUser || !currentUser.isOwner) {
        alert('Только владелец может удалять модераторов!');
        return;
    }
    
    const username = newModeratorInput.value.trim();
    
    if (!username) {
        alert('Введите никнейм модератора!');
        return;
    }
    
    if (!moderators.includes(username)) {
        alert('Этот пользователь не является модератором!');
        return;
    }
    
    moderators = moderators.filter(m => m !== username);
    saveData();
    newModeratorInput.value = '';
    loadModerators();
    alert('Модератор удален!');
}

// Функции для форума
function loadForumTopics() {
    forumTopicsContainer.innerHTML = '';
    
    forumTopics.forEach(topic => {
        const topicElement = document.createElement('div');
        topicElement.className = 'forum-topic';
        topicElement.innerHTML = `
            <h3>${topic.title}</h3>
            <p>Автор: ${topic.author} | Дата: ${new Date(topic.date).toLocaleString()}</p>
            <p>${topic.content.substring(0, 100)}...</p>
            <button class="view-topic-btn" data-id="${topic.id}">Читать</button>
        `;
        forumTopicsContainer.appendChild(topicElement);
    });
    
    // Добавляем обработчики для кнопок просмотра тем
    document.querySelectorAll('.view-topic-btn').forEach(btn => {
        btn.addEventListener('click', () => viewTopic(btn.dataset.id));
    });
}

function createNewTopic() {
    if (!currentUser) {
        alert('Войдите, чтобы создать тему!');
        return;
    }
    
    const title = prompt('Введите заголовок темы:');
    if (!title) return;
    
    const content = prompt('Введите содержание темы:');
    if (!content) return;
    
    const newTopic = {
        id: Date.now().toString(),
        title,
        content,
        author: currentUser.username,
        date: Date.now(),
        comments: []
    };
    
    forumTopics.push(newTopic);
    saveData();
    loadForumTopics();
}

function viewTopic(id) {
    const topic = forumTopics.find(t => t.id === id);
    if (!topic) return;
    
    forumTopicsContainer.innerHTML = `
        <div class="forum-topic-full">
            <h2>${topic.title}</h2>
            <p>Автор: ${topic.author} | Дата: ${new Date(topic.date).toLocaleString()}</p>
            <div class="topic-content">${topic.content}</div>
            
            <h3>Комментарии (${topic.comments.length})</h3>
            <div class="topic-comments">
                ${topic.comments.map(comment => `
                    <div class="comment">
                        <p><strong>${comment.author}</strong> (${new Date(comment.date).toLocaleString()}):</p>
                        <p>${comment.content}</p>
                    </div>
                `).join('')}
            </div>
            
            ${currentUser ? `
                <div class="add-comment">
                    <textarea id="comment-content" placeholder="Ваш комментарий..."></textarea>
                    <button id="add-comment-btn" data-id="${topic.id}">Отправить</button>
                </div>
            ` : '<p>Войдите, чтобы оставить комментарий</p>'}
            
            <button id="back-to-forum-btn">Назад к форуму</button>
        </div>
    `;
    
    if (currentUser) {
        document.getElementById('add-comment-btn').addEventListener('click', addComment);
    }
    
    document.getElementById('back-to-forum-btn').addEventListener('click', loadForumTopics);
}

function addComment(e) {
    const topicId = e.target.dataset.id;
    const content = document.getElementById('comment-content').value.trim();
    
    if (!content) {
        alert('Введите текст комментария!');
        return;
    }
    
    const topic = forumTopics.find(t => t.id === topicId);
    if (!topic) return;
    
    topic.comments.push({
        author: currentUser.username,
        content,
        date: Date.now()
    });
    
    saveData();
    viewTopic(topicId);
}

// Вспомогательные функции
function getDifficultyName(difficulty) {
    const names = {
        easy: 'Легкий',
        normal: 'Нормальный',
        hard: 'Сложный',
        insane: 'Безумный',
        demon: 'Демон'
    };
    
    return names[difficulty] || difficulty;
}

function saveData() {
    localStorage.setItem('gd-levels', JSON.stringify(levels));
    localStorage.setItem('gd-moderators', JSON.stringify(moderators));
    localStorage.setItem('gd-forum', JSON.stringify(forumTopics));
}

function updateUI() {
    checkAuth();
    
    // Показываем/скрываем секцию модерации
    if (currentUser && (currentUser.isOwner || currentUser.isModerator)) {
        moderationSection.style.display = 'block';
    } else {
        moderationSection.style.display = 'none';
    }
    
    // Обновляем списки
    loadLevels();
    loadModerators();
    loadForumTopics();
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', init);
