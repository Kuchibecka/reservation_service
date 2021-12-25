import React, {Component} from "react";
import RoomEditor from "./RoomEditor";
import {
    Button
} from "@material-ui/core";

/*todo:
        1) Сохранение положения объектов https://reactflow.dev/examples/save-and-restore/
        2) CustomNode в 1х1 клетку с картинкой https://reactflow.dev/examples/custom-node/
        3)
 */


const initialElements = [
    { id: '1', type: 'custom', data: { label: '' }, position: { x: 100, y: 140 } },
    { id: '2', type: 'custom', data: { label: '' }, position: { x: 100, y: 180 } },
];


const initialState = {
    roomId: '1',
    elements: initialElements,
};

/**
 * Room editor parent component
 */
export default class HomeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    render() {
        return (
            <div className="container-fluid">
            <RoomEditor data={this.state.elements} roomId={this.state.roomId}/>
            </div>
        );
    }
}
