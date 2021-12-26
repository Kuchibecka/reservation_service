import React, {useState, useRef} from 'react';
import {range} from "lodash-es";
import {Button} from "@material-ui/core";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  removeElements,
  Controls, Background,
} from 'react-flow-renderer';

import SidebarComponent from './SidebarComponent';

// import './dnd.css';

const graphStyles = {width: "100%", height: "500px"};

const initialElements = [
  {
    id: '1',
    type: 'custom',
    data: {label: 'input node'},
    position: {x: 250, y: 150},
  },
];

const CustomNode = ({data}) => ( // https://reactflow.dev/examples/custom-node/
  <>
    <div style={{
      height: 10,
      width: 10,
      color: "RED",
      backgroundColor: "BLACK"
    }}/>
  </>
);
const nodeTypes = {
  custom: CustomNode,
}

let id = 1;
const getId = () => `dndnode_${id++}`;


const DnDFlow = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [elements, setElements] = useState(initialElements);
    const [deleteMode, setDeleteMode] = useState(false);
    /*const onConnect = (params) => setElements((els) => addEdge(params, els));
    const onElementsRemove = (elementsToRemove) =>
      setElements((els) => removeElements(elementsToRemove, els));*/

    const onLoad = (_reactFlowInstance) =>
      setReactFlowInstance(_reactFlowInstance);

    const saveButton = () => {
      console.log("Elements: ", elements);
      // console.log("roomId: ", roomId);
    }

    const modCheck = () => {
      if (deleteMode) {
        return (
          <h5 style={{color: "darkred"}}>
            РЕЖИМ УДАЛЕНИЯ АКТИВИРОВАН
          </h5>
        )
      }
      /*if (this.state.editMode) {
        return (
          <h5 style={{color: "darkorange"}}>
            РЕЖИМ РЕДАКТИРОВАНИЯ АКТИВИРОВАН
          </h5>
        )
      }*/
    }

    const onDragOver = (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    };

    const onNodeDragStop = (event, node) => {
      console.log("Moving element: ", node);
      console.log("Initial  state before set: ", elements);
      event.preventDefault();
      let flag = true;
      console.log("Attempt to add: ", node.position);
      let buf = elements;
      for (let i in range(0, buf.length)) {
        console.log("Current element position is: ", buf[i].position);
        if (elements[i].id === node.id) {
          buf[i].position = node.position;
          console.log("state to be set: ", buf);
        }
      }
      setElements(buf);
      console.log("set state: ", elements)
    }

    const onElementClick = (event, element) => {
      if (deleteMode) {
        let id = element.id;
        console.log("Id I want to delete is ", id);
        // бля, надо как-то заранее знать надо ли отправлять запрос к серверу?,
        // или мы только добавили этот элемент => начинается с "dndnode_"
        // (сам автоматом присобачиваю при добавлении)
        // а вот перед записью в бд на сервере мы забиваем на этот id и определяем UUID
        let buf = elements;
        console.log("before delete: ", elements);
        let newElements = [];
        if (id.startsWith("dndnode_")) {
          for (let i in range(0, elements.length)) {
            if (buf[i].id !== id) {
              const newNode = {
                id: buf[i].id,
                type: "custom",
                position: buf[i].position,
                data: {label: ``},
              };
              newElements.push(newNode);
            }
          }
          setElements(newElements);
          console.log("after delete: ", elements);
        } else {
          console.log("Отправка запроса к бд, а затееееем, как сверху, удаление со схемы тут, на фронте")
        }
      }
    }

    const onDrop = (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      let flag = true;
      for (let i in range(0, elements.length)) {
        if (elements[i].position.x === position.x && elements[i].position.y === position.y) {
          flag = false;
        }
      }

      if (flag) {
        const newNode = {
          id: getId(),
          type: "custom",
          position,
          data: {label: `${type} node`},
        };

        setElements((es) => es.concat(newNode));
      }
    };

    return (
      <div className="dndflow">
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              elements={elements}
              /*onConnect={onConnect}
              onElementsRemove={onElementsRemove}*/
              onLoad={onLoad}
              style={graphStyles}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeDragStop={onNodeDragStop}
              onElementClick={onElementClick}
              nodeTypes={nodeTypes}
              snapToGrid={true}
              snapGrid={[10, 10]}
            >
              <Controls/>
              <Background
                color="#333"
                variant={'lines'}
                gap={10}
                style={{left: 10, right: 10, top: 10}}
              />
            </ReactFlow>
          </div>
          <div>
            {modCheck()}
          </div>
          <SidebarComponent/>
        </ReactFlowProvider>
        <Button
          onClick={() => saveButton()}
          // startIcon={<DeleteIcon style={{color: "#ff5555"}}/>}
        >
          Сохранить
        </Button>
        <Button
          onClick={() => setDeleteMode(!deleteMode)}
          // startIcon={<DeleteIcon style={{color: "#ff5555"}}/>}
        >
          Режим удаления
        </Button>
      </div>
    );
  }
;

export default DnDFlow;