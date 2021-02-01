export const GET_DATA = "GET_DATA";
export const GET_USER = "GET_USER";
export const DELETE_POST = "DELETE_POST";

export const DATA = "data";
export const USER = "userData";
export const POST_DATA = "postData";

export const selectDataList = state => state[DATA].data;
export const selectUserData = state => state[USER].userData;
export const selectPostData = state => state[POST_DATA].postData;

let initialState = {
    data: [],
    userData: [],
    postData: []
};

export function reducer(state = initialState, {type, payload}) {
    switch (type) {
        case GET_DATA:
            return {
                ...state,
                data: payload
            };
        case GET_USER:
            return {
                ...state,
                userData: payload
            };
        case DELETE_POST:
            return {
                ...state,
                postData: payload
            };


        default:
            return state;
    }
}