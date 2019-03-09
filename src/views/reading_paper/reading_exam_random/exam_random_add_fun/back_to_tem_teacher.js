back_to_tem_teacher=()=>{
    let item=this.random_paper_list[this.index];
    let stuCuttingId=item.stuCuttings.stuCuttingId;
    let permUserId=item.stuCuttingScorePoint[0].userPermId;
    let stuFragmentIds=[]
    item.stuFragments.forEach(item=>{
        stuFragmentIds.push(item.fragmentId)
    })
    let params={}
    params.stuCuttingId=stuCuttingId;
    params.permUserId=permUserId;
    params.stuFragmentIds=stuFragmentIds;
    back_to_tem_teacher(params).then(res=>{
        console.log(res);
        this.view_problrm_type = false
        this.t_paper_problem='打回卷'
    })
}
export const back_to_tem_teacher