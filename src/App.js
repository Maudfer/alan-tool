import React, { useState, useMemo } from 'react';

function App() {
  const [letters, setLetters] = useState([]);
  const [letterInput, setLetterInput] = useState("");

  const [wordInput, setWordInput] = useState("");
  const [words, setWords] = useState([]);

  // Checks if a given word can be formed from the available letters
  const canFormWord = (word, letterArray) => {
    const letterCount = {};
    for (let l of letterArray) {
      letterCount[l] = (letterCount[l] || 0) + 1;
    }

    for (let w of word) {
      if (!letterCount[w]) return false;
      letterCount[w]--;
    }
    return true;
  };

  // Generate all permutations of an array of words
  const getPermutations = (arr) => {
    if (arr.length <= 1) return arr.map(w => [w]);
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      const current = arr[i];
      const remaining = arr.slice(0, i).concat(arr.slice(i+1));
      const permsOfRemaining = getPermutations(remaining);
      for (let perm of permsOfRemaining) {
        result.push([current, ...perm]);
      }
    }
    return result;
  };

  // Compute permutations whenever words change
  const permutations = useMemo(() => {
    if (words.length === 0) return [];
    const perms = getPermutations(words);
    // Join each permutation and sort the resulting array
    return perms.map(p => p.join('')).sort();
  }, [words]);

  const handleLetterKeyPress = (e) => {
    if (e.key === 'Enter') {
      submitLetters();
    }
  };

  const submitLetters = () => {
    // Extract only letters and convert to lowercase
    const newLetters = (letterInput.toLowerCase().match(/[a-z]/g) || []);
    const sortedLetters = [...letters, ...newLetters].sort();
    setLetters(sortedLetters);
    setLetterInput("");
  };

  const handleWordChange = (e) => {
    setWordInput(e.target.value.toLowerCase());
  };

  const handleWordKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (canFormWord(wordInput, letters)) {
        // Only add if it doesn't already exist
        if (!words.includes(wordInput)) {
          let tempLetters = [...letters];
          for (let w of wordInput) {
            const index = tempLetters.indexOf(w);
            if (index > -1) {
              tempLetters.splice(index, 1);
            }
          }
          // Sort letters after removal
          tempLetters.sort();
          setLetters(tempLetters);

          const newWords = [...words, wordInput];
          newWords.sort();
          setWords(newWords);
        }
        setWordInput("");
      }
    }
  };

  const removeLetter = (index) => {
    setLetters(prev => {
      const newLetters = [...prev];
      newLetters.splice(index, 1);
      return newLetters.sort();
    });
  };

  const removeWord = (index) => {
    const word = words[index];
    // Return letters to the pool (ensure uniqueness and sort)
    setLetters(prev => {
      const combined = [...prev, ...word.split('')];
      return Array.from(new Set(combined)).sort();
    });

    setWords(prev => {
      const newWords = [...prev];
      newWords.splice(index, 1);
      newWords.sort();
      return newWords;
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const wordInputStyle = {
    backgroundColor: wordInput && canFormWord(wordInput, letters) ? '#c2f5c2' : 'white'
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Alan(The)zoka Challenge</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          Letters:
          <input 
            type="text" 
            value={letterInput} 
            onChange={e => setLetterInput(e.target.value)}
            onKeyPress={handleLetterKeyPress}
            onBlur={submitLetters}
            placeholder="Type letters in any format"
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          Word:
          <input 
            type="text" 
            value={wordInput}
            onChange={handleWordChange}
            onKeyPress={handleWordKeyPress}
            placeholder="Type a word"
            style={{ marginLeft: '10px', ...wordInputStyle }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Letters</h2>
        <div className="box" style={{ border: '1px solid #ccc', padding: '10px', minHeight: '50px' }}>
          {letters.map((letter, index) => (
            <span 
              key={index} 
              onDoubleClick={() => removeLetter(index)} 
              style={{ 
                display: 'inline-block', 
                margin: '5px', 
                padding: '5px', 
                background: '#eee', 
                cursor: 'pointer' 
              }}
              title="Double click to remove"
            >
              {letter}
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Words</h2>
        <div className="box" style={{ border: '1px solid #ccc', padding: '10px', minHeight: '50px' }}>
          {words.map((word, index) => (
            <span 
              key={index} 
              onDoubleClick={() => removeWord(index)} 
              onClick={() => copyToClipboard(word)}
              style={{ 
                display: 'inline-block', 
                margin: '5px', 
                padding: '5px', 
                background: '#cdf0ff', 
                cursor: 'pointer' 
              }}
              title="Double click to remove, click to copy"
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2>Permutations</h2>
        <div className="box" style={{ border: '1px solid #ccc', padding: '10px', minHeight: '50px' }}>
          {permutations.map((perm, index) => (
            <span
              key={index}
              onClick={() => copyToClipboard(perm)}
              style={{
                display: 'inline-block',
                margin: '5px',
                padding: '5px',
                background: '#ffd386',
                cursor: 'pointer'
              }}
              title="Click to copy"
            >
              {perm}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
