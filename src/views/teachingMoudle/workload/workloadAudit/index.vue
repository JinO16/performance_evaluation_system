<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" highlight-current-row style="width: 100%">
      <el-table-column align="center" label="姓名" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="工号">
        <template slot-scope="scope">
          <span>{{ scope.row.jobID}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="岗位">
        <template slot-scope="scope">
          {{ scope.row.station}}
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="教学工作量合计">
        <template slot-scope="scope">
          <span>{{ scope.row.teachingMoudle.workLoad ? scope.row.teachingMoudle.workLoad.teachWorkSum : 0}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="用于计分的工作量">
        <template slot-scope="scope">
          {{scope.row.teachingMoudle.workLoad ? scope.row.teachingMoudle.workLoad.scoreSum : 0}}
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="个人逐项计分">
        <template slot-scope="scope">
          {{scope.row.teachingMoudle.workLoad ? scope.row.teachingMoudle.workLoad.itemScore : 0}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center" label="状态" width="80">
        <template slot-scope="scope">
          <!-- <el-tag :type="scope.row.finalStatus !== '待审核' ? scope.row.finalStatus : (scope.row.teachingMoudle.teaStatus ? scope.row.teachingMoudle.teaStatus : scope.row.teachingMoudle.workLoad.status) | statusFilter ">
            {{scope.row.finalStatus !== '待审核' ? scope.row.finalStatus : (scope.row.teachingMoudle.teaStatus ? scope.row.teachingMoudle.teaStatus : scope.row.teachingMoudle.workLoad.status)}}
          </el-tag> -->
          <el-tag :type="scope.row.teachingMoudle.workLoad.status | statusFilter">{{scope.row.teachingMoudle.workLoad.status}}</el-tag>
        </template>
      </el-table-column>
       <el-table-column width="100px" align="center" label="总分数">
        <template slot-scope="scope">
          <span>{{ scope.row.teachingMoudle.workLoad ? scope.row.teachingMoudle.workLoad.itemScore : 0 }}</span>
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
            plain
            @click="handleDetail(scope.row)"
          >查看详情</el-button>
        </template>
      </el-table-column>

    </el-table>
     <!-- 审核单弹出框 -->
    <el-dialog el-drag-dialog :visible.sync="dialogTableVisible" :title="dialogTitle">
      <el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="姓名">
          {{form.name}}
        </el-form-item>
        <el-form-item label="工号">
          {{form.jobID}}
        </el-form-item>
        <el-form-item label="岗位">
          {{form.station}}
        </el-form-item>
        <el-form-item label="提交时间">
          {{form.submitTime | formateDate}}
        </el-form-item>
        <el-collapse>
          <el-collapse-item title="工作量数据">
              <div class="collapse-item"><strong>上课教学工作量：</strong>{{form.teachingMoudle ? (form.teachingMoudle.workLoad ? form.teachingMoudle.workLoad.classWork : 0) : 0}}</div>
              <div class="collapse-item"><strong>辅导员带班工作量折算：</strong>{{form.teachingMoudle ? (form.teachingMoudle.workLoad ? form.teachingMoudle.workLoad.instructorWork : 0) : 0}}</div>
              <div class="collapse-item"><strong>实验教学工作量折算：</strong>{{form.teachingMoudle ? (form.teachingMoudle.workLoad ? form.teachingMoudle.workLoad.experimentWork : 0) : 0}}</div>
              <div class="collapse-item" v-if="visibleItem"><strong>折抵教学工作量的科研经费金额：</strong>{{form.teachingMoudle ? (form.teachingMoudle.workLoad ? form.teachingMoudle.workLoad.scienceFunds :0) : 0}}</div>
              <div class="collapse-item" v-if="visibleItem"><strong>科研经费折抵的教学工作量：</strong>{{form.teachingMoudle ? (form.teachingMoudle.workLoad ? form.teachingMoudle.workLoad.scienceFundsWork :0 ) : 0}}</div>
              <div class="collapse-item"><strong>是否完成本部门人均相应工作量的三分之二：</strong>{{form.teachingMoudle ? (form.teachingMoudle.workLoad ? (form.teachingMoudle.workLoad.isFinish ? '是' :'否'):'') : ''}}</div>
              <div class="collapse-item"><strong>教学工作量合计:</strong>{{form.teachingMoudle ? (form.teachingMoudle.workLoad ? form.teachingMoudle.workLoad.teachWorkSum :0) : 0}}</div>
              <div class="collapse-item"><strong>用于计分的工作量：</strong>{{form.teachingMoudle ? (form.teachingMoudle.workLoad ? form.teachingMoudle.workLoad.scoreSum : 0 ) : 0}}</div>
              <div class="collapse-item"><strong>个人逐项计分：</strong>{{form.teachingMoudle ? (form.teachingMoudle.workLoad ? 28 * form.teachingMoudle.workLoad.scoreSum / stationBase  : 0) : 0}}</div>
          </el-collapse-item>
          <el-collapse-item title="审核记录">
            <div v-for="(item,key) in form.finalAuditRecord">
              <span class="collapse-item"><strong>审核人：</strong>{{item.auditPerson}}</span>
              <span class="collapse-item"><strong>审核时间：</strong>{{item.auditTime | formateDate}}</span>
              <span class="collapse-item"><strong>审核状态：</strong>{{item.auditStatus}}</span>
              <span class="collapse-item"><strong>审核理由：</strong>{{item.auditReason}}</span>
            </div>
            <div v-for="(item,key) in form.teachingMoudle ? form.teachingMoudle.teaMoudelAuditRecord : []">
                <span class="data-items">审核人: {{item.auditPerson ? item.auditPerson :'暂无'}}</span>
                <span class="data-items">审核时间: {{item.auditTime ? item.auditTime : 0 | formateDate}}</span>
                <span class="data-items">状态: {{item.auditStatus ? item.auditStatus : '待审核'}}</span>
                <span class="data-items">审核理由: {{item.auditReason ? item.auditReason : '暂无'}}</span>
            </div>
            <div v-for="(item,key) in form.teachingMoudle ? (form.teachingMoudle.workLoad ? form.teachingMoudle.workLoad.auditRecord : []) :[]">
              <span class="data-items">审核人: {{item.auditPerson ? item.auditPerson :'暂无'}}</span>
              <span class="data-items">审核时间: {{item.auditTime ? item.auditTime : 0 | formateDate}}</span>
              <span class="data-items">状态: {{item.auditStatus ? item.auditStatus : '待审核'}}</span>
              <span class="data-items">审核理由: {{item.auditReason ? item.auditReason : '暂无'}}</span>
            </div>           
          </el-collapse-item>
        </el-collapse>     
        <div class="audit-block" v-if="dialogTitle == '审核单'">
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
import router from '../../../../router'
import dayjs from 'dayjs'
import { getAllTeachWorkload, updateTeachWorkload } from '@/api/teachingAndRes/teachWorkload'
import { getAllLevel } from '@/api/setting'
export default {
  name: 'InlineEditTable',
  inject: ['reload'],
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
      dialogTableVisible:false,
      failedReason:'',//审核不通过理由
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      stationBase:350,//不同岗位对应算法的基数不同
      visibleItem: false,//当岗位为非科研岗时隐藏的项
      failedReason:'',//审核不通过理由
      showReason:false,//显示审核理由输入框
      form: {},
      dialogTitle:'',
      dialogTitleItem: {
        audit:'审核单',
        detail:'查看详情'
      }
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    //获取所有级别岗位要求的接口
    getStationInfo(value) {
      console.log('value :>> ', value);
      const userStation = value.station;
      // console.log('userStation :>> ', userStation);
      getAllLevel().then(res => {
        console.log('res :>> ', res);
        if (res.code == 200) {
          switch (userStation) {
            case '教学岗' : 
              this.stationBase = res.result[0].teaching.teachWork;
              break;
            case '科研岗' :
              this.stationBase = res.result[0].science.teachWork;
              this.visibleItem = true;
              break;
            case '教学科研并重岗' :
              this.stationBase = res.result[0].teachAndScience.teachWork;
              break;
            default:
              this.$router.push('/user')
          }
          console.log('this.stationBase :>> ', this.stationBase);
        }
        
      })
    },
    //获取所有工作量数据清单
    getList() {
      getAllTeachWorkload().then(res => {
        console.log('res-------- :>> ', res);
        if (res.code === 200) {
          const resultArr = [];
          for (let i of res.result) {
            if (i.teachingMoudle.workLoad) {
              resultArr.unshift(i)
            }
          }
          this.list = resultArr;
          this.listLoading = false;
        } else {
          this.$message({
            type:'error',
            message:res.message
          })
        }
      })
    },
    //查看详情
    handleDetail(row) {
      console.log('row :>> ', row);
      this.dialogTableVisible = true;
      this.dialogTitle = this.dialogTitleItem.detail;
      this.form = row;
    },
    //审核
    handleAudit(row) {
      console.log('row :', row);
      if (row.teachingMoudle.workLoad.status == '待审核') {
        this.form = row;
        this.dialogTableVisible = true;
        this.dialogTitle = this.dialogTitleItem.audit;
        this.getStationInfo(row)  
      } else {
        this.$message({
          type:'warning',
          message:'该状态下无法重新审核！'
        })
      }
    },
    //审核提交接口
    handleSubmit (params) {
        this.form.teachingMoudle.workLoad.auditRecord.unshift(params);
        this.form.teachingMoudle.workLoad.status = params.auditStatus;
        console.log('this.form :>> ', this.form);
        updateTeachWorkload(this.form).then(res => {
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
        auditReason:'工作量模块审核通过！',
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
        const params = {
          auditPerson:this.$store.state.user.name,
          auditReason:this.failedReason,
          auditStatus:'驳回',
          auditTime:new Date()
        }
        this.handleSubmit(params);
      }
    }
  }
}
</script>

<style scoped>
.audit-block {
  margin-top: 20px;
}
</style>
