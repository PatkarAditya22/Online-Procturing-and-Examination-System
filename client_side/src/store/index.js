import { createStore } from 'vuex'

export default createStore({
    state(){
        return {
            user: null,
            role:null,
            isAuthenticated: null
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
    actions: {
        async registerUser(context,payload){
            
        },
        async registerOrg(context,payload){
            
        },
        async loginUser(context,payload){

        },
        async loginOrg(context,payload){
            
        },
    }
});
