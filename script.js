let dictionary = {};
let currentWordId = null;

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

document.addEventListener('DOMContentLoaded', async function() {
    await loadDictionary();
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
    const searchSection = document.getElementById('searchSection');
    const registerSection = document.getElementById('registerSection');
    
    // Registration form elements
    const newWord = document.getElementById('newWord');
    const newAccent = document.getElementById('newAccent');
    const newPronunciation = document.getElementById('newPronunciation');
    const newExample = document.getElementById('newExample');
    const registerBtn = document.getElementById('registerBtn');
    const clearFormBtn = document.getElementById('clearFormBtn');

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

        // Store the current word ID for deletion
        currentWordId = result.id;
        deleteBtn.style.display = result.id ? 'inline-block' : 'none';

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
        deleteBtn.style.display = 'none';
        currentWordId = null;
        wordInput.focus();
    }

    function switchTab(activeTab, activeSection, inactiveTab, inactiveSection) {
        activeTab.classList.add('active');
        inactiveTab.classList.remove('active');
        activeSection.style.display = 'block';
        inactiveSection.style.display = 'none';
        
        // Clear results when switching tabs
        resultSection.style.display = 'none';
        noResult.style.display = 'none';
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

    // Tab event listeners
    searchTab.addEventListener('click', () => {
        switchTab(searchTab, searchSection, registerTab, registerSection);
    });

    registerTab.addEventListener('click', () => {
        switchTab(registerTab, registerSection, searchTab, searchSection);
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

    newExample.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            registerWord();
        }
    });
});