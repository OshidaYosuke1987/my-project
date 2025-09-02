const dictionary = {
    'こんにちは': {
        accent: 'こ↗んに↘ちは',
        pronunciation: 'コ↗ンニ↘チハ',
        example: '「こ↗んに↘ちは、元気でっか？」'
    },
    'ありがとう': {
        accent: 'あ↗りが↘とう',
        pronunciation: 'ア↗リガ↘トウ',
        example: '「あ↗りが↘とう、おおきに！」'
    },
    'おいしい': {
        accent: 'お↗いし↘い',
        pronunciation: 'オ↗イシ↘イ',
        example: '「この料理、めっちゃお↗いし↘いわ〜」'
    },
    'きれい': {
        accent: 'き↗れ↘い',
        pronunciation: 'キ↗レ↘イ',
        example: '「あの子、ほんまき↗れ↘いやなあ」'
    },
    'おもしろい': {
        accent: 'お↗もしろ↘い',
        pronunciation: 'オ↗モシロ↘イ',
        example: '「あの映画、めっちゃお↗もしろ↘かったで〜」'
    },
    'すごい': {
        accent: 'す↗ご↘い',
        pronunciation: 'ス↗ゴ↘イ',
        example: '「君、ほんます↗ご↘いなあ！」'
    },
    'わからない': {
        accent: 'わ↗から↘ない',
        pronunciation: 'ワ↗カラ↘ナイ',
        example: '「それ、ようわ↗から↘んわ〜」'
    },
    'だいじょうぶ': {
        accent: 'だい↗じょう↘ぶ',
        pronunciation: 'ダイ↗ジョウ↘ブ',
        example: '「だい↗じょう↘ぶやで、心配せんでええよ」'
    },
    'やばい': {
        accent: 'や↗ば↘い',
        pronunciation: 'ヤ↗バ↘イ',
        example: '「時間、や↗ば↘いんちゃう？」'
    },
    'かわいい': {
        accent: 'か↗わい↘い',
        pronunciation: 'カ↗ワイ↘イ',
        example: '「あの犬、めっちゃか↗わい↘いやん！」'
    },
    'たのしい': {
        accent: 'た↗のし↘い',
        pronunciation: 'タ↗ノシ↘イ',
        example: '「今日は、ほんまた↗のし↘かったわ〜」'
    },
    'つまらない': {
        accent: 'つ↗まら↘ない',
        pronunciation: 'ツ↗マラ↘ナイ',
        example: '「この番組、つ↗まら↘んなあ」'
    },
    'おおきに': {
        accent: 'お↗おき↘に',
        pronunciation: 'オ↗オキ↘ニ',
        example: '「おおきに、助かったわ〜」'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const wordInput = document.getElementById('wordInput');
    const searchBtn = document.getElementById('searchBtn');
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

    searchBtn.addEventListener('click', searchWord);
    
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