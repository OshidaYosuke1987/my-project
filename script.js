let dictionary = {};
let currentWordId = null;
let isAuthenticated = false;

async function loadDictionary() {
    try {
        // Try API first, fallback to JSON file for backwards compatibility
        const response = await fetch('/api/words');
        if (response.ok) {
            const wordsArray = await response.json();
            // Convert array to dictionary format
            dictionary = {};
            wordsArray.forEach(word => {
                dictionary[word.word] = {
                    id: word.id,
                    accent: word.accent,
                    pronunciation: word.pronunciation,
                    example: word.example
                };
            });
        } else {
            // Fallback to JSON file
            const jsonResponse = await fetch('dictionary.json');
            dictionary = await jsonResponse.json();
        }
    } catch (error) {
        console.error('辞書の読み込みに失敗しました:', error);
        // Try fallback to JSON file
        try {
            const jsonResponse = await fetch('dictionary.json');
            dictionary = await jsonResponse.json();
        } catch (fallbackError) {
            console.error('JSONファイルの読み込みも失敗しました:', fallbackError);
        }
    }
}

// Check authentication status
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        isAuthenticated = data.isAuthenticated;
        updateUIBasedOnAuth(data);
        return data;
    } catch (error) {
        console.error('Auth check error:', error);
        isAuthenticated = false;
        return { isAuthenticated: false };
    }
}

