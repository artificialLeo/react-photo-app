export let GET_DATA = "GET_DATA";

export let DATA = "data";

export const selectDataList = state => state[DATA].posts;

let initialState = {
    data: []
};

export function reducer(state = initialState, {type, payload}) {
    switch (type) {
        case GET_DATA:
            return {
                ...state,
                posts: payload
            };


        default:
            return state;
    }
}