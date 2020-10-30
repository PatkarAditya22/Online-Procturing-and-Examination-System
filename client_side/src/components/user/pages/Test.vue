<template>
    <div>
        <div v-if="isTestStarted" class="row">
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
        <div v-else>
            <div @click="isTestStartedFunc"> Start Test</div>
        </div>
        <div class="col-md-4">
            <video autoplay/>
        </div>
    </div>
</template>

<script>
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";

export default {
    props: ['testId'],
    components: {
        
    },
    data(){
        return {
            test: null,
            testEnded:false,
            result: null,
            isLoading:true,
            isTestStarted: false,
            redFlags: 3
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
        
    },
    methods:{
        isTestStartedFunc(){
            let $ = this;
            document.addEventListener('visibilitychange', function(){
                console.log(document.visibilityState);
            });
            document.onkeypress = function(evt){console.log(evt)};
            document.documentElement.requestFullscreen().the(()=>{
                $.isTestStarted = true;
                $.startTest();
            }).catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
            document.documentElement.requestFullscreen();
            // document.onfullscreenchange = this.endTest;
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
        startTest(){
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
                    console.log(await predict());
                    if(!this.testEnded)requestAnimationFrame(startPrediction);
                }
                video.onloadeddata = () => startPrediction();
                this.isLoading = false;
            }).catch(err => console.log(err));
        },
    }
}
</script>

<style scoped>

</style>