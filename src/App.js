import './App.css';
import {Link, BrowserRouter, Route, Switch} from "react-router-dom";
import HomeComponent from "./component/HomeComponent";
import Login from "./component/Login";
import Registration from "./component/Registration";
import Router from "react-router-dom/es/Router";

export default function App() {
    return (
            <BrowserRouter>
                <ul>
                    <li><Link to="/">Login</Link></li>
                    <li><Link to="/signup">Sign Up</Link></li>
                    <li><Link to="/constructor">Constructor</Link></li>
                </ul>
                <Switch>
                    <Route path="/signup"> <Registration/> </Route>
                    <Route path="/constructor"> <HomeComponent/> </Route>
                    <Route path="/"> <Login/> </Route>
                </Switch>
            </BrowserRouter>
    );
}
