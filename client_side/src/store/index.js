import { createStore } from 'vuex'

export default createStore({
    state(){
        return {
            user: null,
            role:null,
            isAuthenticated: null,
            baseUrl: 'http://localhost:3000/api/',
            tests: null,
            userTests: null,
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
        },
        getTests(state){
            return state.tests;
        },
        getUserTests(state){
            return state.userTests;
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
        },
        setTests(state,payload){
            state.tests = payload.tests;
        },
        setUserTests(state,payload){
            state.userTests = payload.userTests;
        }
    },
});
