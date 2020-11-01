import Api from "./api";

export default {
    registerUser(user){
        const response = Api().post(
            'user/signup',
            user
        );
        return response;
    },
    loginUser(user){
        const response = Api().post(
            'user/signin',
            user
        );
        return response;
    },
    registerOrg(user){
        const response = Api().post(
            'org/signup',
            user
        );
        return response;
    },
    loginOrg(user){
        const response = Api().post(
            'org/signin',
            user
        );
        return response;
    },
    createTest(user) {
        const response = Api().post(
            'org/create_test',
            user
        );
        return response;
    },
    getAllTests(){
        const response = Api().get('org/get_all_tests');
        return response;
    },
    getAllUserTests(){
        const response = Api().get('user/get_all_tests');
        return response;
    },
    submitTest(userId,testId,body){
        const response = Api().post(
            `user/${userId}/test/${testId}`,
            body
        );
        return response;
    }
}