import React from 'react';

export default (props) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('src/component', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  //todo: менять подпись (картинку) на перетаскиваемом элементе в завис от ротации

  if (!props.flipFlag) {
    return (
      <aside>
        <div className="description">You can drag these nodes to the pane on the right.</div>
        <div className="dndnode input" onDragStart={(event) => onDragStart(event, '1x1')} draggable>
          1x1
        </div>
        <div className="dndnode" onDragStart={(event) => onDragStart(event, '3x1')} draggable>
          3x1
        </div>
        <div className="dndnode output" onDragStart={(event) => onDragStart(event, '5x1')} draggable>
          5x1
        </div>
      </aside>
    );
  } else {
    return (
      <aside>
        <div className="description">You can drag these nodes to the pane on the right.</div>
        <div className="dndnode input" onDragStart={(event) => onDragStart(event, '1x1')} draggable>
          1x1
        </div>
        <div className="dndnode" onDragStart={(event) => onDragStart(event, '1x3')} draggable>
          1x3
        </div>
        <div className="dndnode output" onDragStart={(event) => onDragStart(event, '1x5')} draggable>
          1x5
        </div>
      </aside>
    );
  }
};