<template>
    <div>
        <base-dialog :show="showDialog" @close="toggleShowDialog(false)">
            <template #header>
                Add New Question
            </template>
            <template #default>
                <div class="w-100 row">
                    <div class="col-md-8 ">
                        <input type="text" placeholder="Enter your question" class="form-control mb-3" v-model.trim="newQuestion.questionText">
                        <div v-if="newQuestion.type === 'single'">
                            
                            <div class="form-row">
                                <input type="text" class="form-control col-md-8 mr-1" name="" id="" placeholder="Enter new option" v-model.trim="newOption">
                                <button class="col-md-3 btn btn-secondary" @click="addNewOption">Add Option</button>
                            </div>
                            <div v-for="(option,i) in newQuestion.options" :key="i">
                                <input type="radio" name="" id="" v-model="newQuestion.correctOptions"> {{ option }}
                            </div>
                        </div>
                        <div v-else-if="newQuestion.type === 'multiple'">
                            
                            <div class="form-row">
                                <input class="form-control col-md-8 mr-2" type="text" name="" id="" placeholder="Enter new option" v-model.trim="newOption">
                                <button class="col-md-3 btn btn-secondary" @click="addNewOption">Add Option</button>
                            </div>
                            <div v-for="(option,i) in newQuestion.options" :key="i">
                                <input type="checkbox" name="" id="" v-model="newQuestion.correctOptions"> {{ option }}
                            </div>
                        </div>
                        <div v-else>
                            <textarea class="form-control" name="" id="" cols="80" rows="5"></textarea>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <select class="custom-select" v-model="newQuestion.type">
                            <option value="single" selected>Single Correct</option>
                            <option value="multiple">Multiple Correct</option>
                            <option value="text">Text Area</option>
                        </select>
                        <div class="mt-2">
                            <input type="text" class="form-control" placeholder="Enter score" v-model.trim="newQuestion.score">
                        </div>
                    </div>
                </div>
            </template>
            <template #actions>
                <div class="w-100 d-flex justify-content-center">
                    <button class="btn btn-success mb-3" @click="addNewQuestion">Add</button>
                </div>
            </template>
        </base-dialog>
        <div class="container w-75 mx-auto border p-0">
            <div class="w-100 d-flex border-bottom">
                <div class="w-50 border-right text-center" @click="selectTab(1)">
                    Test Settings
                </div>
                <div class="w-50 text-center" @click="selectTab(2)">
                    Questions
                </div>
            </div>
            <div class="w-100 p-5">
                <div class="w-100" v-if="isFirstTabSelected">
                    <div style="display:flex;">
                        <label style="margin:10px;" for="inputEmail3">Test Duration</label>
                        <input style="margin:10px;width:100px" type="text" class="form-control" id="inputEmail3" v-model="test.settings.testDuration">
                    </div>
                    <div class="col-md-4">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="defaultCheck1" v-model="test.settings.disableTabChange">
                            <label class="form-check-label" for="defaultCheck1">
                                Disable Tab change
                            </label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="defaultCheck1" v-model="test.settings.enableFullScreen">
                            <label class="form-check-label" for="defaultCheck1">
                                Enable full screen mode
                            </label>
                        </div>
                    </div>
                    <div style="display:flex;">
                        <label style="margin:10px;" for="inputEmail3">Toat Score</label>
                        <input style="margin:10px;width:100px" type="text" class="form-control" id="inputEmail3" v-model="test.settings.totalScore">
                    </div>
                    <!-- <div class="col-md-4">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                            <label class="form-check-label" for="defaultCheck1">
                                Default checkbox
                            </label>
                        </div>
                    </div> -->
                    <br>
                    <div class="col-md-4">
                        <select style="width:200px" class="custom-select" v-model="test.settings.severity">
                            <option value="strict" selected>Strict</option>
                            <option value="moderate">Moderate</option>
                        </select>
                    </div>
                    <br>
                    <div class="col-md-4">
                        <button @click="saveSettings" class="btn btn-info">Save</button>
                    </div>
                </div>
                <div class="w-100" v-else>
                    <div class="w-100 d-flex justify-content-end mb-2">
                        <input type="text" placeholder="Enter Test Name" class="form-control mb" v-model.trim="test.testName">
                        <button class="btn btn-success btn-sm" @click="toggleShowDialog(true)">Add Question</button>
                    </div>
                    <div class="mx-5 my-3" v-for="(question,i) in test.questions" :key="i">
                        <base-card class="p-3">
                            <div class="row">
                                <div class="col-md-9">
                                    <h4>Q.{{ i+1 }} {{ question.questionText }}</h4>
                                    <div v-if="question.type === 'single'">
                                        <div v-for="(option,i) in question.options" :key="i">
                                            <input type="radio" name="" id=""> {{ option }}
                                        </div>
                                    </div>
                                    <div v-else-if="question.type === 'multiple'">
                                        <div v-for="(option,i) in question.options" :key="i">
                                            <input type="checkbox" name="" id=""> {{ option }}
                                        </div>
                                    </div>
                                    <div v-else>
                                        <textarea name="" id="" cols="80" rows="5"></textarea>
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <p>Points - {{ question.score }}</p>
                                </div>
                                <div class="col-md-1">
                                    <button class="btn btn-primary">
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </base-card>
                    </div>
                    <div class="mt-3 w-100 d-flex justify-content-center">
                        <button class="btn btn-primary" @click="createTest">Add Test</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import Api from '../../../utils/api';

export default {
    data(){
        return {
            currentTab: 1,
            test: null,
            showDialog: false,
            newQuestion: null,
            newOption: '',
            disableTabChange : false,
            enableFullScreen : false,
            testDuration : '',
        }
    },
    methods:{
        selectTab(tabNum){
            this.currentTab = tabNum;
        },
        toggleShowDialog(value){
            this.newQuestion = {
                questionText: '',
                options: [],
                correctOptions: [],
                type: 'single'
            };
            this.showDialog = value;
        },
        addNewOption(){
            if(this.newOption !== ''){
                this.newQuestion.options.push(this.newOption);
                this.newOption = '';
            }
        },
        addNewQuestion(){
            console.log(this.newQuestion);
            let isValid = true;
            if(this.newQuestion.questionText === ''){
                isValid = false;
            }
            if((this.newQuestion.type === 'single' || this.newQuestion.type === 'multiple') && this.newQuestion.options.length === 0){
                isValid = false;
            }
            if(this.newQuestion.score === 0){
                isValid = false;
            }
            if(isValid){
                if(this.newQuestion.type === 'text'){
                    this.newQuestion.options = null;
                    this.newQuestion.correctOptions = null;
                }
                this.test.questions.push(this.newQuestion);
                this.toggleShowDialog(false);
            }
        },
        saveSettings(){
            console.log(this.test.settings);
            this.currentTab = 2;
        },
        async createTest(){
            if(this.test.testName === '' || this.test.questions.length === null)
                return;
            const response = await Api.createTest(this.test);
            console.log(response);
        }
    },
    computed:{
        isFirstTabSelected(){
            return this.currentTab === 1;
        }
    },
    created(){
        this.test = {
            testName: '',
            settings: {
                'testDuration': '',
                'disableTabChange': false,
                'enableFullScreen': false,
                'severity' : this.severity,
                'totalScore' : this.totalScore,
            }, 
            questions: [
               
            ]
        }
    }
}
</script>










































































<style scoped>

</style>