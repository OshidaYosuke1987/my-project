let dictionary = {};

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
        wordInput.focus();
    }

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
});