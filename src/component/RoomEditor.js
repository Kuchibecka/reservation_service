import React, { useState, useRef } from "react";
import {range} from "lodash-es";
import {Button} from "@material-ui/core";
import SidebarComponent from './SidebarComponent';
import ReactFlow, {
    ReactFlowProvider,
    Handle,
    Controls,
    Background,
    addEdge,
    removeElements,
} from "react-flow-renderer";

const graphStyles = {width: "100%", height: "500px"};
const currentState = {
    elements: [
        {id: '1', data: {label: ''}, position: {x: 150, y: 150}},
        {id: '2', data: {label: ''}, position: {x: 150, y: 300}},
    ],
    //deleteMode: false,
};
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

let id = 0;
const getId = () => `dndnode_${id++}`;

/**
 * Room editor component
 */
export default class RoomEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = currentState;
        // this.click = this.click.bind(this);
    }

    async componentDidMount() {
        // todo: запрос на получение инфы с бэка и запись в state
        await this.setState({elements: this.props.data});
        // await console.log(this.state.elements)
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            await this.setState({elements: this.props.data, deleteMode: false, editMode: false})
        }
        if (prevProps.deleteMode !== this.props.deleteMode) {
            await this.setState({deleteMode: this.props.deleteMode, editMode: false})
        }
        if (prevProps.editMode !== this.props.editMode) {
            await this.setState({editMode: this.props.editMode, deleteMode: false})
        }
        // console.log(this.state.elements)
    }

    saveButton(elements, roomId) {
        console.log("Elements: ", elements);
        console.log("roomId: ", roomId);
        //todo: отправка на бэк локальной переменной с положением элементов
    }

    onNodeDragStop = (event, node) => {
        // console.log('drag stop: ', node)
        // console.log('state.elements: ', this.state.elements)
        const buf = this.state.elements;
        for (let i in range(0, buf.length)) {
            if (Number(buf[i].id) === Number(node.id)) {
                buf[i].position = node.position;
            }
        }
        this.setState({elements: buf})
    }

    render() {
        return (
            <div className="container-fluid">
                <ReactFlowProvider>
                    <ReactFlow
                        elements={this.state.elements}
                        style={graphStyles}
                        // onElementClick={this.click}
                        onNodeDragStop={this.onNodeDragStop}
                        nodeTypes={nodeTypes}
                        snapToGrid={true}
                        snapGrid={[10, 10]} /*todo: задавать через входные параметры -> edit: нет, это привязка, а не границы*/
                    >
                        <Controls/>
                        <Background
                            color="#333"
                            variant={'lines'}
                            gap={10}
                            style={{left: 10, right: 10, top: 10}}
                        />
                    </ReactFlow>
                    <SidebarComponent/>
                </ReactFlowProvider>
                <Button
                    onClick={() => this.saveButton(this.state.elements, this.state.roomId)}
                    // startIcon={<DeleteIcon style={{color: "#ff5555"}}/>}
                >
                    Сохранить
                </Button>
            </div>
        )
    }
}