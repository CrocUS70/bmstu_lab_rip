import initialstate from "../initialstate";
import {combineReducers} from "@reduxjs/toolkit";
import * as AppActions from "../actions/AppActions";



function userAuthorizedReducer(state = initialstate.cached_data.App.userAuthorized, action) {
    switch (action.type) {
        case AppActions.setUserStatus:
            return action.value
        default: return state
    }
}

function userIsManagerReducer(state = initialstate.cached_data.App.userIsManager, action) {
    switch (action.type) {
        case AppActions.setuserIsManager:
            return action.value
        default: return state
    }
}

function AppBarLinksReducer(state = initialstate.ui.App.AppBarLinks, action) {
    switch (action.type) {
        case AppActions.setAppBarLinks:
            return action.value
        case AppActions.addToAppBarLinks:
            // let new_state = state;
            // action.value.forEach(elem => {
            //     new_state.push(elem)
            // })
            return [...state, ...action.value]
        case AppActions.deleteFromAppBarLinks:
            return state.filter(item => item.title !== action.value)
        default: return state
    }
}

export const cached_dataAppReducers = combineReducers({
    userAuthorized: userAuthorizedReducer,
    userIsManager:userIsManagerReducer,
})

export const uiAppReducers = combineReducers({
    AppBarLinks: AppBarLinksReducer,

})