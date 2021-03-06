import axios from 'axios';
import {ADD_ACTIVE_CANDIDATE, LOAD_GRAPHS, RESET_CANDIDATES} from "../constants/action-types";
import { REMOVE_ACTIVE_CANDIDATE } from "../constants/action-types";
import { LOAD_CANDIDATES } from "../constants/action-types";
import { UPDATE_DATES } from "../constants/action-types";
import moment from "moment";

export function addActiveCandidate(payload) {
    return { type: ADD_ACTIVE_CANDIDATE, payload };
}

export function removeActiveCandidate(payload) {
    return { type: REMOVE_ACTIVE_CANDIDATE, payload };
}

export function getCandidates() {
    return function(dispatch) {
        return axios.get(
            'http://elecciones2019.fi.uba.ar/candidates',
            {
            proxy: false
            })
            .then((response) => {
                dispatch({ type: LOAD_CANDIDATES, payload: response.data });
                return response.status
            })
            .catch((error) => {
                return error.response.status;
            });
    };
}

export function resetCandidates() {
    return { type: RESET_CANDIDATES };
}

export function updateDate(payload) {
    return { type: UPDATE_DATES, payload };
}
