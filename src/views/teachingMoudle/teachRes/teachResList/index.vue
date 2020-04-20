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
            <el-form-item label="教学质量:">
              <span class="data-items">备注: {{"添加备注"}}</span>
              <span class="data-items">附件: <a style="color:blue"href="#">查看附件</a></span>
              <span class="data-items">个人逐项计分: {{45}}</span>
            </el-form-item>
             <el-form-item label="教学论文:">
              <span class="data-items">备注: {{"添加备注"}}</span>
              <span class="data-items">附件: <a style="color:blue"href="#">查看附件</a></span>
              <span class="data-items">个人逐项计分: {{45}}</span>
            </el-form-item>
             <el-form-item label="教研项目:">
              <span class="data-items">备注: {{"添加备注"}}</span>
              <span class="data-items">附件: <a style="color:blue"href="#">查看附件</a></span>
              <span class="data-items">个人逐项计分: {{45}}</span>
            </el-form-item>
             <el-form-item label="教研成果奖励:">
              <span class="data-items">备注: {{"添加备注"}}</span>
              <span class="data-items">附件: <a style="color:blue"href="#">查看附件</a></span>
              <span class="data-items">个人逐项计分: {{45}}</span>
             </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" align="center" label="提交时间">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
       <el-table-column width="90px" align="center" label="审核人">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
       <el-table-column width="140px" align="center" label="审核时间">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column width="90px" align="center" label="总分">
        <template slot-scope="scope">
          <span>{{ scope.row.sum }}</span>
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
    <el-dialog v-el-drag-dialog :visible.sync="dialogTableVisible" title="创建工作量数据单" @dragDialog="handleDrag">
      <el-form ref="form" :model="form">
        <el-button class="addItem" type="primary" size="small" plain @click="addItem" >添加教学质量项</el-button>
        <div class="label-items">教学质量</div>
        <div v-for="(item,key) in form.teachQuality">
          <i class="el-icon-error delete-item" @click="deleteItem"></i>
          <el-form-item label="备注">             
            <el-input v-model="item.refers" placeholder="请填写备注信息" />  
          </el-form-item>
          <el-form-item label="上传附件">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="item.files">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">Tips:上传文件最多为3个，且每一个大小不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="个人逐项计分">         
            <el-input v-model="item.weight" />  
          </el-form-item>
          
        </div>
        <div class="label-items">教学论文</div>
        <div v-for="(item,key) in form.teachPaper">
          <el-form-item label="备注">             
            <el-input v-model="item.refers" placeholder="请填写备注信息" />  
          </el-form-item>
          <el-form-item label="上传附件">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="item.files">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">Tips:上传文件最多为3个，且每一个大小不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="个人逐项计分">         
            <el-input v-model="item.weight" />  
          </el-form-item>
        </div>
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
      fileList: [
        ],
      
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      form: {
        //教学质量
        teachQuality:[
          {
            refers:'qqq',
            files:[
              {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
              {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
            ],
            weight:1,
          }
        ],
        //教学论文
        teachPaper:[
          {
            refers:'',
            files:[
              {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
              {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
            ],
            weight:1,
            }
        ],
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
    },
    //添加项目
    addItem() {
      console.log('添加')
    },
     //删除一个项
    deleteItem() {
      console.log('删除项---》')
    },
    //上传文件相关方法
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
   
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
.addItem {
  float:right
}
.el-icon-error.delete-item {
  /* position: absolute;
  right: 22px; */
}
/* .el-icon-error:hover {
  cursor: pointer;
} */
</style>
