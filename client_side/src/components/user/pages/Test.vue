<template>
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
            </div>
        </div>
        <div>
            <div @click="isTestStartedFunc"> Start Test</div>
            <div @click="endUpload">End Upload</div>
        </div>
        <div class="col-md-4">
            <video autoplay class="float"/>
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
            isLoading:true,
            isTestStarted: false,
            redFlags: 3,
            socketId: null,
            mediaRecorder: null,
            logs:{}
        }
    },
    created(){
        this.test = [
            {
                questionText: "How are you?",
                options: ['fine','good','great'],
                correctOptions: [0],
                type: 'single'
            },
            {
                questionText: "How are you?",
                options: ['fine','good','great'],
                correctOptions: [2],
                type: 'single'
            },
            {
                questionText: "How are you?",
                options: ['fine','good','great'],
                correctOptions: [1],
                type: 'text'
            },
        ];        
    },
    mounted(){
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
                room: $.test.testId,
                userId: $.userId,
                upload:true,
                socketId: $.socketId,
            });
            // ss.on("host-leave",() => {
            //     console.log("hostleft")
            //     if($.mediaRecorder&&!$.uploadEnded){
            //         $.endUpload();
            //     }
            //     ss.disconnect();
            //     this.$router.push("/");
            // })
        });
    },
    methods:{
        isTestStartedFunc(){
            let $ = this;
            document.addEventListener('visibilitychange', function(){
                console.log(document.visibilityState);
            });
            document.onkeypress = function(evt){console.log(evt)};
            document.documentElement.requestFullscreen().then(()=>{
                $.isTestStarted = true;
                $.startTest();
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
            console.log('khatam');
        },
        handleDataAvailable(event) {
            let $ = this;
            console.log("data-available");
            if (event.data.size > 0) {
                console.log(this.socket.connected);
                if(this.socket.connected){
                this.socket.emit("data_available", {
                    methodName: "proctoring",
                    room: $.test.testId,
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
                room: $.test.testId,
                userId: $.userId,
                socketId: $.socketId,
                upload:true,
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
            const hdConstraints = {
                video: true
            };
            const video = document.querySelector('video');
            Promise.all([
                navigator.mediaDevices.getUserMedia(hdConstraints),
                faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh),
                cocoSsd.load()
            ]).then(result => {
                video.srcObject = result[0];
                const facePredict = async () => {
                    const predictions = await result[1].estimateFaces({
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
                    const predictions = await result[2].detect(document.querySelector("video"));
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
                        methodName: "proctoring",
                        room: $.test.testId,
                        userId: $.userId,
                        socketId: $.socketId, 
                        upload:true
                    });
                    let mediaRecorder = new MediaRecorder(result[0]);
                    $.mediaRecorder = mediaRecorder;
                    $.mediaRecorder.start(1000);
                    $.mediaRecorder.ondataavailable = (event)=>$.handleDataAvailable(event);
                    console.log($.mediaRecorder);
                    startPrediction();
                    setInterval(()=>{
                        $.time += 1;
                        console.log($.logs);
                    }, 60*1000);
                };
                this.isLoading = false;
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