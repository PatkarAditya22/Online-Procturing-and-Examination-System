<template>
    <div class="container mx-auto mt-3">
        <div v-for="test in tests" :key="test.testId">
            <base-card class="p-3">
                <div class="row">
                    <div class="col-md-3">

                    </div>
                    <div class="col-md-8 ml-2">
                        <h4>{{ test.testName }}</h4>
                        <p class="text-muted">Duration - {{ test.testDuration }}</p>
                        <p class="text-muted">Total Questions - {{ test.questions.length }}</p>
                    </div>
                </div>
            </base-card>
        </div>
    </div>
</template>
 
<script>
export default {
    date(){
        return {
            tests: null,
        }
    },
    created(){
        this.tests = [
            {
                testName: "JEE Advanced",
                testId: 1,
                orgName: 'NCERT',
                testDuration: '3 hrs',
                settings:{},
                questions: [
                    {
                        questionText: "What is you name?",
                        options: null,
                        correctOptions: null,
                        type: 'text'
                    },
                    {
                        questionText: "How are you?",
                        options: ['fine','good','great'],
                        correctOptions: ['great'],
                        type: 'single'
                    },
                    {
                        questionText: "What is your fav subject?",
                        options: ['AI','IoT','SE','CN'],
                        correctOptions: ['AI','IoT','SE','CN'],
                        type: 'multiple'
                    },
                ]
            },
            {
                testName: "JEE Advanced",
                testId: 2,
                orgName: 'NCERT',
                testDuration: '3 hrs',
                settings:{},
                questions: [
                    {
                        questionText: "What is you name?",
                        options: null,
                        correctOptions: null,
                        type: 'text'
                    },
                    {
                        questionText: "How are you?",
                        options: ['fine','good','great'],
                        correctOptions: ['great'],
                        type: 'single'
                    },
                    {
                        questionText: "What is your fav subject?",
                        options: ['AI','IoT','SE','CN'],
                        correctOptions: ['AI','IoT','SE','CN'],
                        type: 'multiple'
                    },
                ]
            }
        ]
    }
}
</script>

<style scoped>

</style>