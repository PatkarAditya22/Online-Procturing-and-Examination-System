    <template>
    <div>
        <nav class="navbar navbar-expand-lg navbar navbar-dark bg-dark">
            <a class="navbar-brand" href="#">Online Proctoring Platform</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                <li class="nav-item active m-2">
                    <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item m-2">
                    <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle bg-dark" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Login
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a class="dropdown-item" href="#"><router-link to="/user/login">User</router-link></a>
                        <a class="dropdown-item" href="#"><router-link to="/org/login">Organization</router-link></a>
                    </div>
                    </div>
                </li>
                    <li class="nav-item m-2">
                    <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle bg-dark" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Register
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a class="dropdown-item" href="#"><router-link to="/user/register">User</router-link></a>
                        <a class="dropdown-item" href="#"><router-link to="/org/register">Organization</router-link></a>
                    </div>
                    </div>
                </li>
                </ul>
                <form class="form-inline my-2 my-lg-0">
                <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
                <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                </form>
            </div>
        </nav>
        <div style="text-align:center">
            <img src="../assets/1.png" alt="" style="width:800px;height:400px">
        </div>
        <div class="row" style="text-align:center;background-color:#2F5496">
            <div class="col-md-4" style="margin-top:20px;color:white">
                <img style="border-radius:50%;width:200px;height:150px;" src="../assets/2.jpg" alt="">
                <p>We offer you a proctoring platform as well as an examination portal where you can create exams!</p>
            </div>
            <div class="col-md-4" style="margin-top:20px;color:white">
                <img style="border-radius:50%;width:200px;height:150px;" src="../assets/3.jpg" alt="">
                <p>We check for various fraud detection methods namely Browser Tab Change, Full screen mode, Iris and neck movement, mobile and multi-person detection.</p>
            </div>
            <div class="col-md-4" style="margin-top:20px;color:white">
                <img style="border-radius:50%;width:200px;height:150px;" src="../assets/4.png" alt="">
                <p>We offer you a reason for being flagged along with complete logs and a video of your test uploaded on AWS</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>



    
    