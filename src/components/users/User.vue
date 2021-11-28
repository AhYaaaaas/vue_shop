<template>
  <div>
    <!--    面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片区-->
    <el-card class="box-card">
      <!--      搜索区域-->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" clearable @clear="getUserList" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>
      <!--      用户信息展示区-->
      <el-table border stripe :data="userList">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scoped">
            <el-switch v-model="scoped.row.mg_state" @change="changeUserState(scoped.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220px">
          <template v-slot="scoped">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="changeUserInfo(scoped.row.id)"></el-button>
<!--            删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserConfirmed(scoped.row.id)"></el-button>
            <!--            设置提示-->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页区-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%" @close="addUserDialogClose">
      <el-form :model="addUserForm" :rules="addUserRules" ref="addUserRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--    修改用户信息-->
    <el-dialog
      title="修改信息"
      :visible.sync="editUserInfo"
      width="50%"
      @close="editUserFormReset"
    >
      <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserFormRef" label-width="70px"
               class="demo-ruleForm">
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editUserInfo = false">取 消</el-button>
    <el-button type="primary" @click="confirmEditUserInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "User",
  data() {
    let checkEmail = (rule, value, callback) => {
      const reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/
      if (reg.test(value)) {
        return callback()
      }
      callback(new Error("请输入正确的邮箱"))
    }
    let checkMobile = (rule, value, callback) => {
      const reg = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/
      if (reg.test(value)) {
        return callback()
      }
      callback(new Error("请输入正确的手机号"))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      addUserRules: {
        username: [
          {required: true, message: '请输入用户名称', trigger: 'blur'},
          {min: 3, max: 16, message: '请输入3-16位昵称', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入用户密码', trigger: 'blur'},
          {min: 6, max: 16, message: '请输入6-16位密码', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入用户邮箱', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入用户手机', trigger: 'blur'},
          {validator: checkMobile, trigger: 'blur'}
        ],
      },
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editUserInfo: false,
      editUserForm: {},
      editUserFormRules: {
        email: [
          {required: true, message: '请输入用户邮箱', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入用户手机', trigger: 'blur'},
          {validator: checkMobile, trigger: 'blur'}
        ],
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    //获取用户数据
    async getUserList() {
      const {data: res} = await this.$http.get('users', {params: this.queryInfo})
      if (res.meta.status !== 200)
        return this.$message.error('请求失败')
      this.userList = res.data.users
      this.total = res.data.total
    },
    //每页几条数据
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize;
      this.getUserList();
      // console.log(newPageSize)
    },
    //当前页码
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getUserList()
      // console.log(newPageNum)
    },
    async changeUserState(newValue) {
      console.log(newValue)
      const {data: res} = await this.$http.put(`users/${newValue.id}/state/${newValue.mg_state}`)
      if (res.meta.status !== 200) {
        newValue.mg_state = !newValue.mg_state
        return this.$message.error('修改用户状态失败')
      }
      this.$message.success('修改成功!')
    },
    searchUser() {
      this.getUserList()
    },
    addUser() {
      this.dialogVisible = true
    },
    addUserDialogClose() {
      this.$refs.addUserRef.resetFields()
    },
    confirmAddUser() {
      this.$refs.addUserRef.validate(async (validate) => {
        if (validate) {
          const {data: res} = await this.$http.post('users', this.addUserForm)
          if (res.meta.status !== 201) {
            return this.$message.error("添加用户失败")
          }
          this.$message.success("添加用户成功")
          this.dialogVisible = !this.dialogVisible
        }
      })
      this.getUserList()
    },
    async changeUserInfo(id) {
      // console.log(id)
      const {data: res} = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200)
        return this.$message.error("获取用户失败")
      this.editUserForm = res.data
      this.editUserInfo = !this.editUserInfo
    },
    editUserFormReset() {
      this.$refs.editUserFormRef.resetFields()
    },
    confirmEditUserInfo() {
      this.$refs.editUserFormRef.validate(async (validate) => {
        if (!validate)
          console.log('error')
        const {data: res} = await this.$http.put(`users/${this.editUserForm.id}`, {
          email: this.editUserForm.email,
          mobile: this.editUserForm.mobile
        })
        if (res.meta.status !== 200)
          return this.$message.error("更新用户信息失败")
        //  更新信息
        await this.getUserList()
        //  关闭对话框
        this.editUserInfo = !this.editUserInfo
        //  提示
        this.$message.success("用户信息更新成功")
      })
    },
    async removeUserConfirmed(id) {
      //确认删除返回字符串 'confirm' 取消返回 'cancel'
      const confirmedRes = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error=>error)
      if(confirmedRes==='cancel'){
        return this.$message.info("已取消删除")
      }
      const {data:res} = await this.$http.delete(`users/${id}`)
      if(res.meta.status!==200){
        this.$message.error("删除失败")
      }else{
        this.$message.success("删除成功")
        await this.getUserList()
      }
    }

  }
}
</script>

<style scoped>

</style>
