<template>

  <div class="app-container">

    <div class="header">

      <el-button

        size="medium"

        type="primary"

        style="margin-bottom:10px"

        @click="handleCreate"

      >创建数据单</el-button>

    </div>

    <el-table v-loading="listLoading" :data="list"  fit highlight-current-row style="width: 100%">

      <!-- 展开或隐藏的内容 -->

      <el-table-column type="expand">

        <template slot-scope="scope" > 

          <el-form label-position="left" inline class="demo-table-expand">

            <el-form-item label="年额定科研经费金额:">

              <span class="data-items">权重: {{scope.row.forecast}}</span>

              <span class="data-items">数据: {{90}}</span>

              <span class="data-items">总分: {{45}}</span>

            </el-form-item>

             <el-form-item label="年科研经费实际到账金额:">

              <span class="data-items">权重: {{scope.row.forecast}}</span>

              <span class="data-items">数据: {{90}}</span>

              <span class="data-items">总分: {{45}}</span>

            </el-form-item>

             <el-form-item label="折抵科研经费的教学工作量:">

              <span class="data-items">权重: {{scope.row.forecast}}</span>

              <span class="data-items">数据: {{90}}</span>

              <span class="data-items">总分: {{45}}</span>

            </el-form-item>

             <el-form-item label="折抵科研经费的教学工作量对应科研经费金额:">

              <span class="data-items">{{90}}</span>

             </el-form-item>

             <!-- <el-form-item label="折抵后科研经费完成金额:">

              <span class="data-items">权重: {{scope.row.forecast}}</span>

              <span class="data-items">数据: {{90}}</span>

              <span class="data-items">总分: {{45}}</span>

             </el-form-item> -->

             <el-form-item label="折抵科研经费的教学工作量上限:">

              <span class="data-items">{{"是"}}</span>

             </el-form-item>

             <el-form-item label="折抵后科研经费完成金额:">

              <span class="data-items">{{45}}</span>

             </el-form-item>

             <el-form-item label="科研经费完成比例:">

              <span class="data-items">{{45}}</span>

             </el-form-item>

          </el-form>

        </template>

      </el-table-column>

      <!-- 表格信息开始 -->

      <el-table-column align="center" label="序号" width="60">

        <template slot-scope="scope">

          <span>{{ scope.row.id }}</span>

        </template>

      </el-table-column>

      <el-table-column width="125px" align="center" label="提交时间">

        <template slot-scope="scope">

          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>

        </template>

      </el-table-column>

      <el-table-column width="120px" label="年额定科研经费金额">

        <template slot-scope="scope">

          {{sum}}

        </template>

      </el-table-column>

      <el-table-column width="135px" label="年科研经费实际到账金额">

        <template slot-scope="scope">

          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon"/>

        </template>

      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="80">

        <template slot-scope="scope">

          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>

        </template>

      </el-table-column>

      <el-table-column width="70px" align="center" label="审核人">

        <template slot-scope="scope">

          <span>{{ scope.row.author }}</span>

        </template>

      </el-table-column>

      <el-table-column width="125px" align="center" label="审核时间">

        <template slot-scope="scope">

          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>

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

            @click="handleUpdate(scope.row)"

          >修改</el-button>

          <el-button

            size="mini"

            type="danger"

            @click="handleDelete(scope.row)"

          >删除</el-button>

        </template>

      </el-table-column>



    </el-table>

    <!-- 创建数据单弹出框 -->

    <el-dialog v-el-drag-dialog :visible.sync="dialogTableVisible" title="创建科研经费数据单" @dragDialog="handleDrag">

      <el-form ref="form" :model="form">

        <div class="label-items">额定研经费金额</div>

        <el-row>

          <el-col :span="8">

              <el-form-item label="权重">             

                    {{form.weight}}

              </el-form-item>

            </el-col>

            <el-col :span="8">

              <el-form-item label="数据">

                  <el-input v-model="form.desc" />

              </el-form-item>

            </el-col>

            <!-- <span class="data-items">数据：</span> <el-input v-model="form.name" /> -->

            <el-col :span="8">

              <el-form-item label="总分">         

                    {{form.weight}}

              </el-form-item>

            </el-col>

        </el-row>

        <div class="label-items">实际到账科研经费金额</div>

        <el-row>

          <el-col :span="8">

              <el-form-item label="权重">             

                    {{form.weight}}

              </el-form-item>

            </el-col>

            <el-col :span="8">

              <el-form-item label="数据">

                  <el-input v-model="form.desc" />

              </el-form-item>

            </el-col>

            <el-col :span="8">

            <el-form-item label="总分">         

                  {{form.weight}}

            </el-form-item>

          </el-col>

        </el-row>

        <div class="label-items">折抵科研经费的教学工作量</div>

        <el-row>

          <el-col :span="8">

              <el-form-item label="权重">             

                    {{form.weight}}

              </el-form-item>

            </el-col>

            <el-col :span="8">

              <el-form-item label="数据">

                  <el-input v-model="form.desc" />

              </el-form-item>

            </el-col>

            <!-- <span class="data-items">数据：</span> <el-input v-model="form.name" /> -->

            <el-col :span="8">

              <el-form-item label="总分">         

                    {{form.weight}}

              </el-form-item>

            </el-col>

        </el-row>

        <div class="label-items">折抵科研经费的教学工作量对应科研经费金额</div>

        <el-form-item label="金额">

            <el-input v-model="form.desc" />

        </el-form-item>

        <div class="label-items">折抵后科研经费完成金额</div>

        <el-row>

          <el-col :span="8">

              <el-form-item label="权重">             

                    {{form.weight}}

              </el-form-item>

            </el-col>

            <el-col :span="8">

              <el-form-item label="数据">

                  <el-input v-model="form.desc" />

              </el-form-item>

            </el-col>

            <!-- <span class="data-items">数据：</span> <el-input v-model="form.name" /> -->

            <el-col :span="8">

              <el-form-item label="总分">         

                    {{form.weight}}

              </el-form-item>

            </el-col>

        </el-row>

        <el-form-item label="折抵科研经费的教学工作量上限40%">

          <el-switch v-model="form.delivery" />

        </el-form-item>

        <el-form-item label="折抵后科研经费完成金额">

          {{100}}

        </el-form-item>

        <el-form-item label="科研经费完成比例">

          {{100}}

        </el-form-item>

        <el-form-item align="center">

          <el-button type="primary" @click="handleSubmit">提交</el-button>

           <el-button type="success" @click="handleSave">保存</el-button>

          <el-button @click="handleCancel">取消</el-button>

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

      dialogTableVisible: false,

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

          author: "张丹丹",

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

    //创建新数据

    handleCreate() {

      this.dialogTableVisible = true

      console.log('创建新数据 :');

      // this.$router.push('createList')

    },

     // v-el-drag-dialog onDrag callback function

    handleDrag() {

      this.$refs.select.blur()

    },

    //修改

    handleUpdate(row) {

      console.log('row :', row);

    },

    //删除

    handleDelete(row) {

      console.log('row :', row);

    },

     handleSubmit() {

      this.$message('submit!')

    },

    //暂存

    handleSave() {

      //暂存数据

    },

    handleCancel() {

      this.$message({

        message: 'cancel!',

        type: 'warning'

      })

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

</style>