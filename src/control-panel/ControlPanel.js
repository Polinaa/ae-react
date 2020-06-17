import React from 'react';
import s from './ControlPanel.module.css';
import cn from 'classnames';

const ControlPanel = ({currentObject, setStyle}) => {
    const applyStyle = (style) => {
        const enabled = currentObject[style];
        setStyle(style, !enabled);
    }
    return (
        <div className={s.controlPanel}>
            <div className={s.formatActions}>
                <button className={cn({[s.selectedStyle]: currentObject["bold"]})}
                        type="button"
                        onClick={() => applyStyle("bold")}><b>B</b></button>
                <button className={cn({[s.selectedStyle]: currentObject["italic"]})}
                        type="button"
                        onClick={() => applyStyle("italic")}><i>I</i></button>
                <button className={cn({[s.selectedStyle]: currentObject["underLined"]})}
                        type="button"
                        onClick={() => applyStyle("underLined")}><u>U</u></button>
            </div>
        </div>
    );
}

export default ControlPanel;
