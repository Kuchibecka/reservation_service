import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomeComponent from "./component/HomeComponent";
import Login from "./component/Login";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>}/>
            </Routes>
        </BrowserRouter>
    );
}
