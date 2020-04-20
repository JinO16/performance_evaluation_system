<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="教师姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="部门">
        <template slot-scope="scope">
          {{sum}}
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="职称">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="工资号">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon"/>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
       <el-table-column width="100px" align="center" label="总分数">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
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
            @click="handleSubmit(scope.row)"
          >审核</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>

    </el-table>
     <!-- 审核单弹出框 -->
    <el-dialog v-el-drag-dialog :visible.sync="dialogTableVisible" title="工作量审核单" @dragDialog="handleDrag">
      <el-form ref="form" :model="form">
        <el-row>
          <el-col :span="8">
              <el-form-item label="姓名">             
                    {{"form.name"}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="部门">
                  {{"部门"}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="学位">         
                    {{"form.weight"}}
              </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
              <el-form-item label="职称">             
                    {{"职称"}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工资号">
                  {{"工资号"}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态">         
                    {{"状态"}}
              </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
              <el-form-item label="审核人">             
                    {{"审核人"}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="审核时间">
                  {{"审核时间"}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="审核理由">         
                    {{"审核理由"}}
              </el-form-item>
            </el-col>
        </el-row>
        <el-collapse  @change="handleChange">
          <el-row>
            <el-col :span="8">
              <el-collapse-item title="上课教学工作量">
               <div><span class="item">权重：</span>{{'权重'}}</div>
               <div><span class="item">数据：</span>{{'数据'}}</div>
               <div><span class="item">总分：</span>{{'总分'}}</div>
              </el-collapse-item>
            </el-col>
            <el-col :span="8">
              <el-collapse-item title="辅导员带班工作量">
                <div><span class="item">权重：</span>{{'权重'}}</div>
                <div><span class="item">数据：</span>{{'数据'}}</div>
                <div><span class="item">总分：</span>{{'总分'}}</div>
              </el-collapse-item>
            </el-col>
            <el-col :span="8">
              <el-collapse-item title="实验教学工作量">
                <div><span class="item">权重：</span>{{'权重'}}</div>
                <div><span class="item">数据：</span>{{'数据'}}</div>
                <div><span class="item">总分：</span>{{'总分'}}</div>
              </el-collapse-item>
            </el-col>
          </el-row>
        </el-collapse>
        <el-row>
          <el-col :span="12">
              <el-form-item label="折抵教学工作量的科研经费金额">             
                    {{100}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="完成本部门人均工作量的三分之一">
                {{'是'}}
              </el-form-item>
            </el-col>
        </el-row>
         <el-row>
          <el-col :span="8">
            <el-form-item label="教学工作量合计">
              {{100}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用于计分的工作量">
              {{100}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总分">
              {{100}}
            </el-form-item>
          </el-col>
        </el-row>
         <!-- 审核理由 -->
        <el-form-item label="不通过理由(必填)" v-show="showReason">
          <el-input type="textarea" :rows="2" placeholder="请输入审核理由" v-model="failedReason"></el-input>
        </el-form-item>
        <el-form-item align="center">
          <el-button type="primary" @click="handlePass">审核通过</el-button>
          <el-button type="danger" @click="handleFailed">审核不通过</el-button>
        </el-form-item>
      </el-form> 
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import router from '../../../../router'

export default {
  name: 'InlineEditTable',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      dialogTableVisible:false,
      failedReason:'',//审核不通过理由
      showReason:false,//显示审核理由输入框
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      form: {
      name: '',
      weight: 4.55,
      date1: '',
      date2: '',
      delivery: false,
      type: [],
      resource: '',
      desc: ''
    }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.list = [
        { 
          id: 1,
          timestamp: 622708727027,
          author: "Deborah",
          reviewer: "Ronald",
          title: "Wfeevmqwub Mfvfxt Strkoggg Bdur Wfhjx Aiqd Dnwvju Uhxqh Pxsyd",
          content_short: "我是测试数据",
          forecast: 7.17,
          importance: 2,
          type: "US",
          status: "draft",
          display_time: "1988-01-05 04:26:31",
          comment_disabled: true,
          pageviews: 3518,
          image_uri: "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3"
        },
         { 
          id: 2,
          timestamp: 622708727027,
          author: "Deborah",
          reviewer: "Ronald",
          title: "Wfeevmqwub Mfvfxt Strkoggg Bdur Wfhjx Aiqd Dnwvju Uhxqh Pxsyd",
          content_short: "我是测试数据",
          forecast: 6.66,
          importance: 2,
          type: "US",
          status: "draft",
          display_time: "1988-01-05 04:26:31",
          comment_disabled: true,
          pageviews: 3518,
          image_uri: "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3"
        }
      ];
       this.listLoading = false
      // fetchList(this.listQuery).then(response => {
      //   const items = response.data.items
      //   console.log('items--->',items)
      //   this.list = items.map(v => {
      //     this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
      //     v.originalTitle = v.title //  will be used when user click the cancel botton
      //     return v
      //   })
      //   this.listLoading = false
      // })
    },
     // v-el-drag-dialog onDrag callback function
    handleDrag() {
      this.$refs.select.blur()
    },
    //审核
    handleSubmit(row) {
      console.log('row :', row);
      this.dialogTableVisible = true;
    },
    //删除
    handleDelete(row) {
      console.log('row :', row);
    },
    //审核通过
    handlePass() {
      this.showReason = false;
    },
    //审核不通过
    handleFailed() {
      this.showReason = true;
      //审核不通过弹出文本框,必填
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.data-items {
  margin: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #909399;
}
.el-col {
  border-radius: 4px;
}
.el-row {
  margin-left: 14px;
}
.label-items {
  border-bottom: 1px solid #606266;
  padding: 10px;
  margin-bottom: 10px;
  color: #606266;
  font-weight: 700;
  font-size: 16px;
}
.el-input {
  width: auto;
  position: absolute;
  margin-right: 10px;
}
.item {
  font-size: 14px;
  font-weight: 700;
}
</style>
