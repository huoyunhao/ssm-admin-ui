<template>
    <el-form  label-width="80px" @submit.prevent="onSubmit"
             style="" label-position="left">
        <el-form-item label="科目">
            <el-table :data="subjects" highlight-current-row @selection-change="selsChange"
                      style="width: 100%;">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column type="index" width="60">
                </el-table-column>

                <el-table-column prop="subjectName" label="科目名称" width="100" sortable>
                </el-table-column>
                <el-table-column label="科目总分" width="100" sortable>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.examScore"/>
                    </template>
                </el-table-column>
                <el-table-column label="考试学生表" width="270" sortable>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.examStuInfo" multiple placeholder="请先导入考生" style="width: 200px">
                            <el-option
                                    v-for="ite in fileList"
                                    :key="ite.url"
                                    :label="ite.name"
                                    :value="ite.url">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="考试开始时间" width="300" sortable>
                    <template slot-scope="scope">
                        <el-date-picker
                                v-model="scope.row.examStartTime"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column label="考试结束时间" width="300" sortable>
                    <template slot-scope="scope">
                        <el-date-picker
                                v-model="scope.row.examEndTime"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </template>
                </el-table-column>

            </el-table>
        </el-form-item>
        <el-form-item label="">
            <el-button type="primary">添加</el-button>
        </el-form-item>


    </el-form>



</template>

<script>
    import { get_subjects_list} from '../../api/api'
    export default {
        name: "add_subject",
        data() {
            return {
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                subjects:[],
                sels:[]
            }
        },
        props: {
            exam_id: {
                type: String,
                required: false
            },

        },
        methods:{
            get_uuid(){
                var d = new Date().getTime();
                var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = (d + Math.random()*16)%16 | 0;
                    d = Math.floor(d/16);
                    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
                });
                return uuid;
            },
            selsChange: function (sels) {
                this.sels = sels;
            },

        },
        mounted(){
            get_subjects_list().then((res) =>{
                this.subjects = res.data.subject;

            });
        }
    }
</script>

<style scoped>

</style>