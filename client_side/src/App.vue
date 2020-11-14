<template>
    <div>
        <div v-if="this.$route.path !== '/'">
          	<user-bar v-if="isUser"></user-bar>
          	<org-bar v-else></org-bar>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import UserBar from './components/user/UI/Navbar.vue';
import OrgBar from './components/org/UI/Navbar.vue';

export default {
    components: {
        UserBar,
        OrgBar
    },
    computed:{
        isUser(){
            return this.$store.getters.getUser === 'user';
        }
    }
}
</script>

<style>
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
