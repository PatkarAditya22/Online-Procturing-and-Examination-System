<template>
    <div class="container mx-auto mt-3">
        <!-- <div v-if="testsPresent">
            No tests found
        </div> -->
        <div>
            <div v-for="test in tests" :key="test._id">
                <base-card class="p-3">
                    <div class="row">
                        <div class="col-md-3">
                        </div>
                        <div class="col-md-8 ml-2">
                            <h4 @click="nextPage(test._id)">{{ test.testName }}</h4>
                            <p class="text-muted">Duration - {{ test.settings.testDuration }}</p>
                            <p class="text-muted">Total Questions - {{ test.questions.length }}</p>
                            <h5>Organised by - {{ test.orgId }}</h5>
                        </div>
                    </div>
                </base-card>
            </div>
        </div>
    </div>
</template>
 
<script>
import Api from '../../../utils/api';
export default {
    date(){
        return {
            tests: null,
        }
    },
    methods : {
        nextPage(testId){
            this.$router.push({path:`/org/test/{testId}/summary`,params:{}})
        }
    },
    computed: {
        testsPresent(){
            return this.tests.length === 0;
        }
    },
    async created(){
        const response = await Api.getAllTests();
        this.tests = response.data.tests;
        this.$store.commit('setTests',{ test: this.tests});
        console.log(this.tests);

        // this.tests = [
        //     {
        //         testName: "JEE Advanced",
        //         testId: 1,
        //         orgName: 'NCERT',
        //         testDuration: '3 hrs',
        //         settings:{},
        //         questions: [
        //             {
        //                 questionText: "What is you name?",
        //                 options: null,
        //                 correctOptions: null,
        //                 type: 'text'
        //             },
        //             {
        //                 questionText: "How are you?",
        //                 options: ['fine','good','great'],
        //                 correctOptions: ['great'],
        //                 type: 'single'
        //             },
        //             {
        //                 questionText: "What is your fav subject?",
        //                 options: ['AI','IoT','SE','CN'],
        //                 correctOptions: ['AI','IoT','SE','CN'],
        //                 type: 'multiple'
        //             },
        //         ]
        //     },
        //     {
        //         testName: "JEE Advanced",
        //         testId: 2,
        //         orgName: 'NCERT',
        //         testDuration: '3 hrs',
        //         settings:{},
        //         questions: [
        //             {
        //                 questionText: "What is you name?",
        //                 options: null,
        //                 correctOptions: null,
        //                 type: 'text'
        //             },
        //             {
        //                 questionText: "How are you?",
        //                 options: ['fine','good','great'],
        //                 correctOptions: ['great'],
        //                 type: 'single'
        //             },
        //             {
        //                 questionText: "What is your fav subject?",
        //                 options: ['AI','IoT','SE','CN'],
        //                 correctOptions: ['AI','IoT','SE','CN'],
        //                 type: 'multiple'
        //             },
        //         ]
        //     }
        // ]
    }
}
</script>

<style scoped>

</style>