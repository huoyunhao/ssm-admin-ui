export const get_add_data = (res) => {
    let add_data = {
        cutingMergeId: '',
        examId: '',
        tStuFragmentId: '',
        userPermId: '',
        score: ''
    }
    add_data.cutingMergeId = res.data.msg[0].cutingMergeId;
    add_data.tStuFragmentId = res.data.msg[0].cuttingList[0].fragmentId;
    add_data.userPermId = res.data.msg[0].userPermId;
    add_data.score = res.data.msg[0].cuttingList[0].score;
    return add_data;




}
// 获取公共数据