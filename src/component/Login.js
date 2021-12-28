import React, {Component} from 'react';
import { useNavigate } from 'react-router-dom';
import {Button} from "@material-ui/core";
import {withRouter} from "react-router-dom";

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            login : '',
            password: ''
        };
    }

    handleInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
            [name]: value
        });
    }

    onSubmit = (event) => {
        event.preventDefault();
        fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(this.state),
        })
            .then(res => {
                if (res.status === 201) {
                    res.json().then(
                        (data) => {
                            console.log(JSON.stringify(data, null, 2))
                            alert('Login successfull!')
                            const { history } = this.props;
                            history.push("/constructor")
                        }
                    )
                } else {
                    throw new Error(res.error);
                }
            })
            .catch(err => {
                console.error(err);
                alert('Error logging in please try again');
            });
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <h1>Login Below!</h1>
                <input
                    type="text"
                    name="login"
                    placeholder="Enter login"
                    value={this.state.login}
                    onChange={this.handleInputChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={this.state.password}
                    onChange={this.handleInputChange}
                    required
                />
                <input type="submit" value="Submit"/>
            </form>
        );
    }
}

export default withRouter(Login);