<template>
    <div class="container">
        <div>
            {{ this.test }}
        </div>
    </div>
</template>


<script>
export default {
    props: ['testId'],
    data(){
        return {
            test: null
        }
    },
    created(){
        allTests = this.$store.getters.getTests;
        this.test = allTests.filter(test => {
            return test._id === this.testId;
        })[0];
    }
}
</script>