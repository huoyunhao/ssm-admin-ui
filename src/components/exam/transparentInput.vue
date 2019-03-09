<template>
    <input id="score_input" placeholder="按enter键确定" :value="score" style="BACKGROUND-COLOR: transparent;width:80px;height:30px"/>
</template>
<script>
export default {
    props:{
        x:{
            type:Number,
            default:0
        },
        y:{
            type:Number,
            default:0
        },
    },
    data(){
        return{
            score:0
        }
    },
    methods:{
        
    },
    mounted(){
        let that=this;
        document.onkeydown=(e)=>{
            let ev = e || window.event;//获取event对象
			console.log(e.keyCode)
            let code=e.keyCode;
            if(code>=48&&code<=57){
                document.querySelector('input').value+=String.fromCharCode(code);
            }else if(code==13){
				console.log(document.querySelector('input').value)
                
            }else if(code==8){
				document.querySelector('input').value=document.querySelector('input').value.substring(0,document.querySelector('input').value.length-1)
			}
        }
    }
}
</script>
<style lang="less" scoped="scoped">
*{
    font-size: 20px;
    color: red;
    
}
</style>
