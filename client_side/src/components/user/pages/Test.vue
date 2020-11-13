<template>
    <div>
        <base-spinner :show="isLoading">
            <div class="spinner-border text-primary loading" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </base-spinner>
        <div> 
            <div class="m-3 w-100 text-danger" style="text-align:center;position:relative;">
                <hr>
                <h5 class="text-secondary">All warnings will be displayed here</h5>
                <h3>{{ warning }}</h3>
            </div>
            <div v-if="isTestStarted && !testEnded" class="row" style="z-index: -1">
                
                <div class="col-md-10">
                    <base-card v-for="(question,index) in test.questions" :key="index" style="width: 100%;" class="p-3 m-3">
                        <div>
                            <div class="card-body">
                                <h5 class="card-title">Q.{{ index + 1 }} {{ question.questionText }}</h5>
                            </div>
                            <div v-if="question.qType=='single'">
                                <div v-for="(option,index) in question.options" :key="index">
                                    <input type="radio" :name="question.questionText" id="" v-model="question.answer" :value="option"> {{ option }}
                                </div>
                            </div>
                            <div v-else-if="question.qType=='multiple'">
                                <div v-for="(option,oindex) in question.options" :key="oindex">
                                    <input type="checkbox" :name="question.questionText" id="" v-model="question.answer" :value="option"> {{ option }}
                                </div>
                            </div>
                            <div v-else>
                                <textarea name="" id="" cols="60" rows="5"  v-model.trim="question.answer"></textarea>
                            </div>
                        </div>
                    </base-card>
                    <div @click="endTest" class="btn btn-danger mx-3">Submit Test</div>
                </div>
            </div>
            <div v-else-if="!testEnded">
                <div @click="isTestStartedFunc" class="btn btn-primary mx-3"> Start Test</div>
            </div>
            <div class="col-md-4">
                <video autoplay class="float"/>
            </div>
        </div>
    </div>
</template>

<script>
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import io from "socket.io-client";
import Api from '../../../utils/api';
import jwt from 'jsonwebtoken';

