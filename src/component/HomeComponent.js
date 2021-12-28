import React, {Component} from "react";
import RoomEditor from "./RoomEditor";
import RoomService from "../service/RoomService"
import {
    Button
} from "@material-ui/core";

/*todo:
        1) Сохранение положения объектов https://reactflow.dev/examples/save-and-restore/
        2) CustomNode в 1х1 клетку с картинкой https://reactflow.dev/examples/custom-node/
        3)
 */


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


const initialState = {
    cateringId: 'Claude Monet',
    hallId: '0',
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

    async componentDidMount() {
        //todo: вызов
        const promise = await RoomService.getHallTables("Claude%20Monet", "0");
        console.log(promise)
        const dataPromise = await promise
          .then(
            response => {
                console.log(response.data.tables);
                this.setState({tables: response.data.tables});
            }
          );
        this.setState({elements: this.props.data, schemeId: this.props.schemeId});
    }

    render() {
        return (
          <div className="container-fluid">
              <RoomEditor data={this.state.elements} roomId={this.state.roomId} tables={this.state.tables}/>
          </div>
        );
    }
}
