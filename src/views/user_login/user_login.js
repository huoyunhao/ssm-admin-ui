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
                            sessionStorage.setItem('userId',JSON.stringify(res.data.user.userId))
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