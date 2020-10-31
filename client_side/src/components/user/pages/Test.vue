<template>
<<<<<<< Updated upstream
    <div>
        <div v-if="isLoading">
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
||||||| merged common ancestors
    <div> 
        <div v-if="isTestStarted && !testEnded" class="row">
            <div class="col-md-6">
                <base-card v-for="(question,index) in test" :key="index" style="width: 18rem;">
                    <div>
                        <div class="card-body">
                            <h5 class="card-title">{{ question.questionText }}</h5>
                        </div>
                        <div v-if="question.type=='single'">
                            <ul class="list-group list-group-flush" v-for="(option,index) in question.options" :key="index">
                            <li class="list-group-item">{{ option }}</li>
                        </ul>
                        </div>
                        <div v-else>
                            <textarea name="" id="" cols="10" rows="5"></textarea>
                        </div>
                    </div>
                </base-card>
=======
    <div> 
        <div v-if="isTestStarted && !testEnded" class="row">
            <div class="col-md-10 w-100">
                <base-card v-for="(question,index) in test.questions" :key="index" style="width: 18rem;">
                    <div>
                        <div class="card-body">
                            <h5 class="card-title">Q. {{ question.questionText }}</h5>
                        </div>
                        <div v-if="question.qType=='single'">
                            <div v-for="(option,index) in question.options" :key="index">
                                <input type="radio" name="" id=""> {{ option }}
                            </div>
                        </div>
                        <div v-else-if="question.qType=='multiple'">
                            <div v-for="(option,index) in question.options" :key="index">
                                <input type="checkbox" name="" id=""> {{ option }}
                            </div>
                        </div>
                        <div v-else>
                            <textarea name="" id="" cols="60" rows="30"></textarea>
                        </div>
                    </div>
                </base-card>
>>>>>>> Stashed changes
            </div>
        </div>
<<<<<<< Updated upstream
        <div> 
            <div v-if="isTestStarted && !testEnded" class="row">
                <div class="col-md-6">
                    <base-card v-for="(question,index) in test" :key="index" style="width: 18rem;">
                        <div>
                            <div class="card-body">
                                <h5 class="card-title">{{ question.questionText }}</h5>
                            </div>
                            <div v-if="question.type=='single'">
                                <ul class="list-group list-group-flush" v-for="(option,index) in question.options" :key="index">
                                <li class="list-group-item">{{ option }}</li>
                            </ul>
                            </div>
                            <div v-else>
                                <textarea name="" id="" cols="10" rows="5"></textarea>
                            </div>
                        </div>
                    </base-card>
                    <div @click="endTest">Submit Test</div>
                </div>
            </div>
            <div v-else-if="!testEnded">
                <div @click="isTestStartedFunc"> Start Test</div>
            </div>
            <div class="col-md-4">
                <video autoplay class="float"/>
            </div>
||||||| merged common ancestors
        <div>
            <div @click="isTestStartedFunc"> Start Test</div>
            <div @click="endUpload">End Upload</div>
        </div>
        <div class="col-md-4">
            <video autoplay class="float"/>
        </div>
=======
        <div>
            <div @click="isTestStartedFunc"> Start Test</div>
        </div>
        <div class="col-md-4">
            <video autoplay class="float"/>
        </div>
>>>>>>> Stashed changes
        </div>
    </div>
</template>

<script>
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import io from "socket.io-client";

export default {
    props: ['testId'],
    components: {
        
    },
    data(){
        return {
            time:0,
            test: null,
            testEnded:false,
            result: null,
            isLoading:false,
            isTestStarted: false,
            redFlags: 3,
            socketId: null,
            mediaRecorder: null,
            logs:{}
        }
    },
    created(){
        let all_tests = this.$store.getters.getUserTests;
        this.test = all_tests.filter(test =>{
            return test._id === this.testId;
<<<<<<< Updated upstream
        })
        console.log(this.test);      
||||||| merged common ancestors
        })
        console.log(this.test);
        // this.test = [
        //     {
        //         questionText: "How are you?",
        //         options: ['fine','good','great'],
        //         correctOptions: [0],
        //         type: 'single'
        //     },
        //     {
        //         questionText: "How are you?",
        //         options: ['fine','good','great'],
        //         correctOptions: [2],
        //         type: 'single'
        //     },
        //     {
        //         questionText: "How are you?",
        //         options: ['fine','good','great'],
        //         correctOptions: [1],
        //         type: 'text'
        //     },
        // ];        
