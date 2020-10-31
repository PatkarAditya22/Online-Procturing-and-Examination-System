<template>
    <div class="container mx-auto mt-3">
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
            this.$router.push(`/org/test/${testId}/summary`)
        }
    },
    async created(){
        const response = await Api.getAllTests();
        this.tests = response.data.tests;
        this.$store.commit('setTests',{ test: this.tests});
        console.log(this.tests);
        console.log(this.tests[0].testName);
    }
}
</script>

<style scoped>

</style>