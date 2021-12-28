import axios from "axios";
// зачем там 2 "//" ?
const CONSTRUCTOR_REST_API_URL = "http://127.0.0.1:5000//constructor/";

export default class RoomService {
    // получить конкретный ?общепит? по ID todo: поменять на REST получение по ID, а не по имени
    static getHallTables(cateringId, id) {
        console.log("http://127.0.0.1:5000//constructor/get_hall_info?catering_id=" + cateringId + "&hall_idx=" + id);
        return axios.get("http://127.0.0.1:5000//constructor/get_hall_info?catering_id=" + cateringId + "&hall_idx=" + id) // id=0; cateringId=Claude Monet
    }

    setHall(data) {
        return axios.post(CONSTRUCTOR_REST_API_URL + data)
    }

}