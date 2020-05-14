<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" highlight-current-row style="width: 100%">
      <el-table-column width="80px" align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="工号">
        <template slot-scope="scope">
          <span>{{ scope.row.jobID}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="岗位">
        <template slot-scope="scope">
          <span>{{ scope.row.station }}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="科研论文总分" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.sciPapers.sum }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center" label="状态" width="80px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.auditRecord[0]? scope.row.auditRecord[0].auditStatus :'待审核'| statusFilter">{{ scope.row.auditRecord[0]? scope.row.auditRecord[0].auditStatus : '待审核'}}</el-tag>
        </template>
      </el-table-column>
       <el-table-column width="100px" align="center" label="总分数">
        <template slot-scope="scope">
          <span>{{scope.row.sciPapers.sum}}</span>
        </template>
      </el-table-column>
       <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleAudit(scope.row)"
          >审核</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 审核单弹窗 -->
    <el-dialog el-drag-dialog :visible.sync="dialogTableVisible" title="科研论文审核单">
      <el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="form.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="form.jobID" disabled></el-input>
        </el-form-item>
        <el-form-item label="岗位">
          <el-input v-model="form.station" disabled></el-input>
        </el-form-item>
        <el-form-item label="提交时间">
          <el-input v-model="form.submitTime" disabled></el-input>
        </el-form-item>
        <el-collapse>

             <el-collapse-item title="科研论文">
              <div v-for="(item,key) in form.sciPapers ? form.sciPapers.item : []">
                <span class="collapse-item"><strong>论文类型: </strong>{{item.type[0]}}</span>
                <span class="collapse-item"><strong>个人逐项计分：</strong>{{item.type[1]}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0]?item.uploadFiles[0].originalname : ''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.sciPapers ? form.sciPapers.sum : 0}}</span>
            </el-collapse-item>
            <el-collapse-item title="审核记录">
              <div v-for="(item,key) in form.auditRecord">
                <span class="collapse-item"><strong>审核人：</strong>{{item.auditPerson}}</span>
                <span class="collapse-item"><strong>审核时间：</strong>{{item.auditTime | formateDate}}</span>
                <span class="collapse-item"><strong>审核状态：</strong>{{item.auditStatus}}</span>
                <span class="collapse-item"><strong>审核理由：</strong>{{item.auditReason}}</span>
              </div>
            </el-collapse-item>
        </el-collapse>
        <div class="audit-block">
          <!-- 审核理由 -->
          <el-form-item label="不通过理由(必填)" v-if="showReason" required>
            <el-input type="textarea" :rows="2" placeholder="请输入审核理由" v-model="failedReason"></el-input>
          </el-form-item>
          <el-form-item style="display:flex;justify-content:center">
            <el-button type="primary" @click="handlePass">审核通过</el-button>
            <el-button type="danger" @click="handleFailed">审核不通过</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getAllSciPapers, updateSciPapers } from '@/api/scienceAndRes/sciPapers'
import { getToken } from '../../../../utils/auth'
export default {
  inject:["reload"],
  filters: {
    statusFilter(status) {
      const statusMap = {
        "已完成": 'success',
        "draft": 'info',
        "驳回": 'danger',
        '审核中': 'warning'
      }
      return statusMap[status]
    },
     //格式化时间
    formateDate(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm')
    }
  },
  data() {
    return {
      listLoading: true,
      dialogTableVisible: false,
      list: [],//表格数据--所有的该模块数据单
      form:{},//审核单内详情数据
      failedReason:'',//审核不通过理由
      showReason:false,//显示审核理由输入框
    }
  },
  mounted() {
    this.getAllData()
  },
  methods: {
    //获取表格数据
    getAllData() {
      getAllSciPapers().then(res => {
        if (res.code === 200) {
          this.list = res.result;
          this.listLoading = false;
        }
      }) 
    },
    //审核
    handleAudit(value) {
      this.dialogTableVisible = true;
      this.form = value;
    },
    //审核提交接口调用
    handleSubmit(params) {
      this.form.auditRecord.unshift(params);
      updateSciPapers(this.form).then(res => {
        console.log('res :>> ', res);
        if (res.code === 200) {
          this.$message({
            type:'success',
            message:'提交审核成功！'
          })
          this.dialogTableVisible = false;
          this.reload();
        } else {
          this.$message({
            type:'error',
            message:res.message
          })
        }
      })
    },
     //审核通过
    handlePass() {
      this.showReason = false;
      const params = {
        auditPerson:this.$store.state.user.name,
        auditReason:this.failedReason,
        auditStatus:'审核中',
        auditTime:new Date()
      }
     this.handleSubmit(params);
    },
    //审核不通过
    handleFailed() {
      this.showReason = true;
      //审核不通过弹出文本框,必填
     if (!this.failedReason) {
       this.$message({
         type:'error',
         message:'请填写不通过理由！'
       })
     } else {
      //  console.log('审核不通过的this.form :>> ', this.form);
       const params = {
        auditPerson:this.$store.state.user.name,
        auditReason:this.failedReason,
        auditStatus:'驳回',
        auditTime:new Date()
      }
      this.handleSubmit(params);
     }
    },
    //删除
    handleDelete(value) {
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.list.splice(value,1);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch((err) => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
      }); 
      this.getAllData();
    },
     //下载文件
    handleDownload(item) {
     const fileId = item.uploadFiles[0].filename;
      let xhr = new XMLHttpRequest();
        xhr.open('GET',`http://127.0.0.1:3000/downLoad?fileId=${fileId}`);
        xhr.onload = function (a,b) {
          let blob = this.response;
          let reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = function(e) {
            let a = document.getElementById('fileDown');
            a.download = item.uploadFiles[0].originalname;
            a.href = e.target.result;
            a.click()
          }
      }
      xhr.responseType = 'blob';
      xhr.setRequestHeader('token',getToken())
      xhr.send();
    },
  }
}
</script>

<style scoped>
.collapse-item {
  font-weight: 400;
  margin-right: 20px;
}
.audit-block {
  margin-top: 20px;
}
</style>