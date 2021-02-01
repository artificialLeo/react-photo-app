import { GET_DATA, GET_USER, DELETE_POST } from "./actions";

import axios from "axios";

const url = "http://localhost:4000/api/users/";

const setData = (payload) => ({
    type: GET_DATA,
    payload
});

const setUser = (payload) => ({
    type: GET_USER,
    payload
});

const setPost = (payload) => ({
    type: DELETE_POST,
    payload
});

export const getData = () => async dispatch => {
    axios.get(url).then(response => dispatch(setData(response.data)));
};

export const getUser = (email) => async dispatch => {
    axios.get(url + email, {
        params: {
            id: email
        }
    }).then(response => dispatch(setUser(response.data)));
};

export const deletePost = (postId, email) => async dispatch => {
    axios.put(url, {
        params: {
            id: postId,
            mail: email
        }
    }).then(response => dispatch(setPost(response.data)));
};