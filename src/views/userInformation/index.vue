<template>
  <div id="app">
    <div class="page-header">
    <el-page-header title="返回" @back="goBack" content="个人信息页面">
    </el-page-header>
    </div>
    <div class="page-content">
        <el-row>
            <div class="row-item" >
                <el-col :span="2">
                    <span class="data-item">姓名:</span>
                </el-col>
                <el-col :span="6">
                    <el-input
                        placeholder="请输入姓名"
                        v-model="form.name"
                        clearable
                        >
                    </el-input>
                </el-col>
            </div>
            <div class="row-item" >
                <el-col :span="2">
                    <span class="data-item">工号:</span>
                </el-col>
                <el-col :span="6"> 
                    <el-input
                    v-model="form.jobID"
                    disabled
                    >
                    </el-input>
                </el-col>
            </div>
            <div class="row-item" >
                <el-col :span="2">
                    <span class="data-item">职称:</span>
                </el-col>
                <el-col :span="6"> 
                    <el-input
                    v-model="form.profession"
                    >
                    </el-input>
                </el-col>
            </div>
        </el-row>
        <el-row>
            <div class="row-item" >
                <el-col :span="2">
                    <span class="data-item">部门:</span>
                </el-col>
                <el-col :span="6">
                    <el-input
                        placeholder="请输入部门"
                        v-model="form.department"
                        clearable
                        >
                    </el-input>
                </el-col>
            </div>
            <div class="row-item" >
                <el-col :span="2">
                    <span class="data-item">学位:</span>
                </el-col>
                <el-col :span="6"> 
                    <el-input
                    v-model="form.degree"
                    >
                    </el-input>
                </el-col>
            </div>
            <div class="row-item" >
                <el-col :span="2">
                    <span class="data-item">工资号:</span>
                </el-col>
                <el-col :span="6"> 
                    <el-input
                    v-model="form.salaryID"
                    >
                    </el-input>
                </el-col>
            </div>
        </el-row>
        <el-row>
            <div class="row-item" >
                <el-col :span="2">
                    <span class="data-item">手机号:</span>
                </el-col>
                <el-col :span="6">
                    <el-input
                        placeholder="请输入手机号"
                        v-model="form.phone"
                        clearable
                        >
                    </el-input>
                </el-col>
            </div>
            <div class="row-item" >
                <el-col :span="2">
                    <span class="data-item">邮箱:</span>
                </el-col>
                <el-col :span="6"> 
                    <el-input
                    v-model="form.email"
                    placeholder="请输入邮箱"
                    clearable
                    >
                    </el-input>
                </el-col>
            </div>
             <div class="row-item" >
                <el-col :span="2">
                    <span class="data-item">角色:</span>
                </el-col>
                <el-col :span="6">
                    <el-input
                        v-model="form.role"
                        disabled
                        >
                    </el-input>
                </el-col>
            </div>
        </el-row>
        <el-row>    
            <div class="row-item" >
                <el-col :span="2">
                    <span class="data-item">级别:</span>
                </el-col>
                <el-col :span="6"> 
                    <el-select v-model="form.level" placeholder="请选择级别">
                    <el-option
                    v-for="item in level_options"
                    :key="item._id"
                    :label="item.name"
                    :value="item.name">
                    <!-- {{item._id}} -->
                    </el-option>
                    </el-select>
                </el-col>
            </div>
            <div class="row-item" >
                <el-col :span="2">
                    <span class="data-item">岗位:</span>
                </el-col>
                <el-col :span="6"> 
                    <el-select v-model="form.station" placeholder="请选择岗位">
                    <el-option
                    v-for="item in station_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                    </el-select>
                </el-col>
            </div>
        </el-row>
    </div>
    <div class="page-footer">
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button type="success" @click="handleReset">重置</el-button>
    </div>
  </div>
</template>

<script>
import {createUser} from '@/api/user';
import {getAllLevel} from '@/api/setting';
export default {
    data() {
        return {
            form:{
                name:'',//姓名
                role:'',//角色
                jobID:'',//工号
                department:'',//部门
                degree:'',//学位
                profession:'',//职称
                salaryID:'',//工资号
                phone:'',//手机号
                email:'',//邮箱
                level:'',//级别
                station:'',//岗位
                password: '',//密码（用户重设的密码，值提交最新密码即可）
            },
            level_options:[],//级别
                station_options:[{
                    value:'01',
                    label:'教学岗'
                },{
                    value:'02',
                    label:'科研岗'
                },{
                    value:'03',
                    label:'教学科研并重岗'
                }],
                Institute_options:[{
                    value:'00',
                    label:'普通用户'
                },{
                    value:'01',
                    label:'教学办公室'
                },{
                    value:'02',
                    label:'科研办公室'
                },{
                    value:'03',
                    label:'学科建设与研究生教育办公室'
                }]
            
        }
    },
    mounted() {
        this.handleGetAllLevelData()
    },
    methods:{
        //获取所有级别的接口
        handleGetAllLevelData() {
            const t = this;
            getAllLevel().then(res => {
                console.log('res--->:', res);
                this.level_options = res.result;
            })
        },
        //返回函数
        goBack() {
            this.$router.push('/')
        },
        //提交函数
        handleSubmit() {
            console.log('提交:',this.form);
            createUser(this.form).then(res => {
                console.log('res :', res);
                if(res.code === 200) {
                    this.$message({
                        message: res.message,
                        type: 'success'
                    })
                    this.$router.push('/');
                } else {
                    this.$message({
                        message: res.message,
                        type: 'error'
                    })
                } 
            })
        },
        //重置函数
        handleReset() {
            console.log('重置:' );
        }
    }
}
</script>

<style scoped>
.page-header {
    padding: 20px;
}
.page-content {
    margin: 20px;
}
.page-footer {
    margin-top: 100px;
    text-align: center;
}
.row-item {
    margin: 10px;
}
.data-item {
    line-height: 40px;
}
.el-row {
    margin-bottom: 20px;
  }
.el-col {
    border-radius: 4px;
    padding-left: 10px;
}
.el-col-2 {
    width: auto;
}
.grid-content {
border-radius: 4px;
min-height: 36px;
}
</style>>

