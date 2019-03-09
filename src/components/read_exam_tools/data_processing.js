// 获取试卷列表
export const get_paper_list = (list) => {
    let paper_list = [];

    for (let i in list) {

        let temp = list[i]
        let para = {
            stuId: temp.stuFragments[0].stuId,
            state: temp.stuCuttings.teacherJudgeStatus == null ? '0' : temp.stuCuttings.teacherJudgeStatus,
            score: temp.stuCuttings.stuCuttingTotalScore == null ? '0' : temp.stuCuttings.stuCuttingTotalScore,
            index: '',
            un_state: temp.stuCuttings.teacherJudgeStatus == null ? '0' : temp.stuCuttings.teacherJudgeStatus,
            fragment_info: [],
            url: [],
            stuCuttingId: temp.stuCuttings.stuCuttingId == null ? '' : temp.stuCuttings.stuCuttingId,
            stuCuttingError: temp.stuCuttings.stuCuttingError,
            stuCuttingGreat: temp.stuCuttings.stuCuttingGreat,
            stuCuttingSign: temp.stuCuttings.stuCuttingSign,
            num: Number(i)+1,
            point_score:[]


        }

        for(let i1 in temp.stuFragments){
            para.url.push(temp.stuFragments[i1].imgUrl);
            para.fragment_info.push({
                "tStuFragmentId": temp.stuFragments[i1].tStuFragmentId,
                "fragmentId": temp.stuFragments[i1].fragmentId

            })
        }
        for(let i2 in temp.stuCuttingScorePoint){
            para.point_score.push(temp.stuCuttingScorePoint[i2])

        }
        paper_list.push(para);





    }
    return paper_list;


}

// 获取公共数据
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
    add_data.examId = res.data.examId;
    return add_data;




}
