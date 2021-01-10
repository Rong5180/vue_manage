<template>
  <div class="login_container">
    <div class="login_box">
<!--      头像-->
      <div class="avator_box">
        <img src="../../assets/img/login/xigua.png" alt="">
      </div>
<!--      表单-->
      <div class="login_form">
          <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef"  label-width="0px">
<!--            用户名-->
            <el-form-item prop="username">
              <el-input v-model="loginForm.username"  prefix-icon="iconfont icon-user" ></el-input>
            </el-form-item>
<!--          密码-->
            <el-form-item prop="password">
              <el-input v-model="loginForm.password"  prefix-icon="iconfont icon-3702mima" type="password"></el-input>
            </el-form-item>
<!--            按钮-->
            <el-form-item   class="form_btn">
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
      return{
        //表单绑定对象（用户名，密码）
        loginForm:{
          username:'admin',
          password:'123456',
        },
        //表单绑定规则
        loginFormRules:{
          //验证用户名
          username:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          //验证密码
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
        }
      }
    },
    methods:{
      reset(){
        this.$refs.loginFormRef.resetFields();
      },
      login(){
        this.$refs.loginFormRef.validate(async valid=>{
         if(!valid) return;
         const {data:res}=await this.$http.post("login",this.loginForm);
         if(res.meta.status!==200){
          return this.$message.error('登录失败');
         }else
           this.$message.success('登录成功');
         //保存taken
          window.sessionStorage.setItem('token',res.data.token)
          //路由跳转
          this.$router.push('/home');
        })
      }
    }
  }
</script>

<style scoped>
.login_container{
  background-image: linear-gradient(#eae5c9, #6cc6cb);
  /*background-image: linear-gradient(#6cc6cb, #9198e5);*/
  height: 100%;
}
  .login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .avator_box{
    background-color: darkslategray;
    border: 2px solid orange;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    padding:2px;
    position: relative;
    left: 50%;
    transform: translate(-50%,-50%);
    box-shadow: 0 0 20px #ddd;
  }
  .avator_box img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  
  .login_form{
    padding: 0 10px;
    margin-top: -10px;
  }
  .form_btn{
    display: flex;
    justify-content:center;
  }
</style>