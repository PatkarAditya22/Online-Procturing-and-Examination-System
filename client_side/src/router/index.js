import { createRouter, createWebHistory } from 'vue-router';
import Test from '../components/user/pages/Test.vue';
import Landing from '../components/Landing.vue';
import UserLogin from '../components/user/pages/Login.vue';
import OrgLogin from '../components/org/pages/Login.vue';
import UserRegister from '../components/user/pages/Register.vue';

function protector(expectedRole, safeRouteName) {
    return async function (to, from, next) {
        console.log('inside the protector');
		let role = JSON.parse(localStorage.getItem('user')).role;
		next();
        // if(role === expectedRole) {
        //     next()
        // } else {
        //     next({
        //         name: safeRouteName,
        //         query: { redirectFrom: to.fullPath }
        //     })
        // }
    }
}

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Landing},
        { path: '/user/login', component: UserLogin,},
        { path: '/user/register', component: UserRegister,},
        { path: '/user/home', component: null,beforeEnter: protector("user", "userLogin"),},
        { path: '/user/test/:testId', component: Test,beforeEnter: protector("user", "userLogin"), props: true},
        { path: '/user/test/:testId/summary', component: null,beforeEnter: protector("user", "userLogin"), props: true},
        { path: '/user/profile', component: null,beforeEnter: protector("user", "userLogin"),},
        { path: '/org/login', component: OrgLogin,},
		{ path: '/org/register', component: null,},
		{ path: '/org/home', component:null,beforeEnter: protector("org", "orgLogin"),},
		{ path: '/org/create_test', component: null,beforeEnter: protector("org", "orgLogin"),},
		{ path: '/org/test/:testId', component: null,beforeEnter: protector("org", "orgLogin"), props: true}
    ]
});

export default router;
