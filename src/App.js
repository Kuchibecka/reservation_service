import './App.css';
import {Link, BrowserRouter, Route, Routes} from "react-router-dom";
import HomeComponent from "./component/HomeComponent";
import Login from "./component/Login";
import Registration from "./component/Registration";

export default function App() {
    return (
            <BrowserRouter>
                <ul>
                    <li><Link to="/">Login</Link></li>
                    <li><Link to="/signup">Sign Up</Link></li>
                    <li><Link to="/constructor">Constructor</Link></li>
                </ul>
                <Routes>
                    <Route path="/signup" element={<Registration/>}/>
                    <Route path="/constructor" element={<HomeComponent/>}/>
                    <Route path="/" element={<Login/>}/>
                </Routes>
            </BrowserRouter>
    );
}
