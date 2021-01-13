<template>
  <el-container class="home-container">
<!--    头部区域-->
    <el-header >
      <div>
        <img class="header-img1" src="../../assets/img/home/ma.png" alt="" >
        <img class="header-img2" src="../../assets/img/home/ma.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout"> 退出</el-button>
    </el-header>
<!--    页面主区域-->
    <el-container>
<!--      侧边栏-->
      <el-aside :width="isCollapase? '70px':'200px'">
        <div class="togggle-button" @click="toggleCollapse">|||</div>
<!--        侧边栏导航区域-->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b"
                 unique-opened :collapse="isCollapase" :collapse-transition="false"
         router :default-active="activePath">
<!--          首页-->
<!--          <el-menu-item index="/welcome"   @click="savaNavState('/welcome')">-->
<!--            <template slot="title">-->
<!--              <i class="el-icon-menu"></i>-->
<!--              <span>首页</span>-->
<!--            </template>-->
<!--          </el-menu-item>-->
          <!--          一级菜单-->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
<!--            一级菜单模板-->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
<!--  二级菜单-->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children"
                          :key="subItem.id" @click="savaNavState('/'+subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
<!--      右侧内容主题-->
      <el-main>
<!--        路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "Home",
    data(){
      return{
        menulist:[],           //左侧菜单列表数据
        //左侧列表字体图标
        iconsObj: {
          '125': 'iconfont icon-user',
          '103': 'iconfont icon-tijikongjian',
          '101': 'iconfont icon-shangpin',
          '102': 'iconfont icon-danju',
          '145': 'iconfont icon-baobiao'
        },
        //控制侧边栏是否折叠
        isCollapase:false,
        //侧边栏激活链接地址
        activePath:'',
      }
    },
    methods: {
      //退出函数
      logout() {
        window.sessionStorage.clear();
        this.$router.push('/login')
      },
      //鼠标悬停导航栏头像图片放大效果
      //方案一:定义方法,鼠标滑过,原图放大.缺点:会影响页面布局,不美观
      // bigger(){
      //   let img=document.getElementsByClassName('header-img')[0];
      //   img.style.width='150px'
      //   img.style.height='150px'
      //   img.style.marginTop = "100px";
      //   img.style.marginLeft = "10px";
      // },
      // small(){
      //   let img=document.getElementsByClassName('header-img')[0];
      //   img.style.width='50px'
      //   img.style.height='50px'
      //   img.style.marginTop = "0px";
      //   img.style.marginLeft = "0px";
      // },
      //方案二,在html中添加img2,display:none,鼠标滑过时display:block.再通过定位改变图片位置
      
      //获取侧边栏列表函数
      async getMenuList(){
        const {data:res} =await this.$http.get('menus');
        if(res.meta.status!==200) return this.$message.error(res.meta.msg) ;
        this.menulist=res.data;
        //console.log(this.menulist)
      },
      //点击折叠侧边栏函数
      toggleCollapse(){
        this.isCollapase=!this.isCollapase;
      },
      //控制侧边栏选中高亮
      savaNavState(activePath){
        window.sessionStorage.setItem('activePath',activePath);
        this.activePath=activePath;
      }
      
      
    },
    created() {
      this.getMenuList();
      this.activePath=window.sessionStorage.getItem('activePath');
    }
  }
</script>

<style scoped>
  .home-container{
    height: 100%;
  }
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  
}

.el-header div{
  display: flex;
  align-items: center;
  font-size: 20px;
}
.el-header div .header-img1{
  height: 50px;
  width: 50px;
  margin-right: 15px;
  z-index: 1;
}
  .el-header div:hover .header-img2{
    display: block;
  }
  .header-img2{
    position: absolute;
    top: 60px;
    height: 150px;
    width: 150px;
    z-index: 9;
    display: none;
  }
  /*侧标栏*/
  .el-aside{
    background-color: #333744;
  }
  .el-aside .el-menu{
    border-right: none;
  }
  .el-aside .el-menu .el-submenu .iconfont{
    margin-right: 10px;
  }
  /*侧边栏折叠按钮*/
  .togggle-button{
    background-color: #4A5064;
    color: #fff;
    text-align: center;
    line-height: 24px;
    font-size: 10px;
    letter-spacing: 0.4em;
    cursor: pointer;
  }
  .el-main{
    background-color: #EAEDF1;
  }
</style>