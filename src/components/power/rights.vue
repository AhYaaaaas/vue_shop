<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card"  >
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot="scoped">
            <el-tag v-if="scoped.row.level === '0'">标签一</el-tag>
            <el-tag type="success" v-else-if="scoped.row.level === '1'">标签二</el-tag>
            <el-tag type="warning" v-else>标签四</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "rights",
  data(){
    return {
      rightsList:[]
    }
  },
  methods:{
    async getRightsList(){
      const {data:res} = await this.$http.get('rights/list')
      if(res.meta.status!==200)
        return this.$message.error("获取权限列表失败！");
      this.rightsList = res.data
      console.log(this.rightsList)
    }
  },
  created() {
    this.getRightsList()
  }
}
</script>

<style scoped>

</style>
