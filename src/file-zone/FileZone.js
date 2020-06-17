import React from 'react';
import s from './FileZone.module.css';
import cn from 'classnames';

const FileZone = ({charObjectList, selectedWord, selectWord, applySynonym}) => {

    const selectWordOnDoubleClick = (currentPosition) => {
        const separators = [" ", ",", "."];
        const start = charObjectList
            .slice(0, currentPosition)
            .reverse()
            .find(o => separators.includes(o.char));
        const end = charObjectList
            .slice(currentPosition, charObjectList.size)
            .find(o => separators.includes(o.char));
        selectWord((start && start.position + 1) || 0,
            (end && end.position) || charObjectList.size);
    }

    const CharElements = charObjectList
        .map(object => {
            const key = object.position;
            return (
                <span key={key}>
                    {key === selectedWord.start &&
                    <PopupElement synonyms={selectedWord.synonyms} applySynonym={applySynonym}/>}
                    <span className={cn({[s.underLined]: object["underLined"]},
                        {[s.bold]: object["bold"]},
                        {[s.italic]: object["italic"]})}
                          onDoubleClick={() => selectWordOnDoubleClick(key)}>
                        {object.char}
                    </span>
                </span>
            )
        });

    return (
        <div className={s.fileZone}>
            <div className={s.file}>
                {CharElements}
            </div>
        </div>
    );
}

const PopupElement = ({synonyms, applySynonym}) => {
    return (
        <div className={s.popup}>
            <span className={cn(s.popuptext, s.show)}>
                {synonyms.length > 0 ?
                    synonyms.map(synonym => (<div className={s.synonym} key={synonym}
                                                  onClick={() => applySynonym(synonym)}>{synonym}</div>))
                    : "Can't find synonyms"}
            </span>
        </div>);
}

export default FileZone;
