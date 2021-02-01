import { GET_DATA } from "./actions";

import axios from "axios";

const url = "http://localhost:4000/api/users/";

const setData = (payload) => ({
    type: GET_DATA,
    payload
});

export const getData = () => async dispatch => {
    axios.get(url).then(response => dispatch(setData(response)));
};