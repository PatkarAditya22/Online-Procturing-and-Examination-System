<template>
    <div class="container w-50">
        <base-card class="p-5">
            <form @submit.prevent="submit">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" v-model.trim="email">
                    <p class="text">{{ emailError }}</p>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" class="form-control" id="password" placeholder="Password" v-model.trim="password">
                    <p class="text">{{ passwordError }}</p>
                </div>
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="exampleCheck1">
                    <label class="form-check-label" for="exampleCheck1">Check me out</label>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </base-card>
    </div>
</template>

<script>
import Api from '../../../utils/api';

export default {
    data(){
        return {
            email: '',
            emailError: '',
            password: '',
            passwordError: '',
            isFormValid: true
        }
    },
    methods: {
        validate(){
            this.isFormValid = true;
            const emailPattern = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);
            if(!emailPattern.test(this.email)){
                this.emailError = 'Please enter a valid email address';
                this.isFormValid = false
            }
            if(this.password==='' || this.password.length < 8){
                this.passwordError = 'Please enter a valid password';
                this.isFormValid = false;
            }
        },
        async submit(){
            this.validate();
            if(!this.isFormValid)
                return;
            console.log(this.email);
            const response = await Api.loginUser({
                email: this.email,
                password: this.password,
            });
            console.log(response);
            this.$store.commit('setUser',{
                user: response.data.user
            });
            localStorage.setItem("token",response.data.token);
            this.$store.commit('setAuthentication', { isAuthenticated: true });
            this.$store.commit('setRole',{ role: 'user' });
            this.$router.replace('/user/home');
        }
    }
}
</script>

<style scoped>

</style>