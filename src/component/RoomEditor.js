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
import RoomService from "../service/RoomService";
import axios from "axios";

// import './dnd.css';

const graphStyles = {width: "100%", height: "500px"};

const initialElements = [
    {
        id: '1',
        type: 'custom',
        data: {label: ''},
        position: {x: 250, y: 150},
    },
    {
        id: '2',
        type: 'custom',
        data: {label: ''},
        position: {x: 350, y: 250},
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

let Vgid = 1;
const getVGId = () => `v_${Vgid++}`;

let Ggid = 1;
const getGGId = () => `g_${Ggid++}`;

let rotateMode = false;

const DnDFlow = (props) => {
      const reactFlowWrapper = useRef(null);
      // console.log("Tables: ", props.tables);
      const [reactFlowInstance, setReactFlowInstance] = useState(null);
      const [elements, setElements] = useState(initialElements);
      const [deleteMode, setDeleteMode] = useState(false);
      const [rotateMode, setRotateMode] = useState(false);
      const [flipFlag, setFlipFlag] = useState(false);

      // const promise = RoomService.getHallTables("Claude%20Monet", "0");
      // let tables;
      console.log(elements);


      const onLoad = (_reactFlowInstance) =>
        setReactFlowInstance(_reactFlowInstance);

      const saveButton = () => {
          console.log("Elements: ", elements);
      }

      const modCheck = () => {
          if (deleteMode) {
              return (
                <h5 style={{color: "darkred"}}>
                    РЕЖИМ УДАЛЕНИЯ АКТИВИРОВАН
                </h5>
              )
          }
          if (rotateMode) {
              return (
                <h5 style={{color: "yellow"}}>
                    РЕЖИМ ПОВОРОТА ЭЛЕМЕНТОВ АКТИВИРОВАН
                </h5>
              )
          }
      }

      const onDragOver = (event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = 'move';
      };

      const onNodeDragStop = (event, node) => {
          event.preventDefault();
          let flag = true;
          let buf = elements;
          for (let i in range(0, buf.length)) {
              if (elements[i].id === node.id) {
                  buf[i].position = node.position;
              }
          }
          setElements(buf);
      }

      const onElementClick = (event, element) => {
          if (deleteMode) {
              let id = element.id;
              // бля, надо как-то заранее знать надо ли отправлять запрос к серверу?,
              // или мы только добавили этот элемент => начинается с "dndnode_"
              // (сам автоматом присобачиваю при добавлении)
              // а вот перед записью в бд на сервере мы забиваем на этот id и определяем UUID
              let buf = elements;
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
              } else {
                  console.log("Отправка запроса к бд, а затееееем, как сверху, удаление со схемы тут, на фронте")
              }
          } else if (rotateMode) {
              let gid = element.data.label;
              console.log(gid.substring(0))
              let buf = elements;
              if (gid.substring(0, 1) === "v") {
                  let maxY = buf[0].position.y;
                  for (let i = 0; i < elements.length; i++) {
                      if (buf[i].position.y < maxY)
                          maxY = buf[i].position.y;
                  }
                  let minY = maxY;
                  let elementItself = [];
                  let other = [];
                  for (let i = 0; i < elements.length; i++) {
                      if (buf[i].data.label === gid) {
                          elementItself.push(buf[i]);
                          if (buf[i].position.y > minY) {
                              minY = buf[i].position.y;
                          }
                      } else {
                          other.push(buf[i]);
                      }
                  }
                  let rotatedElements = [];
                  for (let j = 0; j < 5; j++) {
                      for (let i = 0; i < elementItself.length; i++) {
                          if (elementItself[i].position.y === minY - 10 * j) {
                              let position = {
                                  x: elementItself[i].position.x + 10 * j,
                                  y: elementItself[i].position.y + 10 * j,
                              };
                              let rotatedEl = {
                                  id: elementItself[i].id,
                                  type: "custom",
                                  position: position,
                                  data: {label: "g" + elementItself[i].data.label.substring(1)},
                              };
                              other.push(rotatedEl);
                              rotatedElements.push(rotatedEl);
                          }
                      }
                  }
                  setElements(other);
              } else if (gid.substring(0, 1) === "g") {
                  let buf = elements;
                  let maxX = buf[0].position.x;
                  for (let i = 0; i < elements.length; i++) {
                      if (buf[i].position.x > maxX) {
                          maxX = buf[i].position.x;
                      }
                  }
                  let minX = maxX;
                  let elementItself = [];
                  let other = [];
                  for (let i = 0; i < elements.length; i++) {
                      if (buf[i].data.label === gid) {
                          elementItself.push(buf[i]);
                          if (buf[i].position.x < minX) {
                              minX = buf[i].position.x;
                          }
                      } else {
                          other.push(buf[i]);
                      }
                  }
                  for (let j = 0; j < 5; j++) {
                      for (let i = 0; i < elementItself.length; i++) {
                          if (elementItself[i].position.x === minX + 10 * j) {
                              let position = {
                                  x: elementItself[i].position.x - 10 * j,
                                  y: elementItself[i].position.y - 10 * j,
                              };
                              let rotatedEl = {
                                  id: elementItself[i].id,
                                  type: "custom",
                                  position: position,
                                  data: {label: "v" + elementItself[i].data.label.substring(1)},
                              };
                              other.push(rotatedEl);
                          }
                      }
                  }
                  setElements(other);
              }
          }
      }

      const onDrop = (event) => {
          event.preventDefault();
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          const type = event.dataTransfer.getData('src/component');
          let position = reactFlowInstance.project({
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
              // если растянут вдоль y (элементы типа 1x*)
              if (Number(type.substring(0, type.indexOf('x'))) === 1) {
                  let gId = getVGId();
                  for (let i = 0; i < Number(type.substring(type.indexOf('x') + 1));) {
                      const newNode = {
                          id: getId(),
                          type: "custom",
                          position: position,
                          data: {label: gId},
                      };
                      setElements((es) => es.concat(newNode));
                      i++;
                      position = {x: position.x, y: position.y + 10};
                  }
                  // если растянут вдоль x (элементы типа *x1)
              } else if (Number(type.substring(type.indexOf('x') + 1)) === 1) {
                  let gId = getGGId();
                  for (let i = 0; i < Number(type.substring(0, type.indexOf('x')));) {
                      const newNode = {
                          id: getId(),
                          type: "custom",
                          position: position,
                          data: {label: gId},
                      };
                      setElements((es) => es.concat(newNode));
                      i++;
                      position = {x: position.x + 10, y: position.y};
                  }
              }
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
                <SidebarComponent flipFlag={flipFlag}/>
            </ReactFlowProvider>
            <Button
              onClick={() => saveButton()}
              // startIcon={<DeleteIcon style={{color: "#ff5555"}}/>}
            >
                Сохранить
            </Button>
            <Button
              onClick={() => {
                  setDeleteMode(!deleteMode);
                  setRotateMode(false);
              }}
              // startIcon={<DeleteIcon style={{color: "#ff5555"}}/>}
            >
                Режим удаления
            </Button>
            <Button
              onClick={() => {
                  setFlipFlag(!flipFlag);
              }}
              // startIcon={<DeleteIcon style={{color: "#ff5555"}}/>}
            >
                Повернуть добавляемые компоненты
            </Button>
            <Button
              onClick={() => {
                  setRotateMode(!rotateMode);
                  setDeleteMode(false);
              }}
              // startIcon={<DeleteIcon style={{color: "#ff5555"}}/>}
            >
                Режим поворота элементов
            </Button>
        </div>
      );
  }
;

export default DnDFlow;