=======
        });
        console.log(this.test);
        // this.test = [
        //     {
        //         questionText: "How are you?",
        //         options: ['fine','good','great'],
        //         correctOptions: [0],
        //         type: 'single'
        //     },
        //     {
        //         questionText: "How are you?",
        //         options: ['fine','good','great'],
        //         correctOptions: [2],
        //         type: 'single'
        //     },
        //     {
        //         questionText: "How are you?",
        //         options: ['fine','good','great'],
        //         correctOptions: [1],
        //         type: 'text'
        //     },
        // ];        
>>>>>>> Stashed changes
    },
    mounted(){
        const hdConstraints = {
            video: true
        };
        const video = document.querySelector('video');
        navigator.mediaDevices.getUserMedia(hdConstraints).then(result => {
            video.srcObject = result;
        }).catch(err => console.log(err));
        document.addEventListener('keydown',function(e){
            console.log(e.keyCode);
            var charCode = e.charCode || e.keyCode || e.which;
            if (charCode == 27){
                console.log('escape');
                return false;
            }
        });
        this.socket = io("http://152.67.10.242/server/stream");
        let $ = this;
        let ss = this.socket;
        ss.on("connect", () => {
            $.socketId = ss.io.engine.id;
            ss.emit("subscribe", {
                testId: $.test.testId,
                userId: $.userId,
                upload: true,
                socketId: $.socketId,
            });
        });
    },
    methods:{
        isTestStartedFunc(){
            let $ = this;
            document.addEventListener('visibilitychange', function(){
                if(document.visibilityState === "hidden"){}
                    $.endTest();
            });
            document.onkeypress = function(evt){console.log(evt)};
            document.documentElement.requestFullscreen().then(()=>{
                $.isTestStarted = true;
                $.startTest();
                console.log('isteststarted',this.isTestStarted);
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
        endTest(){
            this.testEnded = true;
            this.endUpload();
            router.push("/");
            let videoElem = document.querySelector("video");
            const stream = videoElem.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(function(track) {
                track.stop();
            });
            videoElem.srcObject = null;
            //API CALL HERE TO SUBMIT LOGS AND RESPONSES
        },
        handleDataAvailable(event) {
            let $ = this;
            if (event.data.size > 0) {
                if(this.socket.connected){
                this.socket.emit("data_available", {
                    testId: $.test.testId,
                    userId: $.userId,
                    upload: true,
                    socketId: $.socketId,
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
                testId: $.test.testId,
                userId: $.userId,
                upload: true,
                socketId: $.socketId 
            }); 
            if(this.videoRecordingStream){
                const tracks = this.videoRecordingStream.getTracks();
                tracks.forEach(function(track) {
                track.stop();
                });
                this.videoRecordingStream = null;
            }
            if(this.screenRecordingStream){
                const tracks = this.screenRecordingStream.getTracks();
                tracks.forEach(function(track) {
                track.stop();
                });
                this.screenRecordingStream = null;
            }
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
                    if(!this.testEnded)requestAnimationFrame(startPrediction);
                }
                video.onloadeddata = () => {
                    let ss = $.socket;
                    ss.emit("subscribe-upload", {
                        testId: $.testId,
                        userId: $.userId,
                        upload: true,
                        socketId: $.socketId 
                    });
<<<<<<< Updated upstream
                    let mediaRecorder = new MediaRecorder(result[0]);
                    $.mediaRecorder = mediaRecorder;
                    $.mediaRecorder.start(1000);
                    $.mediaRecorder.ondataavailable = (event)=>$.handleDataAvailable(event);
||||||| merged common ancestors
                    let mediaRecorder = new MediaRecorder(result[0]);
                    $.mediaRecorder = mediaRecorder;
                    $.mediaRecorder.start(1000);
                    $.mediaRecorder.ondataavailable = (event)=>$.handleDataAvailable(event);
                    console.log($.mediaRecorder);
=======
                    let mediaRecorder = new MediaRecorder(video.captureStream(25),{mimeType: "video/webm; codecs=vp9"});
                    mediaRecorder.ondataavailable = this.handleDataAvailable;
>>>>>>> Stashed changes
                    startPrediction();
                    setInterval(()=>{
                        $.time += 1;
                    }, 60*1000);
                };
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
</style>