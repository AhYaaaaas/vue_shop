<template>
  <el-container class="home_container">
    <el-header>
      <div class="content">
        <img src="../assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="INFO" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapsed?'64px':'200px'">
        <div class="toggle" @click="changeCollapse">|||</div>
        <el-menu
          :unique-opened="true"
          background-color="#333744"
          text-color="#fff"
          :collapse="isCollapsed"
          :collapse-transition="false"
          active-text-color="#409eff"
          :router="true"
          :default-active="activePath"
        >
          <!--          一级导航-->
          <el-submenu :index="'/'+item.path" v-for="item in MenuList" :key="item.id">
            <!--            一级导航模板-->
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
              <!--            二级导航-->
              <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="getActivePath('/'+subItem.path)">
                <!--              二级导航模板-->
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data(){
    return {
      MenuList:[],
      iconList:{
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao',
      },
      isCollapsed:false,
      activePath:''
    }
  },
  created() {
    this.getMeanList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods:{
    logout(){
      window.sessionStorage.clear()
      this.$router.push('/login');
    },
    async getMeanList(){
      const {data:res} =await this.$http.get('menus')
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.MenuList = res.data
    //  {data: Array(5), meta: {…}}
    //   data: (5) [{…}, {…}, {…}, {…}, {…}, __ob__: Observer]
    //   meta: {msg: '获取菜单列表成功', status: 200}
    //   [[Prototype]]: Object
    },
    changeCollapse(){
      this.isCollapsed = !this.isCollapsed;
    },
    getActivePath(activePath){
      this.activePath = activePath;
      window.sessionStorage.setItem('activePath',activePath)
    }
  }
}
</script>

<style scoped lang="less">
  .home_container{
    height: 100%;
  }
  .el-header{
    display: flex;
    background-color: #373D41;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    .content{
      display: flex;
      align-items: center;
      span{
        color: white;
        font-size: 20px;
        text-align: center;
        margin-left: 20px;
      }
    }
    .el-button{

    }
  }
  .el-aside{
    background-color: #333744;
    .el-menu{
      border-right: none;
    }
    .toggle{
      line-height: 24px;
      color: white;
      letter-spacing: 0.2em;
      text-align: center;
      cursor: pointer;
      background-color: #4a5064;
    }
  }
  .el-main{
    background-color: #EDEAF1;
  }
  .iconfont{
    margin-right: 10px;
  }
</style>
