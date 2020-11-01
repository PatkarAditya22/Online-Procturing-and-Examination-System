<template>
    <div class="container">
        <div>
            {{ test }}
        </div>
        <div v-for="(user,index) in users" :key="index">

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