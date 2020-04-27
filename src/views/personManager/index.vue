<template>
  <div>
    <el-button 
        size="medium"
        type="primary"
        style="margin:20px"
        @click="handleAdd">
        添加人员
    </el-button>
    <el-input
        placeholder="请输入用户姓名或工号，按回车键查询"
        prefix-icon="el-icon-search"
        v-model="searchPerson"
        style="width:300px">
    </el-input>
    <el-table v-loading="listLoading" :data="allPersonData"  fit highlight-current-row style="margin:20px">
      <!-- 表格开始      -->
        <el-table-column width="120px" label="姓名">
            <template slot-scope="scope">
             <span>{{ scope.row.name}}</span>
            </template>
        </el-table-column>
        <el-table-column width="135px" label="工号">
            <template slot-scope="scope">
                <span>{{ scope.row.jobID}}</span>
            </template>
        </el-table-column>
        <el-table-column width="160px" label="部门">
            <template slot-scope="scope">
                <span>{{scope.row.department ? scope.row.department : '暂无'}}</span>
            </template>
        </el-table-column>
        <el-table-column width="150px" label="角色">
            <template slot-scope="scope">
               <span>{{scope.row.role}}</span>
            </template>
        </el-table-column>
         <el-table-column width="135px" label="岗位">
            <template slot-scope="scope">
                <span>{{scope.row.station ? scope.row.station : '暂无'}}</span>
            </template>
        </el-table-column>
        <el-table-column width="135px" label="职称">
            <template slot-scope="scope">
                <span>{{scope.row.profession ? scope.row.profession : '暂无'}}</span>
            </template>
        </el-table-column>
        <el-table-column width="120px" label="手机号">
            <template slot-scope="scope">
                <span>{{scope.row.phone ? scope.row.phone : '暂无'}}</span>
            </template>
        </el-table-column>
        <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width">
            <template slot-scope="scope">
                <el-button
                    size="mini"
                   type="primary" plain
                    @click="handleDetail(scope.row)"
                >
                    查看详情
                </el-button>
                <el-button
                    size="mini"
                    type="primary"
                    @click="handleUpdate(scope.row)"
                >
                    修改
                </el-button>
                <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.row)"
                >
                    删除
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
        background
        layout="prev, pager, next"
        :page-size='10'
        :total="pageTotal"
        style="text-align:center"
        @current-change="handleNextPage"
    >
    </el-pagination>
    <!-- 弹出框 -->
    <el-dialog el-drag-dialog :visible.sync="dialogVisible" :title="dialogTitle">
         <el-form :inline="true" :model="personSubmit" :rules="rules" ref="personSubmit" class="demo-ruleForm">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="personSubmit.name" clearable placeholder="请输入用户姓名"></el-input>
            </el-form-item>
            <el-form-item label="工号" prop="jobID">
                <el-input v-model="personSubmit.jobID" clearable placeholder="请输入用户工号"></el-input>
            </el-form-item>
            <el-form-item label="初始密码" prop="password">
                <el-input v-model="personSubmit.password" disabled></el-input>
            </el-form-item>
            <el-form-item label="用户角色" prop="role">
                <el-select v-model="personSubmit.role" clearable placeholder="设定角色">
                    <el-option
                    v-for="item in role_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="工资号" prop="salaryID" >
                <el-input v-model="personSubmit.salaryID" clearable placeholder="请输入工资号"></el-input>
            </el-form-item>          
            <el-form-item style="display:block;text-align:center" v-if="dialogTitle == '添加人员'">
                <el-button type="primary" @click="handleAddconfirm('personSubmit')">确认添加</el-button>
                <el-button @click="handleCancel">取 消</el-button>
            </el-form-item>
            <el-form-item style="display:block;text-align:center" v-else="dialogTitle == '修改人员信息'">
                <el-button type="primary" @click="handleUpdateconfirm('personSubmit')">提交修改</el-button>
                <el-button @click="handleCancel">取 消</el-button>
            </el-form-item>
            </el-form>
    </el-dialog>
    <!-- 查看详情弹出框 -->
    <el-dialog el-drag-dialog :visible.sync="dialogDetailVisible" title="查看详情">
        <el-form :inline="true" :model="personSubmit" class="demo-ruleForm" style="margin-left:50px">
             <el-form-item label="姓名">
                <el-input v-model="personSubmit.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="工号">
                <el-input v-model="personSubmit.jobID" disabled></el-input>
            </el-form-item>
            <el-form-item label="部门">
                <el-input v-model="personSubmit.department" disabled></el-input>
            </el-form-item>
             <el-form-item label="工资号">
                <el-input v-model="personSubmit.salaryID" disabled></el-input>
            </el-form-item>
            <el-form-item label="学位">
                <el-input v-model="personSubmit.degree" disabled></el-input>
            </el-form-item>
            <el-form-item label="职称">
                <el-input v-model="personSubmit.profession" disabled></el-input>
            </el-form-item>
            <el-form-item label="角色">
                <el-input v-model="personSubmit.role" disabled></el-input>
            </el-form-item>
            <el-form-item label="级别">
                <el-input v-model="personSubmit.level" disabled></el-input>
            </el-form-item>
            <el-form-item label="岗位">
                <el-input v-model="personSubmit.station" disabled></el-input>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="personSubmit.phone" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="personSubmit.email" disabled></el-input>
            </el-form-item>
        </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { createUser, getAllUser, updateUser, deleteUser } from '@/api/user';
