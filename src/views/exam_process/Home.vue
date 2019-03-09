<template>
    <el-container>
        <el-header style="padding: 0px">
            <div style="background-color:#545c64;">
                <el-button type="info" style="float: right;margin-top: 10px;margin-right: 10px"
                           @click="exit">返回考试列表
                </el-button>
                <el-menu

                        class="el-menu-demo"
                        mode="horizontal"

                        background-color="#545c64"
                        text-color="#fff"
                        active-text-color="#ffd04b"
                        ref="head_menu" style="margin: 0 auto;width: 15%;min-width: 520px">


                    <el-submenu index="1">
                        <template slot="title">制卡 &nbsp;<i class="fa fa-arrow-circle-right fa-1x"></i></template>
                        <el-menu-item index="1-2" @click="$router.push({ path:'/template_upload'})">模板上传</el-menu-item>
                        <el-menu-item index="1-1" @click="$router.push({ path:'/exam_big_cutting'})">答题卡制作
                        </el-menu-item>


                    </el-submenu>

                    <el-submenu index="2">
                        <template slot="title"><i class="fa fa-arrow-circle-right fa-1x"></i>扫描 &nbsp;<i
                                class="fa fa-arrow-circle-right fa-1x"></i></template>


                        <el-menu-item index="2-1" @click="$router.push({ path:'/exam_cutting_makesure'})">模板确认
                        </el-menu-item>
                        <el-menu-item index="2-2" @click="$router.push({ path:'/student_paper_upload'})">答题卡扫描
                        </el-menu-item>


                    </el-submenu>

                    <el-submenu index="3">
                        <template slot="title"><i class="fa fa-arrow-circle-right fa-1x"></i>阅卷 &nbsp;<i
                                class="fa fa-arrow-circle-right fa-1x"></i></template>


                        <el-menu-item index="3-1" @click="$router.push({ path:'/exam_childmodel_cutting'})">批阅块设置
                        </el-menu-item>
                        <el-menu-item index="3-2" @click="$router.push({ path:'/exam_set_scorepoint'})">给分点设置
                        </el-menu-item>
                        <el-menu-item index="3-3" @click="$router.push({ path:'/ass_marking_paper'})">批阅任务分配
                        </el-menu-item>


                    </el-submenu>

                    <el-submenu index="4">
                        <template slot="title"><i class="fa fa-arrow-circle-right fa-1x"></i>成绩</template>
                        <el-menu-item index="4-1" @click="$router.push({ path:'/exam_answer_insert'})">标准答案录入
                        </el-menu-item>
                        <el-menu-item index="4-2">成绩发布</el-menu-item>
                        <el-menu-item index="4-3">关闭考试</el-menu-item>

                    </el-submenu>


                </el-menu>


            </div>

        </el-header>
        <el-main id="view_content">
            <transition name="fade3"
                        mode="out-in">
                <router-view ></router-view>
            </transition>


        </el-main>
        <el-footer>Footer</el-footer>
    </el-container>
</template>

<script>
    export default {
        name: "Home",
        methods:{
            exit(){
                sessionStorage.removeItem("templetIdList");
                this.$router.push({ path:'/exam'})
            }
        }
    }
</script>

<style scoped>
    .fade3-leave-active,
    .fade3-enter-active {
        transition: all .5s;
    }
    .fade3-enter {
        opacity: 0;
        transform: translateX(-30px);
    }
    .fade3-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }
    #view_content{
        overflow-x: hidden;
    }
</style>
