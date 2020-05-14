<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" highlight-current-row style="width: 100%">
    </el-table>
  </div>
</template>

<script>
import { getAllTeachWorkload } from '@/api/teachingAndRes/teachWorkload';
export default {
 data() {
   return {
     list:[],//表格中数据
     listLoading:true,
   }
 },
 mounted() {
   this.getAllWorkload();
 },
 methods:{
   //获取所有工作量数据单
   getAllWorkload() {
     getAllTeachWorkload().then(res => {
       console.log('res :>> ', res);
       this.listLoading = false;
     })
   }

 }
}
</script>

<style>

</style>