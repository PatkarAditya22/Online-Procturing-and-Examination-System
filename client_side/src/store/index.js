import { createStore } from 'vuex'

export default createStore({
    state(){
        return {
            user: null,
            role:null,
            isAuthenticated: null,
            baseUrl: 'http://localhost:3000/api/'
        }
    },
    getters: {
        getUser(state){
            return state.user;
        },
        isAuthenticated(state){
            return state.isAuthenticated;
        },
        getRole(state){
            return state.role;
        },
        getBaseUrl(state){
            return state.baseUrl;
        }
    },
    mutations: {
        setUser(state,payload){
            state.user = payload.user;
        },
        setAuthentication(state,payload){
            state.isAuthenticated = payload.isAuthenticated;
        },
        setRole(state,payload){
            state.role = payload.role;
        }
    },
});
