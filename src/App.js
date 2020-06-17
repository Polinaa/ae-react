import React, {useEffect, useState} from 'react';
import './App.css';
import ControlPanel from "./control-panel/ControlPanel";
import FileZone from "./file-zone/FileZone";
import getMockText from './text.service';
import {DatamuseApi} from "./api/datamuse";

const App = () => {

    let [charObjectList, setCharObjectList] = useState([]);
    let [selectedWord, setSelectedWord] = useState({word: '', start: null, end: null, synonyms: []});

    useEffect(() => {
        getMockText().then((result) => {
            setCharObjectList(textToCharObjectList(result));
        });
    }, []);

    const textToCharObjectList = (text = '') => {
        let charObjectList = [];
        for (let i = 0; i < text.length; i++) {
            charObjectList.push({position: i, char: text.charAt(i), bold: false, italic: false, underLined: false});
        }
        return charObjectList;
    }

    const setStyle = (style, value) => {
        if (!selectedWord.start && !selectedWord.end) {
            return;
        }
        let updatedList = charObjectList
            .map(o => (o.position >= selectedWord.start && o.position < selectedWord.end)
                ? {...o, [style]: value}
                : o);
        setCharObjectList(updatedList);
    }

    const selectWord = (start, end) => {
        if (!start && !end) {
            setSelectedWord({word: '', start: null, end: null, synonyms: []});
            return;
        }
        const word = charObjectList
            .filter(o => o.position >= start && o.position < end)
            .map(o => o.char)
            .join('');
        DatamuseApi.getSynonyms(word).then((response) => {
            if (response.status === 200 && response.data) {
                const synonyms = response.data.slice(0, 5).map(o => o.word);
                setSelectedWord({word, start, end, synonyms});
            } else {
                setSelectedWord({word, start, end, synonyms: []})
            }
        });
    }

    const applySynonym = (synonym) => {
        if (!synonym) {
            return;
        }
        const synonymBatch = textToCharObjectList(synonym);
        let updatedList = [...charObjectList.filter(o => o.position < selectedWord.start),
            ...updatePositions(synonymBatch, selectedWord.start),
            ...updatePositions(charObjectList.filter(o => o.position >= selectedWord.end), selectedWord.start + synonymBatch.length)];
        selectWord(null, null);
        setCharObjectList(updatedList);
    }

    const updatePositions = (objects, startPosition) => {
        return objects.map(o => ({...o, position: startPosition++}));
    }

    return (
        <div className="App">
            <header>
                <span>Simple Text Editor</span>
            </header>
            <main>
                <ControlPanel currentObject={charObjectList.find(o => o.position === selectedWord.start) || {}}
                              setStyle={setStyle}/>
                <FileZone charObjectList={charObjectList}
                          selectedWord={selectedWord}
                          applySynonym={applySynonym}
                          selectWord={selectWord}
                />
            </main>
        </div>
    );

}

export default App;
