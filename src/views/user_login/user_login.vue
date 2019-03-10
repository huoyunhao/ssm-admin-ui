<template>
    <div id="login">
        <el-form :model="loginForm" :rules="rules2" ref="loginForm" label-position="left" label-width="0px"
                 class="demo-ruleForm login-container">
            <h3 class="title">管理登录</h3>
            <el-form-item prop="account">
                <el-input type="text" v-model="loginForm.account" auto-complete="off"
                          placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
                <el-input type="password" v-model="loginForm.checkPass" auto-complete="off"
                          placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item prop="verification_code" >
                <el-row :gutter="25">
                    <el-col :span="16"><el-input type="text" v-model="loginForm.verification_code" auto-complete="off"
                                                placeholder="请输入验证码" @keyup.enter.native="submit"></el-input></el-col>
                    <el-col :span="8"><img :src="code_url" width="90px" style="display: block;height: 40px" @click="change_code" ref="auth_img"/></el-col>

                </el-row>



            </el-form-item>

            <el-checkbox v-model="checked" checked class="remember">记住用户名</el-checkbox>
            <el-form-item style="width:100%;">
                <el-button type="primary" style="width:100%;" @click.native.prevent="submit"
                           :loading="logining">登录
                </el-button>
                <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
            </el-form-item>
        </el-form>


    </div>

</template>

<script>
    import {login,tmp_login,auth_code} from '../../api/api';
//import NProgress from 'nprogress'
export default {
    data() {
        return {
            logining: false,
            user_class: "admin",
            confirmSuccess: true,
            code_url:"",
            loginForm: {
                account: '',
                checkPass: '',
                verification_code:''
            },
            rules2: {
                account: [
                    {required: true, message: '请输入账号', trigger: 'blur'},
                    //{ validator: validaePass }
                ],
                checkPass: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    //{ validator: validaePass2 }
                ]
            },
            checked: false
        };
    },
    mounted(){
        let that = this;
        auth_code().then((res)=>{
            return 'data:image/png;base64,' + btoa(
                new Uint8Array(res)
                    .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

        }).then(data => {
            this.code_url = data;

            // $('#qrCode').attr('src', data);
        })
        this.loginForm.account = this.getCookie("username");
        // this.loginForm.checkPass = this.getCookie("password");

    },
    methods: {
        submit: function () {

            if(this.loginForm.account == ''||this.loginForm.checkPass == ''){
                this.$alert('请填写账号和密码！', '提示', {
                    dangerouslyUseHTMLString: true
                });
            }else {
                this.logining = true ;
                let para = {
                    "userAccount": this.loginForm.account,
                    "userPass": this.loginForm.checkPass,
                    "value": this.loginForm.verification_code

                };
                let para1 = {
                    "userAccount": this.loginForm.account,
                    "userPass": this.loginForm.checkPass,
                    "value": this.loginForm.verification_code

                };
                let that = this;
                if(this.loginForm.account.substring(0,4)=='temp'){
                    login(para).then((res)=>{
                        if (res.code == '200') {
                            sessionStorage.setItem('user', JSON.stringify(res.data.user));
                            this.logining = false ;

                            that.$router.push({path: '/reading_index'});

                        } else {
                            this.$alert(res.data.msg, '提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.change_code();
                                    this.logining = false ;
                                    // this.loginForm.account = '';
                                    // this.loginForm.checkPass = '';
                                    this.loginForm.verification_code = '';
                                    //location.reload();

                                }
                            });


                        }

                    })

                }else {
                    login(para1).then((res) => {
                        if (res.code == '200') {
                            sessionStorage.setItem('user', JSON.stringify(res.data.user));
                            sessionStorage.setItem('school_id', res.data.user.companyId);
                            this.logining = false ;
                            if(this.checked == true){
                                this.setCookie("username",para1.userAccount,7);
                                // this.setCookie("password",para1.userPass,7);
                            }



                            that.$router.push({path: '/main'});

                        } else {
                            this.$alert(res.data.msg, '提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.change_code();
                                    this.logining = false ;
                                    // this.loginForm.account = '';
                                    // this.loginForm.checkPass = '';
                                    this.loginForm.verification_code = '';

                                }
                            });
                        }


                    })

                }

            }



        },
        change_code(){
            let that = this;
            auth_code().then((res)=>{
                console.log(res);
                return 'data:image/png;base64,' + btoa(
                    new Uint8Array(res)
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                );

            }).then(data => {
                this.code_url = data;

                // $('#qrCode').attr('src', data);
            })

        }

    }
}


</script>



<style lang="less" scoped>
    .login-container {
        /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
        .title {
            margin: 0px auto 40px auto;
            text-align: center;
            color: #505458;
        }
        .remember {
            margin: 0px 0px 35px 0px;
        }
    }

    #login {
        background-image: url("../../../static/img/bg1.jpg");
        background-position: center;
        height: 100%;
        width: 100%;
        position: absolute;
    }
</style>
