<template>
  <div class="login">
    <div class="login_box">
      <div class="login_head_img">
        <img src="../assets/logo.png" alt="">
      </div>
      <div class="form">
        <el-form label-width="0px" class="login_form" :model="form" :rules="rules" ref="loginFormRef">
          <!--account-->
          <el-form-item prop="username">
            <el-input v-model="form.username" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <!--password-->
          <el-form-item prop="password">
            <el-input v-model="form.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
          </el-form-item>
          <!--button-->
          <el-form-item class="login_buttons">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "Login",
  data(){
    return {
      form:{
        username:'admin',
        password:'123456'
      },
      rules:{
        //表单验证规则
        username:[
          {required:true,message:"请输入账号",trigger:"blur"},
          {min:3,max:16,message: "请输入3-16位账号",trigger:"blur"}
        ],
        password: [
          {required:true,message:"请输入密码",trigger:"blur"},
          {min:6,max:16,message: "请输入6-16位密码",trigger:"blur"}
        ]
      },
    }
  },
  methods:{
    reset(){
      //重置表单信息
      this.$refs.loginFormRef.resetFields();
    },
    login(){
      this.$refs.loginFormRef.validate(async (valid)=>{
        if(!valid) return;
        //解构赋值
        //返回一个promise对象
        const {data:res} =await this.$http.post('login',this.form)
        if(res.meta.status !== 200) return this.$message.error('登陆失败')
        this.$message.success('登陆成功')
      //  保存token信息
        window.sessionStorage.setItem('token',res.data.token)
        await this.$router.push('/home')
      });
    }

  }
}
</script>

<style lang="less"  scoped>
  .login{
    background-color: #2b4b6b;
    height: 100%;
    .login_box{
      width: 450px;
      height:300px;
      background-color: white;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      border-radius: 3px;
      .login_head_img{
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        background-color: #fff;
        padding: 5px;
        box-shadow: 0 0 10px #ddd;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #eee;
        }
      }
      .form{
        position: absolute;
        bottom: 0;
        width: 100%;
        .login_form{
          width: 100%;
          padding:0 20px;
          box-sizing: border-box;
        }
        .login_buttons{
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
</style>
