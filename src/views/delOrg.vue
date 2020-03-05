<template>
    <div class="wrap-div">
       
             <img src="../assets/images/delete.png"> 
    </div>
</template>

<script>
import { orgInfo , updateOrg, delOrg,getAllTransfer,postTransfer} from '../axios/api'
export default {
    name: "enterpriseInformation",
    data () {
        return {
           
        }
    },
    mounted(){
        
    },
    methods:{
       
    },
    created() {
        
    },
}
</script>

<style scoped lang="less">
       
        .wrap-div{
           
            width: 260px;
            height: 300px;
            position: absolute;
            left:50%;
            top:50%;
            margin-left: -130px;

            

           img{
               display: block;
               width: 100%;
              
             
              
                
           }
        }

</style>