export default {
    inject: ['reload'],
    data() {
        return {
            listLoading: true,
            allPersonData: [],
            dialogTitle: '',
            dialogTitleData: {
                addPerson: '添加人员',
                editPerson: '修改人员信息'
            },
            dialogVisible: false,  
            dialogDetailVisible: false,//查看详情弹出框 
            personSubmit: {
                name: '',
                jobID: '',//必填
                password: '111111',//必填
                role: '普通用户',//必填--多级下拉框
                salaryID: '',//必填
                department: '',
                degree: '',
                profession: '',
                phone: '',
                email: '',
                level: '',
                station: ''             
            },
            rules: {
                name: [
                    {required: true, message:'用户姓名是必填选项',trigger: 'blur'}
                ],
                jobID: [
                    {required: true, message:'工号是必填选项', trigger: 'blur'}
                ],
                role: [
                    {required: true, message: '角色是必填选项', trigger:'change'}
                ],
                salaryID: [
                    {required: true, message: '工资号是必填选项', trigger: 'blur'}
                ]
                
            },
            role_options: [{
                value: '普通用户',
                label: '普通用户'
                },{
                    value: '领导',
                    label: '领导'
                },{
                    value: '教学办公审核员',
                    label: '教学办公审核员'
                },{
                    value: '科研办公审核员',
                    label: '科研办公审核员'
                },{
                    value: '学科建设办公审核员',
                label: '学科建设办公审核员'
            }],
            searchPerson:'',//搜索人员绑定字段    
            pageTotal:1,   //分页总页数
        }
    },
    mounted() {
        this.getAllPerson()
    },
    methods: {
        //添加人员
        handleAdd() {
            console.log('添加人员');
            this.dialogTitle = this.dialogTitleData.addPerson;
            this.dialogVisible = true;
            
        },
        //查看详情用户信息
        handleDetail(value) {
            console.log('value :', value);
            this.dialogDetailVisible = true;
            this.personSubmit = value;      
        },
        //修改用户信息
        handleUpdate(value) {
            console.log('value :', value);
            this.dialogTitle = this.dialogTitleData.editPerson;
            this.dialogVisible = true;
            this.personSubmit = value;
        },
        //删除用户信息
        handleDelete(value) {
            const t = this;
             t.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteUser({_id: value._id}).then(res => {
                    if (res.code === 200) {
                        t.$message({
                            type:'success',
                            message: res.message
                        })
                        t.getAllPerson();
                    } else {
                        t.message({
                            type: 'error',
                            message: res.message
                        })
                    }
            })
            }).catch(() => {
                t.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });
           
        },
        //获取所有用户信息列表方法
        getAllPerson(param) {
            param =  {
                skip: 1,   
            }
            const t = this;
            getAllUser(param).then(res => {
                if (res.code === 200) {
                     t.listLoading = false;
                     t.allPersonData = res.result;
                     t.pageTotal = res.count;
                } else {
                    this.$message({
                        type: 'error',
                        message:res.message
                    })
                }
            })
           
        },
        //选定角色函数
        handleSelectRole(value) {
            console.log('value :', value);
        },
        //弹出框中确认添加提交
        handleAddconfirm(value) {
           const t = this;
           t.$refs[value].validate((valid) => {
               if (valid) {
                   createUser(t.personSubmit).then(res => {
                       if (res.code === 200) {
                            t.$message({
                                message: res.message,
                                type: 'success'
                            })
                            
                       } else {
                            t.$message({
                                message: res.message,
                                    type: 'error'
                            })
                       }
                       t.dialogVisible = false;
                       t.reload();
                   })
               } else {
                   this.$message({
                       message: '请检查必填信息是否填全！',
                        type: 'error'
                   })
                   return false;
               }
           })

        },
        //弹出框确认提交修改
        handleUpdateconfirm(value) {
            console.log('value :', value);
            const t = this;
            this.$refs[value].validate((valid) => {
                if (valid) {
                    updateUser(t.personSubmit).then(res => {
                        if (res.code === 200) {
                            t.$message({
                                type:'success',
                                message:res.message
                            })                 
                        } else {
                            t.$message({
                                type: 'error',
                                message: res.message
                            })
                        }
                         t.dialogVisible = false;
                         t.reload()
                    })
                }
            })
        },
        //弹出框中取消添加
        handleCancel() {
            console.log('取消');
            const t = this;
             t.$confirm('此操作将不会保留您的修改, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.dialogVisible = false;
                 t.reload();
            }).catch(() => {
                t.$message({
                    type: 'info',
                    message: '已取消'
                });          
            }); 
            
        },
        //分页中换页
        handleNextPage(value) {
            console.log('-----',value)
            this.getAllPerson({ skip: 1, limit: 10});
        }
    }

}
</script>

<style scoped>


</style>