export default {
    props: ['testId'],
    components: {
        
    },
    data(){
        return {
            time:0,
            test: null,
            questions: null,
            testEnded:false,
            result: null,
            isLoading:false,
            isTestStarted: false,
            redFlags: 3,
            socketId: null,
            mediaRecorder: null,
            logs:{},
            flagged: false,
            reason: null,
            startedAt: null,
            endedAt: null,
            warning: "",
            stream:null,
            userId:null,
            timeInterval:null,
            beep:null,
            continuousFlags:0
        }
    },
    created(){
        let all_tests = this.$store.getters.getUserTests;
        this.test = all_tests.filter(test =>{
            return test._id === this.testId;
        })[0];
        
        this.questions = [...this.test.questions];

        this.questions = this.questions.map(question => {
            if(question.qType === 'single')
                question.answer = '';
            else if(question.qType === 'multiple')
                question.answer = [];
            else question.answer = '';
            return question;
        });
        // console.log(this.questions);      
    },
    mounted(){
        const token = localStorage.getItem('token').split(' ')[1];
        const tokenBody = jwt.decode(token);
        console.log(tokenBody);
        this.userId = tokenBody.id;
        const hdConstraints = {
            video: true
        };
        const video = document.querySelector('video');
        navigator.mediaDevices.getUserMedia(hdConstraints).then(result => {
            video.srcObject = result;
            this.stream = result;
        }).catch(err => console.log(err));
        document.addEventListener('keydown',function(e){
            console.log(e.keyCode);
            var charCode = e.charCode || e.keyCode || e.which;
            if (charCode == 27){
                console.log('escape');
                return false;
            }
        });
        this.socket = io("http://crazyforms.herokuapp.com/stream");
        let $ = this;
        let ss = this.socket;
        ss.on("connect", () => {
            $.socketId = ss.io.engine.id;
            ss.emit("subscribe", {
                methodName: "proctoring",
                room: $.test._id,
                userId: $.userId,
                upload:true,
                socketId: $.socketId,
            });
        });
        const context = new AudioContext()
        const beep = context.createOscillator()
        beep.type = "sine";
        beep.connect(context.destination);
        this.beep = beep;
    },
    methods:{
        isTestStartedFunc(){
            let $ = this;
            document.addEventListener('visibilitychange', function(){
                if(document.visibilityState === "hidden"){
                    $.endTest();
                    $.flagged = true;
                    $.reason = "User tried to switch tabs";
                }
            });
            document.onkeypress = function(evt){console.log(evt)};
            document.documentElement.requestFullscreen().then(()=>{
                $.isTestStarted = true;
                $.startTest();
                console.log('isteststarted',this.isTestStarted);
                this.startedAt = new Date();
            }).catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        },
        calculateError(iris) {
            let sumX = -iris[0][0];
            let sumY = -iris[0][1];
            iris.slice(1,5).forEach(point => {
                sumX += point[0]/4;
                sumY += point[1]/4;
            })
            return Math.pow(Math.pow(sumX,2)+Math.pow(sumY,2),0.5)
        },
        async endTest(){
            document.exitFullscreen()
            console.log(this.questions);
            this.endedAt = new Date();
            this.testEnded = true;
            try{
                this.endUpload();
            } catch(err){
                console.log(err);
            }
            this.stream.getTracks().forEach(function(track) {
                track.stop();
            });
            clearInterval(this.timeInterval);
            const answers = this.questions.map(q => {
                return q.answer;
            })
            const token = localStorage.getItem('token').split(' ')[1];
            console.log(token);
            const tokenBody = jwt.decode(token);
            console.log(tokenBody);
            const body = {
                userId: tokenBody.id,
                logs: this.logs,
                answers: answers,
                testStartedAt: this.startedAt,
                testCompletedAt: this.endedAt,
                flagged: this.flagged,
                reason: this.reason
            }
            const response = await Api.submitTest(body.userId,this.test._id,body);
            console.log(response);
            this.$router.push("/");
            //API CALL HERE TO SUBMIT LOGS AND RESPONSES
        },
        handleDataAvailable(event) {
            let $ = this;
            if (event.data.size > 0) {
                if(this.socket.connected){
                this.socket.emit("data_available", {
                    methodName: "proctoring",
                    room: $.test._id,
                    userId: $.userId,
                    socketId: $.socketId,
                    upload:true,
                    chunk: event.data
                });
                } else {
                    alert('Socket disconnnected! Some error occured. Please retry the upload')
                    this.mediaRecorder.stop();
                }
            } else {
                // ...
            }
        },
        endUpload() {
            let $ = this;
            console.log('upload ended');
            this.mediaRecorder.stop();
            this.uploadEnded = true;
            this.socket.emit("leave-upload", {
                methodName: "proctoring",
                room: $.test._id,
                userId: $.userId,
                socketId: $.socketId,
                upload:true,
                socketId: $.socketId 
            });
        },
        startTest(){
            let $ = this;
            $.isLoading = true;
            const hdConstraints = {
                video: true
            };
            const video = document.querySelector('video');
            Promise.all([
                faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh),
                cocoSsd.load()
            ]).then(result => {
                const facePredict = async () => {
                    const predictions = await result[0].estimateFaces({
                        input: document.querySelector("video")
                    });
                    if(!predictions.length) return {lookedAway:true,numberOfPeople:predictions.length,confidence:0};
                    const leftCheek = predictions[0].annotations.leftCheek[0];
                    const midwayBetweenEyes = predictions[0].annotations.midwayBetweenEyes[0];
                    const noseTip = predictions[0].annotations.noseTip[0];
                    const leftIrisError = this.calculateError(predictions[0].annotations.leftEyeIris);
                    const rightIrisError = this.calculateError(predictions[0].annotations.rightEyeIris);
                    let lookedAway = false;
                    if(leftIrisError+rightIrisError>0.15) {
                        lookedAway = true;
                    }
                    if (leftCheek[2] >= 18 || leftCheek[2] <= -18) {
                        lookedAway = true;
                    } else if (midwayBetweenEyes[2] >= 5 || midwayBetweenEyes[2] <= -20 ) {
                        lookedAway = true;
                    } else if (noseTip[2] > -18) {
                        lookedAway = true;
                    } else {
                        lookedAway = false;
                    }
                    return {lookedAway,numberOfPeople:predictions.length,confidence:predictions[0].faceInViewConfidence};
                }
                const mobilePredict = async () => {
                    const predictions = await result[1].detect(document.querySelector("video"));
                    return {mobile:predictions.some(prediction => prediction.class === 'cell phone')};
                }
                const predict = () => {
                    return Promise.all([facePredict(),mobilePredict()])
                        .then(result => {
                            return {
                                ...result[0],
                                ...result[1]
                            }
                        })
                }
                const startPrediction = async() => {
                    const result = await predict();
                    if(!this.logs[this.time])this.logs[this.time]=[0,0,0,0];
                    this.logs[this.time][0] += result.lookedAway?1:0;
                    this.logs[this.time][1] += result.numberOfPeople>1?1:0;
                    this.logs[this.time][2] += result.confidence<0.8?1:0;
                    this.logs[this.time][3] += result.mobile?1:0;
                    if(result.lookedAway||result.confidence<0.8) $.warning = 'Please look the screen ';
                    else $.warning = '';
                    if(result.mobile) $.warning += 'Using Mobile is not Allowed ';
                    else $.warning += '';
                    if(result.numberOfPeople>1) $.warning += 'More than 1 people ';
                    else $.warning += '';
                    // if(result.lookedAway ||  result.numberOfPeople>1 ||  result.confidence<0.8 || result.mobile){
                    //     $.continuousFlags += 1;
                    // } else {
                    //     $.continuousFlags = 0;
                    // }
                    // if($.continuousFlags>25){
                    //     $.beep.start();
                    // }else{
                    //     $.beep.stop();
                    // }
                    if(!this.testEnded)requestAnimationFrame(startPrediction);
                }
                let ss = $.socket;
                ss.emit("subscribe-upload", {
                    methodName: "proctoring",
                    room: $.test._id,
                    userId: $.userId,
                    socketId: $.socketId, 
                    upload:true
                });
                let mediaRecorder = new MediaRecorder($.stream);
                $.mediaRecorder = mediaRecorder;
                $.mediaRecorder.start(1000);
                $.mediaRecorder.ondataavailable = (event)=>$.handleDataAvailable(event);
                $.timeInterval = setInterval(()=>{
                    $.time += 1;
                }, 60*1000);
                startPrediction();
                $.isLoading = false;
            }).catch(err => console.log(err));
        },
    }
}
</script>

<style scoped>
.float{
	position:fixed;
	width:250px;
	height:200px;
	bottom:40px;
	right:40px;
	color:#FFF;
	border-radius:10px;
	text-align:center;
    font-size:30px;
	box-shadow: 2px 2px 3px #999;
    z-index:100;
}
.loading {
    position: fixed;
    z-index: 999;
    height: 2em;
    width: 2em;
    overflow: visible;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
}
</style>