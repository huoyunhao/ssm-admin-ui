<template>
    <section>
        <!--上工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" >
                <el-form-item>
                <el-input v-model="targetIP"  placeholder="IP地址"></el-input>
                </el-form-item>
                <el-form-item>
                <el-button  type="primary">IP查询</el-button>
                </el-form-item>
                <el-date-picker
                        v-model="time"
                        type="datetimerange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['12:00:00']"
                        value-format="timestamp"
                >
                </el-date-picker>
                <el-form-item>
                    <el-button type="success" @click="get_logs_by_date(1)" ref="date_search">按日期搜索</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="warning" @click="edit_date_search" v-show="display_exit_date" >退出日期搜索</el-button>
                </el-form-item>

            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="system_logs" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="请求获取的参数:">
                            <span>{{ props.row.gets }}</span>
                        </el-form-item>
                        <el-form-item label="请求发送的参数">
                            <span>{{ props.row.posts }}</span>
                        </el-form-item>
                        <el-form-item label="客户端类型:">
                            <span>{{ props.row.userAgent }}</span>
                        </el-form-item>

                    </el-form>
                </template>
            </el-table-column>
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>

            <el-table-column prop="optionPersion" label="操作人" width="120"  sortable>
            </el-table-column>
            <el-table-column prop="logValue" label="花费时间" width="120"  sortable>
            </el-table-column>
            <el-table-column prop="createTime" label="执行时间" width="190"  sortable>
            </el-table-column>
            <el-table-column prop="url" label="操作地址" width="450"  sortable>
            </el-table-column>
            <!--<el-table-column prop="userAgent" label="客户端类型" width="100"  sortable>-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="gets" label="gets" width="100"  sortable>-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="posts" label="posts" width="350"  sortable>-->
            <!--</el-table-column>-->
            <el-table-column prop="ip" label="客户端ip" width="160"  sortable>
            </el-table-column>


            <el-table-column label="操作" width="80">
                <template slot-scope="scope">

                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--下工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="total,  prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" @size-change="handleSizeChange"
                           :total="total" style="float:right;" :current-page="pageNum" >
            </el-pagination>
        </el-col>


    </section>
</template>

<script>
    import util from '../../common/js/util'
    import NProgress from 'nprogress'
    import {  get_system_log,get_special_log,get_system_log_by_date} from '../../api/api';
    import {js_date} from '../../components/js_date/js_date'
    export default {
        data() {
            return {
                targetIP:'',
                listLoading: false,
                sels: [],//列表选中列
                //logs
                system_logs:[],
                pageNum: 0,
                pageSize: 0,
                size: 0,
                startRow: 0,
                endRow: 0,
                total: 0,
                pages: 0,
                time:'',
                mode:'0' ,//0 显示全部，1 日期搜索结果， 2 ip搜索结果
                display_exit_date:false









            }
        },
        methods: {
            handleSizeChange: function (size) {
                this.pageSize = size;
            },
            //日期搜索
            get_logs_by_date:function(page){
                let para = {
                    "startTime": this.time[0],
                    "endTime": this.time[1]

                }
                get_system_log_by_date(page,para).then( (res) => {
                    this.system_logs = res.data.pageinfo.list;
                    for (let i in this.system_logs) {
                        // console(1);
                        // console.log(i);
                        this.system_logs[i].createTime = js_date(this.system_logs[i].createTime);
                        this.$set(this.system_logs, i, this.system_logs[i]);

                    }

                    this.pageNum = res.data.pageinfo.pageNum;
                    this.pageSize = res.data.pageinfo.pageSize;
                    this.total = res.data.pageinfo.total;
                    this.pages = res.data.pageinfo.pages;

                    this.listLoading = false;
                    this.mode = "1";
                    this.display_exit_date = true;
                    NProgress.done();



                })

                console.log(this.$refs.date_search);




            },
            get_logs_by_ip:function(val,page){
                if(val){
                    get_special_log(val,page).then(
                        res=>{
                            this.system_logs=res.data.pageinfo.list;
                            for(let i=0;i<this.system_logs.length;i++){
                                this.$set(this.system_logs, i, this.system_logs[i]);    
                            }
                            this.pageNum = res.data.pageinfo.pageNum;
                            this.pageSize = res.data.pageinfo.pageSize;
                            this.total = res.data.pageinfo.total;
                            this.pages = res.data.pageinfo.pages;
                            this.mode='2';
                        }
                        ).catch(error=>error)
                }else if(val===''){
                    this.get_logs(1);
                    this.mode='0'
                }else{
                    this.system_logs=null;
                }
            },
            //获取科目列表
            get_logs(page) {

                this.listLoading = true;
                NProgress.start();

                get_system_log(page).then((res) => {
                    // 	this.total = res.data.total;
                    // console.log(res);
                    this.system_logs = res.data.pageinfo.list;
                    for (let i in this.system_logs) {
                        // console(1);
                        // console.log(i);
                        this.system_logs[i].createTime = js_date(this.system_logs[i].createTime);
                        this.$set(this.system_logs, i, this.system_logs[i]);

                    }

                    this.pageNum = res.data.pageinfo.pageNum;
                    this.pageSize = res.data.pageinfo.pageSize;
                    this.total = res.data.pageinfo.total;
                    this.pages = res.data.pageinfo.pages;

                    this.listLoading = false;
                    NProgress.done();
                });
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = row.subjectId;
                    dec_subject(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getSubjects();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面

            //翻页
            handleCurrentChange(val) {


                if(this.mode == "0"){
                    this.get_logs(val);

                }else if(this.mode == "1"){
                    this.get_logs_by_date(val);
                }else if(this.mode=='2') {
                    this.get_logs_by_ip(this.targetIP,val);
                }

            },
            edit_date_search(){
                this.display_exit_date =false;
                this.mode = "0";
                this.get_logs(1);


            },

            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {


                let para1 = { ids: this.sels.map(item => item.subjectId) };

                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();

                    batch_remove_subject(para1).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getSubjects();
                    });
                }).catch(() => {

                });
            }
        },
        watch:{
            targetIP:function(val){
                this.get_logs_by_ip(val,1)
            }
        },
        mounted() {
            this.get_logs(1);



        }
    }

</script>

<style scoped="scoped">

</style>