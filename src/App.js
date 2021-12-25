import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomeComponent from "./component/HomeComponent"

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeComponent/>}/>
            </Routes>
        </BrowserRouter>
    );
}
