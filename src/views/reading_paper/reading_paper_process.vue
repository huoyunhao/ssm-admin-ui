<template>
    <div class="normal-items">
                        <div class="normal-item">
                            <div class="normal-item-title">切块1（{{progress.isMulit}}）</div>
                            <el-button circle>1</el-button>
                            <div>
                                <div style="margin-bottom: 10px;">测评 {{progress.examSubject}}</div>
                                <el-progress :percentage="progress.percent"></el-progress>
                            </div>
                            <el-button type="primary" @click="enterView">进入评阅</el-button>
                        </div>
                    </div>
</template>
<script>
import {get_reading_progress} from '../../api/api'
export default {
    data(){
        return {
            progress:{
                percent: 0
            }
        }
    },
    methods:{
        enterView() {
                this.$router.push({
                    path: "/reading_exam"
                })
        },
         get_progress(){
                get_reading_progress().then(res=>{
                    this.progress.percent = res.data.judgeProgress;
                    console.log(Number(this.progress.percent));
                    // this.progress.percent = Number(this.progress.percent)*100.0;
                    this.progress.percent = this.progress.percent*100;


                    this.progress.percent = parseInt(this.progress.percent);



                })

        },
    },
    mounted(){
        this.get_progress();
    }
}
</script>
<style scoped lang="less">
    .container {
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 100%;
        .header {
            height: 60px;
            line-height: 60px;
            background: #20a0ff;
            color: #fff;
            .userinfo {
                text-align: right;
                padding-right: 35px;
                float: right;
                .userinfo-inner {
                    cursor: pointer;
                    color: #fff;
                    img {
                        width: 40px;
                        height: 40px;
                        border-radius: 20px;
                        margin: 10px 0px 10px 10px;
                        float: right;
                    }
                }
            }
            .logo {
                width: 230px;
                height: 60px;
                font-size: 22px;
                padding-left: 20px;
                padding-right: 20px;
                border-color: rgba(238, 241, 146, 0.3);
                border-right-width: 1px;
                border-right-style: solid;
                img {
                    width: 40px;
                    float: left;
                    margin: 10px 10px 10px 18px;
                }
                .txt {
                    color: #fff;
                }
            }
            .logo-width {
                width: 230px !important;
            }
            .logo-collapse-width {
                width: 60px
            }
            .tools {
                padding: 0px 23px;
                width: 14px;
                height: 60px;
                line-height: 60px;
                cursor: pointer;
            }
        }
        .main {
            display: flex; // background: #324057;
            position: absolute;
            top: 60px;
            bottom: 0px;
            overflow: hidden;
            aside {
                flex: 0 0 230px;
                width: 230px; // position: absolute;
                // top: 0px;
                // bottom: 0px;
                .el-menu {
                    height: 100%;
                }
                .collapsed {
                    width: 60px;
                    .item {
                        position: relative;
                    }
                    .submenu {
                        position: absolute;
                        top: 0px;
                        left: 60px;
                        z-index: 99999;
                        height: auto;
                        display: none;
                    }
                }
            }
            .menu-collapsed {
                flex: 0 0 60px;
                width: 60px;
            }
            .menu-expanded {
                flex: 0 0 230px;
                width: 230px;
            }
            .content-container {
                // background: #f1f2f7;
                flex: 1; // position: absolute;
                // right: 0px;
                // top: 0px;
                // bottom: 0px;
                // left: 230px;
                overflow-y: scroll;
                padding: 20px;
                .breadcrumb-container {
                    //margin-bottom: 15px;
                    .title {
                        width: 200px;
                        float: left;
                        color: #475669;
                    }
                    .breadcrumb-inner {
                        float: right;
                    }
                }
                .content-wrapper {
                    background-color: #fff;
                    box-sizing: border-box;
                }
            }
        }
    }

    .fade1-enter-active {
        transition: all .4s ease;
    }

    .fade1-leave-active {
        transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .fade1-enter
        /* .slide-fade-leave-active for below version 2.1.8 */
    {
        transform: translateX(-230px);
        opacity: 0;
    }

    .fade1-leave-to {
        transform: translateX(-230px);
        opacity: 0;
        width: 60px;

    }

    .normal-item {
        text-align: center;
        border-bottom: 1px solid #d9d9d9;
        padding-bottom: 30px;
        color: #606266;
        & > * {
            display: inline-block;
        }
        .normal-item-title {
            display: block;
            text-align: center;
            width: 100%;
            margin-bottom: 20px;
            -webkit-transform: translateX(-20px);
            -moz-transform: translateX(-20px);
            -ms-transform: translateX(-20px);
            -o-transform: translateX(-20px);
            transform: translateX(-20px);
            font-size: 18px;
        }
        button:nth-of-type(1) {
            float: left;
            font-size: 16px;
            width: 50px;
            height: 50px;
        }
        button:nth-of-type(2) {
            float: right;
        }
        & > div {
            width: 60%;

        }
    }

    .not-have-paper {
        font-size: 20px;
        text-align: center;
        height: 60px;
        line-height: 60px;
        color: #303133;
    }
</style>

