<template>
    <div class="container w-50">
        <base-card class="p-5">
            <form @submit.prevent="submit" enctype="multipart/form-data">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" class="form-control" id="username" aria-describedby="usernameHelp" placeholder="Enter username" v-model.trim="username">
                    <p class="text error">{{ usernameError }}</p>
                </div>
                <div class="form-group">
                    <label for="fullName">Organisation Name</label>
                    <input type="text" class="form-control" id="fullName" aria-describedby="fullNameHelp" placeholder="Enter Organization name" v-model.trim="orgName">
                    <p class="text error">{{ orgNameError }}</p>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" v-model.trim="email">
                    <p class="text error">{{ emailError }}</p>
                </div>
                <div class="form-group">
                    <label for="contact">Contact</label>
                    <input type="text" class="form-control" id="contact" aria-describedby="contactHelp" placeholder="Enter phone number" v-model.trim="contact">
                    <p class="text error">{{ contactError }}</p>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" class="form-control" id="password" placeholder="Password" v-model.trim="password">
                    <p class="text error">{{ passwordError }}</p>
                </div>
                <div class="form-group">
                    <label for="confirmPassword">Confirm Password</label>
                    <input type="password" class="form-control" id="confirmPassword" placeholder="Please confirm your password" v-model.trim="confirmPassword">
                    <p class="text error">{{ confirmPasswordError }}</p>
                </div>
                <button type="submit" class="btn btn-primary" @click="submit">Submit</button>
            </form>
        </base-card>
    </div>
</template>

<script>
import Api from '../../../utils/api';
import Webcam from 'webcam-easy';

export default {
    data(){
        return {
            username: '',
            orgName: '',
            email:'',
            contact: '',
            password: '',
            confirmPassword: '',
            uploadFile: null,
            usernameError: '',
            orgNameError: '',
            emailError: '',
            contactError: '',
            passwordError: '',
            confirmPasswordError: '',
            uploadFileError: '',
            isValid: true,
            webcam:null,
            string:null
        }
    },
    methods: {
        resetErrors(){
            this.usernameError = '';
            this.orgNameError = '';
            this.emailError = '';
            this.contactError = '';
            this.passwordError = '';
            this.confirmPasswordError = '';
            this.uploadFileError = '';
        },
        resetInputs(){
            this.username = '';
            this.orgName = '';
            this.email = '';
            this.contact = '';
            this.password = '';
            this.confirmPassword = '';
            this.uploadFile = '';
        },
        validate(){
            this.isValid = true;
            this.resetErrors();

            if(this.username===''){
                this.usernameError = 'Please enter a valid username';
                this.isValid = false;
            }

            if(this.orgName===''){
                this.orgNameError = 'Please enter your org name';
                this.isValid = false;
            }

            const emailPattern = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);
            if(!emailPattern.test(this.email)){
                this.emailError = 'Please enter a valid email address';
                this.isValid = false;
            }

            if(this.contact===''){
                this.contactError = 'Please enter your phone number';
                this.isValid = false;
            }
            if(this.password==='' || this.password.length < 8){
                this.passwordError = 'Please enter a valid password';
                this.isValid = false;
            }
            if(this.confirmPassword!==this.password){
                this.confirmPasswordError = 'Passwords do not match';
                this.isValid = false;
            }
        },
        async submit() {
            this.validate();
            if(!this.isValid)
                return;
            const response = await Api.registerOrg({
                name: this.username,
                orgName: this.fullName,
                email: this.email,
                password: this.password,
                contactNum: this.contact
            });
            localStorage.setItem("token",response.token);
            console.log(response);
            this.$store.commit('setUser',{
                user: response.user
            });
            this.$store.commit('setAuthentication', { isAuthenticated: true });
            this.$store.commit('setRole',{ role: 'org' });
            this.$router.replace('/org/home');
        },
    },
}
</script>

<style scoped>
.error {
    color: red;
}
</style>