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
                    <label for="fullName">Full Name</label>
                    <input type="text" class="form-control" id="fullName" aria-describedby="fullNameHelp" placeholder="Enter full name" v-model.trim="fullName">
                    <p class="text error">{{ fullNameError }}</p>
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
                    <label for="contact">City</label>
                    <input type="text" class="form-control" id="city" aria-describedby="cityHel" placeholder="Enter city name" v-model.trim="city">
                    <p class="text error">{{ cityError }}</p>
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
                <div class="form-group">
                    <label for="uploadFile">Upload</label>
                    <input type="file" class="form-control" id="uploadFile" ref="file" @change="onUploadFile">
                    <p class="text error">{{ uploadFileError }}</p>
                </div>
                <button type="submit" class="btn btn-primary" @click="submit">Submit</button>
            </form>
        </base-card>
        <video id="webcam" autoplay playsinline width="640" height="480"></video>
        <canvas id="canvas" class="d-none"></canvas>
        <div @click="Capture">Capture</div>
    </div>
</template>

<script>
import Api from '../../../utils/api';
import Webcam from 'webcam-easy';

export default {
    data(){
        return {
            username: '',
            fullName: '',
            email:'',
            contact: '',
            city: '',
            password: '',
            confirmPassword: '',
            uploadFile: null,
            usernameError: '',
            fullNameError: '',
            emailError: '',
            contactError: '',
            cityError: '',
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
            this.fullNameError = '';
            this.emailError = '';
            this.contactError = '';
            this.passwordError = '';
            this.confirmPasswordError = '';
            this.uploadFileError = '';
            this.cityError = '';
        },
        resetInputs(){
            this.username = '';
            this.fullName = '';
            this.email = '';
            this.contact = '';
            this.password = '';
            this.confirmPassword = '';
            this.uploadFile = '';
            this.city = '';
        },
        validate(){
            this.isValid = true;
            this.resetErrors();

            if(this.username===''){
                this.usernameError = 'Please enter a valid username';
                this.isValid = false;
            }

            if(this.fullName===''){
                this.fullNameError = 'Please enter your full name';
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
            if(this.city === ''){
                this.cityErorr = 'Please enter your city name';
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
            if(!this.uploadFile){
                this.uploadFileError = 'Please add an id proof image';
                this.isValid = false;
            }
        },
        async submit() {
            this.validate();
            if(!this.isValid)
                return;
            const formData = new FormData();
            
            formData.append('name',this.username);
            formData.append('username',this.fullName);
            formData.append('email',this.email);
            formData.append('password',this.password);
            formData.append('contactNum',this.contact);
            formData.append('city',this.city);
            formData.append('picture',this.picture);
            formData.append('file',this.uploadFile);

            const response = await Api.registerUser(formData);
            localStorage.setItem("token",response.token);
            console.log(response);
            this.$store.commit('setUser',{
                user: response.user
            });
            this.$store.commit('setAuthenticated', { isAuthenticated: true });
            this.$store.commit('setRole',{ role: 'user' });
            this.$router.replace('/user/home');
        },
        onUploadFile(){
            this.uploadFile = this.$refs.file.files[0];
        },
        Capture(){
            let picture = this.webcam.snap();
            this.picture = picture;  
            this.webcam.stop();   
        }
    },
    mounted(){
        const webcamElement = document.getElementById('webcam');
        const canvasElement = document.getElementById('canvas');
        const webcam = new Webcam(webcamElement, 'user', canvasElement, null);
        this.webcam = webcam;
        console.log(webcam);
        webcam.start()
        .then(result =>{
            console.log("webcam started");
        })
        .catch(err => {
            console.log(err);
        });
    }
}
</script>

<style scoped>
.error {
    color: red;
}
</style>