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
        position: {x: 250, y: 100},
    },
    {
        id: '2',
        type: 'custom',
        data: {label: ''},
        position: {x: 350, y: 100},
    },
];


const initialState = {
    cateringId: 'Claude Monet',
    hallId: '0',
    elements: [],
};

/**
 * Room editor parent component
 */
export default class HomeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        //todo: вызов
        let tables;
        this.setState({elements: initialElements});
        fetch('http://127.0.0.1:5000//constructor/get_hall_info?catering_id=Savoy Grill&hall_idx=0', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*"
            },
            //body: JSON.stringify(this.state),
        })
          .then(res => {
              if (res.status === 200) {
                  res.json().then((data) => {
                      if (data === false)
                          alert('Error in sign up: user exists');
                      else {
                          console.log("DATA GOT FROM BACKEND: ", data);
                          this.setState({elements: data.tables/*, schemeId: this.props.schemeId*/});
                          console.log("set state.elements to : ", this, this.state.elements);
                      }
                  });
              }
          })
    }

    render() {
        return (
          <div className="container-fluid">
              <RoomEditor data={this.state.elements} roomId={this.state.roomId} tables={this.state.tables}/>
          </div>
        );
    }
}
