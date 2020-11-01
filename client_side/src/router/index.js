import { createRouter, createWebHistory } from 'vue-router';
import Test from '../components/user/pages/Test.vue';
import Landing from '../components/Landing.vue';
import UserLogin from '../components/user/pages/Login.vue';
import OrgLogin from '../components/org/pages/Login.vue';
import UserRegister from '../components/user/pages/Register.vue';
import OrgRegister from '../components/org/pages/Register.vue';
import CreateTest from '../components/org/pages/CreateTest.vue';
import FaceRecognition from '../components/user/pages/FaceRecognition';
import AudioRecognition from '../components/user/pages/AudioRecognition';
import UserHome from '../components/user/pages/Home.vue';
import OrgHome from '../components/org/pages/Home.vue';
import UserList from '../components/org/pages/UserList.vue';

function protector(expectedRole, safeRouteName) {
    return async function (to, from, next) {
        console.log('inside the protector');
		// let role = JSON.parse(localStorage.getItem('user')).role;
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
        { path: '/user/home', component: UserHome,beforeEnter: protector("user", "userLogin"),},
        { path: '/user/test/:testId', component: Test,beforeEnter: protector("user", "userLogin"), props: true},
        { path: '/user/test/:testId/summary', component: null,beforeEnter: protector("user", "userLogin"), props: true},
        { path: '/user/profile', component: null,beforeEnter: protector("user", "userLogin"),},
        { path: '/org/login', component: OrgLogin,},
		{ path: '/org/register', component: OrgRegister,},
		{ path: '/org/home', component:OrgHome,beforeEnter: protector("org", "orgLogin"),},
		{ path: '/org/create_test', component: CreateTest,beforeEnter: protector("org", "orgLogin"),},
        { path: '/org/test/:testId', component: null,beforeEnter: protector("org", "orgLogin"), props: true},
        { path: '/org/test/:testId/summary', component: UserList,beforeEnter: protector("org", "orgLogin"), props: true},
        { path: '/faceRecognition', component: FaceRecognition, props: true},
        { path: '/audioRecognition', component: AudioRecognition, props: true},
    ]
});

export default router;
