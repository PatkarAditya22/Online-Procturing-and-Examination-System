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
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </base-card>
    </div>
</template>

<script>
export default {
    data(){
        return {
            username: '',
            fullName: '',
            email:'',
            contact: '',
            password: '',
            confirmPassword: '',
            uploadFile: null,
            usernameError: '',
            fullNameError: '',
            emailError: '',
            contactError: '',
            passwordError: '',
            confirmPasswordError: '',
            uploadFileError: '',
            isValid: true
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
        },
        resetInputs(){
            this.username = '';
            this.fullName = '';
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
        submit() {
            this.validate();
            if(!this.isValid)
                return;
            // user register api endpoint
            const formData = new FormData();
            formData.append('idProof',this.uploadFile);
            alert(this.uploadFile);
        },
        onUploadFile(){
            this.uploadFile = this.$refs.file.files[0];
        }
    }
}
</script>

<style scoped>
.error {
    color: red;
}
</style>