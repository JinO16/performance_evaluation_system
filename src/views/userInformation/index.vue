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
                        v-model="form.name"
                        disabled
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
                    placeholder="请输入职称"
                    clearable
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
                    placeholder="请输入学位"
                    clearable
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
                    disabled
                    >
                    </el-input>
                </el-col>
            </div>
        </el-row>
        <el-row>  
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
        </el-row>
        <el-row>    
            <!-- <div class="row-item" >
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
                    </el-option>
                    </el-select>
                </el-col>
            </div> -->
            <div class="row-item" >
                <el-col :span="2">
                    <span class="data-item station">岗位:</span>
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
            <div class="row-item" >
                <el-col :span="2">
                    <span class="data-item">重设密码:</span>
                </el-col>
                <el-col :span="6"> 
                    <el-button type="text" @click="handleResetPwd">点此重置密码</el-button>
                </el-col>
            </div>
        </el-row>
    </div>
    <div class="page-footer">
        <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
    <!-- 重置密码弹出框 -->
    <el-dialog title="重置密码" :visible.sync="dialogPwdVisible">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="原始密码" prop="oldPass">
                <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
                <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="confirmPwd('ruleForm')">确定</el-button>
                <el-button @click="resetPwd('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { createUser, getInfo,updateUser} from '@/api/user';
import {getAllLevel} from '@/api/setting';
export default {
    beforeRouteLeave (to, from, next) {
        if (!this.form.station) {
            this.$message({
                type:'warning',
                message:'必须选择所属岗位！'
            })
            next(false);
        } else {
            this.handleSubmit();
            next();
        }
    },
    data() {
        //原密码的校验方式
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入原始密码'))
            } else if (value !== this.form.password) {
                callback(new Error('原始密码输入有误！'))
            } else {
                callback();
            }
        };
        //验证输入密码的校验方式
        var validatePass1 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else {
                if (this.ruleForm.checkPass !== '') {
                    this.$refs.ruleForm.validateField('checkPass');
                }
                callback();
            }
        };
        //确认输入密码的校验方式
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码！'))
            } else if (value !== this.ruleForm.pass) {
                callback(new Error('两次输入的密码不一致！'))
            } else {
                callback();
            }
        };
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
            //校验密码字段
            ruleForm: {
                oldPass: '',
                pass: '',
                checkPass:''
            },
            //校验规则
            rules: {
                oldPass: [
                    {validator: validatePass, trigger:'blur'}
                ],
                pass: [
                    {validator: validatePass1, trigger: 'blur'}
                ],
                checkPass: [
                    {validator: validatePass2, trigger: 'blur'}
                ]
            },
            dialogPwdVisible: false,
            level_options:[],//级别
            station_options:[{
                value:'教学岗',
                label:'教学岗'
                },{
                value:'科研岗',
                label:'科研岗'
                },{
                value:'教学科研并重岗',
                label:'教学科研并重岗'
            }],
          
            
        }
    },
    mounted() {
        this.handleGetAllLevelData();
        this.handleGetPersonData()
    },
    methods:{
        //获取个人信息接口
        handleGetPersonData() {
            const t = this;
           t.$store.dispatch('user/getInfo').then(res => {
            //    console.log('res :>> ', res); 
               if (res.code === 200) {
                    t.form = res.result;
              }   
           })
        },
        //获取所有级别的接口
        handleGetAllLevelData() {
            const t = this;
            getAllLevel().then(res => {
                console.log('res :>> ', res);
                this.level_options = res.result;
            })
        },
        //重置密码函数
        handleResetPwd() {
            this.dialogPwdVisible = true;
        },
        //重置密码确认函数
        confirmPwd(value) {
            console.log('value--->',value);
            this.$refs[value].validate((valid) => {
                if (valid) {
                    this.form.password = this.ruleForm.pass;
                    this.$message({
                        type:'success',
                        message:'确认成功'
                    })
                    this.dialogPwdVisible = false;
                } else {
                    this.$message({
                        type:'error',
                        message:'输入有误，请检查输入！'
                    })
                }
            })

        },
        //重置密码重置函数
        resetPwd(formName) {
            this.$refs[formName].resetFields();
        },
        //返回函数
        goBack() {
            this.$router.push('/')
        },
        //提交函数
        handleSubmit() {
            console.log('this.form :>> ', this.form);
            if(!this.form.station) {
                this.$message({
                    type:'warning',
                    message:'必须选择所属岗位！'
                })
            } else {
                updateUser(this.form).then(res => {
                if(res.code === 200) {
                    this.$message({
                        message: res.message,
                        type: 'success'
                    })
                    this.handleGetPersonData();
                    this.$router.push('/');
                    } else {
                        this.$message({
                            message: res.message,
                            type: 'error'
                        })
                    } 
                })
            }
            
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
.data-item.station::before {
    content:'*';
    color: #F56C6C;
    margin-left: 4px;
}
</style>>

