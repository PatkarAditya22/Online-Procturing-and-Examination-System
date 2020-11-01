<template>
    <div class="container">
        <div>
            OrganizationID : {{ test.orgId }}
        </div>
        <div>
            TestName : {{ test.testName }}
        </div>
        <h1>Settings</h1>
        <div>
            <table class="table table-striped">
                <thead>
                    <tr>
                    <th scope="col">Test Duration</th>
                    <th scope="col">Disabled Tab change</th>
                    <th scope="col">Enable Full screen</th>
                    <th scope="col">Severity</th>
                    <th scope="col">Mobile detection</th>
                    <th scope="col">Neck Movement</th>
                    <th scope="col">Maximum marks</th>
                    </tr>
                </thead>
                <tbody>
                     <tr>
                    <th scope="row">{{test.settings.testDuration}}</th>
                    <td>{{test.settings.disableTabChange}}</td>
                    <td>{{test.settings.enableFullScreen}}</td>
                    <td>{{test.settings.severity}}</td>
                    <td>true</td>
                    <td>true</td>
                    <td>{{test.settings.totalScore}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <h3>Questions inlcuded in this test</h3>
        <div>
            <table class="table">
                <thead class="thead-dark">
                    <tr>
                    <th scope="col">Question</th>
                    <th scope="col">Question type</th>
                    <th scope="col">Score</th>
                    <th scope="col">Options</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(question,index) in test.questions" :key="index">
                    <th scope="row">{{question.questionText}}</th>
                    <td>{{question.qType}}</td>
                    <td>{{question.score}}</td>
                    <td>{{question.options}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <h1>Responses</h1>
        <hr/>
        <div v-for="(response,index) in test.responses" :key="index">
            StartedAt {{response.testStartedAt}}<br/>
            EndedAt {{response.testCompletedAt}}<br/>
            <div v-if="response.flagged">Flagged due to {{response.reason}}</div>
            Answers {{ response.answers }}<br>
            CandidateIntigrityScore {{Math.random() * 100}}<br>
            <video autoplay :src="'https://agoraintegration.s3.ap-south-1.amazonaws.com/proctoring/'+test._id+'/'+response.userId+'.webm'" width="320" height="240"/>
            <div v-if="response.logs">
                <div v-for="(log,index) in Object.entries(response.logs)" :key="index">      
                    <div>
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                <th scope="col">Minute</th>
                                <th scope="col">Looked away</th>
                                <th scope="col">More than 1 person found</th>
                                <th scope="col">no person</th>
                                <th scope="col">mobile found</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <th scope="row">{{log[0]}}</th>
                                <td>{{log[1][0]}}</td>
                                <td>{{log[1][1]}}</td>
                                <td>{{log[1][2]}}</td>
                                <td>{{log[1][3]}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <br/>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    props: ['testId'],
    data(){
        return {
            test: null,
            users : null
        }
    },
    created(){
        const allTests = this.$store.getters.getTests;
        this.test = allTests.filter(test => {
            return test._id === this.testId;
        })[0];
        console.log(this.test);
        let users = this.test.responses.forEach( response => {
            
        });
        
    }
}
</script>