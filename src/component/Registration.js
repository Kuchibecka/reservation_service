import React, {Component} from 'react';

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            login : '',
            nickname: '',
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
        fetch('http://127.0.0.1:5000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(this.state),
        })
            .then(res => {
                if (res.status === 200) {
                    res.json().then(
                        (data) => {
                            if (data === false)
                                alert('Error in sign up: user exists');
                            else
                                console.log(JSON.stringify(data, null, 2))
                        }
                    )
                } else {
                    throw new Error(res.error);
                }
            })
            .catch(err => {
                console.error(err);
                alert('Error in sign up please try again');
            });
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <h1>Sign up</h1>
                <input
                    type="text"
                    name="login"
                    placeholder="Enter login"
                    value={this.state.login}
                    onChange={this.handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="nickname"
                    placeholder="Enter nickname"
                    value={this.state.nickname}
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