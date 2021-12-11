<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddRole"> 添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" stripe border>
        <el-table-column label="权限详情" width="50px" type="expand">
          <template v-slot="scoped">
            <el-row v-for="(item,index) in scoped.row.children" :key="item.id"
                    :class="['detail',index === 0?'addBorder':'','rights']">
              <el-col :span="3">
                <el-tag closable @close="removeRoleRight(scoped.row,Item.id)">{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="21">
                <el-row v-for="(subItem,index1) in item.children"
                        :class="['addBorder',index1===0?'deleteTop':'','rights']" :key="subItem.id">
                  <el-col :span="4">
                    <el-tag type="success" closable @close="removeRoleRight(scoped.row,subItem.id)">{{ subItem.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="20" :class="['thirdRights']">
                    <el-row v-for="(subSubItem) in subItem.children" :key="subSubItem.id">
                      <el-col>
                        <el-tag type="warning" closable @close="removeRoleRight(scoped.row,subSubItem.id)" >{{ subSubItem.authName }}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scoped">
            <el-button type="primary" icon="el-icon-edit" size="middle" @click="editRole(scoped.row.id)"></el-button>
            <!--            删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="middle"
                       @click="deleteRoleInfo(scoped.row.id)"></el-button>
            <!--            设置提示-->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="middle" @click = "showRightsList(scoped.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addRoleDialogClose"
      :lock-scroll="false">
      <el-form :model="addRoleList" :rules="addRoleRules" ref="roleRef" label-width="70px">
        <el-form-item label="用户名" prop="roleName">
          <el-input v-model="addRoleList.roleName"></el-input>
        </el-form-item>
        <el-form-item label="用户描述" prop="roleDesc">
          <el-input v-model="addRoleList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='confirmAddRole'>确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改信息"
      :visible.sync="editRoleInfo"
      width="50%"
      @close="editRoleFormReset"
      :lock-scroll="false"
    >
      <el-form :model="editRoleForm" :rules="addRoleRules" ref="editRoleFormRef" label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='confirmEditRole'>确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="isShowRightsList"
      width="50%"
      :lock-scroll="false"
      @close="reSetKeyList"
      >
      <el-tree :data="RightsList"
               :props="treeProps"
               show-checkbox node-key="id"
               default-expand-all
               :default-checked-keys="keyList"
               ref="treeRef"
      >

      </el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="isShowRightsList = false">取 消</el-button>
    <el-button type="primary" @click="allotRights" >确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "roles",
  data() {
    return {
      rolesList: [],
      dialogVisible: false,
      editRoleInfo: false,
      addRoleRules: {
        roleName: [
          {required: true, message: '请输入用户名称', trigger: 'blur'},
          {min: 3, max: 16, message: '请输入3-16位昵称', trigger: 'blur'}
        ],
        roleDesc: [
          {required: false, message: '请输入用户描述', trigger: 'blur'},
          {min: 0, max: 10, message: '最多为十个字符', trigger: 'blur'}
        ],
      },
      addRoleList: {
        roleName: '',
        roleDesc: ''
      },
      editRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      isShowRightsList:false,
      RightsList:[],
      treeProps:{
        children: 'children',
        label: 'authName'
      },
      keyList:[],
      roleID:""
    }
  },
  methods: {
    async getRolesList() {
      const {data: res} = await this.$http.get('roles')
      if (res.meta.status !== 200)
        return this.$message.error("获取用户管理列表失败")
      this.rolesList = res.data

    },
    addRoleDialogClose() {
      this.$refs.roleRef.resetFields()
    },
    confirmAddRole() {
      this.$refs.roleRef.validate(async (validate) => {
        if (validate) {
          const {data: res} = await this.$http.post('roles', this.addRoleList)
          if (res.meta.status !== 201) {
            return this.$message.error("添加用户失败")
          }
          this.$message.success("添加用户成功")
          this.dialogVisible = !this.dialogVisible
          this.rolesList.push(res.data)
        }
      })

    },
    showAddRole() {
      this.dialogVisible = true
    },
    editRoleFormReset() {
      this.$refs.editRoleFormRef.resetFields()
    },
    async editRole(id) {
      this.editRoleInfo = true
      const {data: res} = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户信息失败!')
      }
      this.editRoleForm = res.data
    },
    async confirmEditRole() {
      const {data: res} = await this.$http.put(`roles/${this.editRoleForm.roleId}`, {
        roleName: this.editRoleForm.roleName,
        roleDesc: this.editRoleForm.roleDesc
      })
      if (res.meta.status !== 200)
        return this.$message.error('修改失败!')
      await this.getRolesList()
      this.editRoleInfo = !this.editRoleInfo
      this.$message.success("角色信息更新成功")
    },
    async deleteRoleInfo(id) {
      const {data: res} = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200)
        return this.$message.error('删除失败')
      this.$message.success("删除成功")
      await this.getRolesList()
    },
    async removeRoleRight(role,rightId){
      const confirmedRes = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll:false
      }).catch(error=>error)
      if(confirmedRes==='cancel'){
        return this.$message.info("已取消删除")
      }
      const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if(res.meta.status!==200){
        this.$message.error('删除失败')
      }
      role.children = res.data
    },
    async showRightsList(role){
      const {data:res} = await this.$http.get("rights/tree")
      if(res.meta.status!==200)
        return this.$message.error("获取权限列表失败")
      else
        this.RightsList = res.data
      this.addKey(role,this.keyList)
      console.log(this.keyList)
      this.isShowRightsList = !this.isShowRightsList
      this.roleID = role.id
    },
    addKey(role,arr){
      if(!role.children){
        return arr.push(role.id)
      }else{
        role.children.forEach((item)=>{
          this.addKey(item,arr)
        })
      }
    },
    reSetKeyList(){
      this.keyList = []
    },
    async allotRights(){
      const keys = [
        ...this.$refs.treeRef.getHalfCheckedKeys(),
        ...this.$refs.treeRef.getCheckedKeys()
      ]
      const str = keys.join(",")
      const {data:res} = await this.$http.post(`roles/${this.roleID}/rights`,{rids:str})
      if(res.meta.status!==200)
        return this.$message.error("更新失败")
      else
        await this.getRolesList()
      this.isShowRightsList = !this.isShowRightsList
    }
  },
  created() {
    this.getRolesList()
  }
}
</script>

<style scoped lang="less">
.detail {
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.addBorder {
  border-top: 1px solid #eee;
  padding-top: 10px;
  padding-bottom: 10px;
}

.el-tag {
  font-size: 15px;
}

.deleteTop {
  border-top: none;
}

.rights {
  display: flex;
  justify-content: center;
  align-items: center;
}

.thirdRights {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
</style>