// Update UI based on authentication status
function updateUIBasedOnAuth(authData) {
    const loginForm = document.getElementById('loginForm');
    const adminPanel = document.getElementById('adminPanel');
    const adminUser = document.getElementById('adminUser');
    const registerBtn = document.getElementById('registerBtn');
    const deleteBtn = document.getElementById('deleteBtn');

    if (authData.isAuthenticated) {
        loginForm.style.display = 'none';
        adminPanel.style.display = 'block';
        adminUser.textContent = authData.username || 'admin';
        // Show admin-only functions
        if (registerBtn) registerBtn.style.display = 'inline-block';
        if (deleteBtn && currentWordId) deleteBtn.style.display = 'inline-block';
    } else {
        loginForm.style.display = 'block';
        adminPanel.style.display = 'none';
        // Hide admin-only functions for non-authenticated users
        if (registerBtn) registerBtn.style.display = 'none';
        if (deleteBtn) deleteBtn.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    await loadDictionary();
    await checkAuthStatus();
    const wordInput = document.getElementById('wordInput');
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resultSection = document.getElementById('resultSection');
    const noResult = document.getElementById('noResult');
    const searchedWord = document.getElementById('searchedWord');
    const accentPattern = document.getElementById('accentPattern');
    const pronunciation = document.getElementById('pronunciation');
    const example = document.getElementById('example');
    const deleteBtn = document.getElementById('deleteBtn');
    
    // Tab elements
    const searchTab = document.getElementById('searchTab');
    const registerTab = document.getElementById('registerTab');
    const adminTab = document.getElementById('adminTab');
    const searchSection = document.getElementById('searchSection');
    const registerSection = document.getElementById('registerSection');
    const adminSection = document.getElementById('adminSection');
    
    // Registration form elements
    const newWord = document.getElementById('newWord');
    const newAccent = document.getElementById('newAccent');
    const newPronunciation = document.getElementById('newPronunciation');
    const newExample = document.getElementById('newExample');
    const registerBtn = document.getElementById('registerBtn');
    const clearFormBtn = document.getElementById('clearFormBtn');

    // Admin form elements
    const adminUsername = document.getElementById('adminUsername');
    const adminPassword = document.getElementById('adminPassword');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const quickLoginBtn = document.getElementById('quickLoginBtn');

    // Edit modal elements
    const editBtn = document.getElementById('editBtn');
    const editModal = document.getElementById('editModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const editWord = document.getElementById('editWord');
    const editAccent = document.getElementById('editAccent');
    const editPronunciation = document.getElementById('editPronunciation');
    const editExample = document.getElementById('editExample');
    const saveEditBtn = document.getElementById('saveEditBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    function searchWord() {
        const word = wordInput.value.trim();
        
        if (!word) {
            alert('単語を入力してください。');
            return;
        }

        const result = dictionary[word];
        
        if (result) {
            displayResult(word, result);
        } else {
            displayNoResult();
        }
    }

    function displayResult(word, result) {
        searchedWord.textContent = word;
        accentPattern.innerHTML = createAccentDisplay(result.accent);
        pronunciation.textContent = result.pronunciation;
        example.textContent = result.example;

        // Store the current word ID for deletion and editing
        currentWordId = result.id;
        editBtn.style.display = (result.id && isAuthenticated) ? 'inline-block' : 'none';
        deleteBtn.style.display = (result.id && isAuthenticated) ? 'inline-block' : 'none';

        resultSection.style.display = 'block';
        noResult.style.display = 'none';
    }

    function displayNoResult() {
        resultSection.style.display = 'none';
        noResult.style.display = 'block';
    }

    function createAccentDisplay(accentText) {
        return accentText.replace(/↗/g, '<span class="accent-up">↗</span>')
                        .replace(/↘/g, '<span class="accent-down">↘</span>');
    }

    function clearSearch() {
        wordInput.value = '';
        resultSection.style.display = 'none';
        noResult.style.display = 'none';
        editBtn.style.display = 'none';
        deleteBtn.style.display = 'none';
        currentWordId = null;
        wordInput.focus();
    }

    function switchTab(activeTab, activeSection, ...inactiveTabs) {
        // Remove active class from all tabs
        [searchTab, registerTab, adminTab].forEach(tab => {
            if (tab) tab.classList.remove('active');
        });

        // Hide all sections
        [searchSection, registerSection, adminSection].forEach(section => {
            if (section) section.style.display = 'none';
        });

        // Activate selected tab and section
        if (activeTab) activeTab.classList.add('active');
        if (activeSection) activeSection.style.display = 'block';

        // Clear results when switching tabs
        if (resultSection) resultSection.style.display = 'none';
        if (noResult) noResult.style.display = 'none';
    }

    async function registerWord() {
        const word = newWord.value.trim();
        const accent = newAccent.value.trim();
        const pronunciationValue = newPronunciation.value.trim();
        const exampleValue = newExample.value.trim();

        if (!word || !accent || !pronunciationValue || !exampleValue) {
            alert('すべての項目を入力してください。');
            return;
        }

        try {
            const response = await fetch('/api/words', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    word: word,
                    accent: accent,
                    pronunciation: pronunciationValue,
                    example: exampleValue
                }),
            });

            if (response.ok) {
                const result = await response.json();
                alert(`単語「${word}」を登録しました。`);
                clearRegistrationForm();
                
                // Reload dictionary to include new word
                await loadDictionary();
            } else {
                const error = await response.json();
                alert(`登録に失敗しました: ${error.error}`);
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('登録中にエラーが発生しました。');
        }
    }

    function clearRegistrationForm() {
        newWord.value = '';
        newAccent.value = '';
        newPronunciation.value = '';
        newExample.value = '';
        newWord.focus();
    }

    function quickLogin() {
        adminUsername.value = 'admin';
        adminPassword.value = 'secret';
        loginUser();
    }

    async function loginUser() {
        const username = adminUsername.value.trim();
        const password = adminPassword.value.trim();

        if (!username || !password) {
            alert('ユーザー名とパスワードを入力してください。');
            return;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const result = await response.json();
                alert('ログインしました。');
                adminUsername.value = '';
                adminPassword.value = '';
                await checkAuthStatus();
            } else {
                const error = await response.json();
                alert(`ログインに失敗しました: ${error.error}`);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('ログイン中にエラーが発生しました。');
        }
    }

    async function logoutUser() {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
            });

            if (response.ok) {
                alert('ログアウトしました。');
                await checkAuthStatus();
                switchTab(searchTab, searchSection);
            } else {
                alert('ログアウト中にエラーが発生しました。');
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert('ログアウト中にエラーが発生しました。');
        }
    }

    async function deleteWord() {
        if (!currentWordId) {
            alert('削除する単語が選択されていません。');
            return;
        }

        const wordToDelete = searchedWord.textContent;
        if (!confirm(`本当に「${wordToDelete}」を削除しますか？\nこの操作は取り消すことができません。`)) {
            return;
        }

        try {
            const response = await fetch(`/api/words/${currentWordId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert(`単語「${wordToDelete}」を削除しました。`);
                clearSearch();
                // Reload dictionary to remove deleted word
                await loadDictionary();
            } else {
                const error = await response.json();
                alert(`削除に失敗しました: ${error.error}`);
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('削除中にエラーが発生しました。');
        }
    }

    function openEditModal() {
        if (!currentWordId) {
            alert('編集する単語が選択されていません。');
            return;
        }

        const wordToEdit = searchedWord.textContent;
        const wordData = dictionary[wordToEdit];

        if (!wordData) {
            alert('単語データが見つかりません。');
            return;
        }

        editWord.value = wordToEdit;
        editAccent.value = wordData.accent;
        editPronunciation.value = wordData.pronunciation;
        editExample.value = wordData.example;

        editModal.style.display = 'flex';
    }

    function closeEditModalFunc() {
        editModal.style.display = 'none';
        editWord.value = '';
        editAccent.value = '';
        editPronunciation.value = '';
        editExample.value = '';
    }

    async function saveEditedWord() {
        const word = editWord.value.trim();
        const accent = editAccent.value.trim();
        const pronunciationValue = editPronunciation.value.trim();
        const exampleValue = editExample.value.trim();

        if (!word || !accent || !pronunciationValue || !exampleValue) {
            alert('すべての項目を入力してください。');
            return;
        }

        try {
            const response = await fetch(`/api/words/${currentWordId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    word: word,
                    accent: accent,
                    pronunciation: pronunciationValue,
                    example: exampleValue
                }),
            });

            if (response.ok) {
                const result = await response.json();
                alert(`単語「${word}」を更新しました。`);
                closeEditModalFunc();

                // Reload dictionary to include updated word
                await loadDictionary();

                // Refresh the display with updated data
                const updatedWordData = dictionary[word];
                if (updatedWordData) {
                    displayResult(word, updatedWordData);
                }
            } else {
                const error = await response.json();
                alert(`更新に失敗しました: ${error.error}`);
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('更新中にエラーが発生しました。');
        }
    }

    // Tab event listeners
    searchTab.addEventListener('click', () => {
        switchTab(searchTab, searchSection);
    });

    registerTab.addEventListener('click', () => {
        if (!isAuthenticated) {
            alert('単語登録には管理者ログインが必要です。');
            switchTab(adminTab, adminSection);
            return;
        }
        switchTab(registerTab, registerSection);
    });

    adminTab.addEventListener('click', () => {
        switchTab(adminTab, adminSection);
    });

    // Search functionality event listeners
    searchBtn.addEventListener('click', searchWord);
    clearBtn.addEventListener('click', clearSearch);
    
    wordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchWord();
        }
    });

    wordInput.addEventListener('input', function() {
        if (!this.value.trim()) {
            resultSection.style.display = 'none';
            noResult.style.display = 'none';
        }
    });

    // Registration functionality event listeners
    registerBtn.addEventListener('click', registerWord);
    clearFormBtn.addEventListener('click', clearRegistrationForm);
    deleteBtn.addEventListener('click', deleteWord);

    // Edit functionality event listeners
    editBtn.addEventListener('click', openEditModal);
    closeEditModal.addEventListener('click', closeEditModalFunc);
    cancelEditBtn.addEventListener('click', closeEditModalFunc);
    saveEditBtn.addEventListener('click', saveEditedWord);

    // Close modal when clicking outside of it
    editModal.addEventListener('click', function(e) {
        if (e.target === editModal) {
            closeEditModalFunc();
        }
    });

    // Admin functionality event listeners
    loginBtn.addEventListener('click', loginUser);
    logoutBtn.addEventListener('click', logoutUser);
    quickLoginBtn.addEventListener('click', quickLogin);

    // Enter key support for login
    adminPassword.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginUser();
        }
    });

    newExample.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            registerWord();
        }
    });
});