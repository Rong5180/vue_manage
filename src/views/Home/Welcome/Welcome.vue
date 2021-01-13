<template>
  <div class="welcome-con">
  
  <div class="carousel">
    <h2>Welcome</h2>
    <el-carousel :interval="5000" arrow="always" >
      <el-carousel-item v-for="(item,index) in imgList" :key="index">
        <img :src="item" alt="" width="100%">
      </el-carousel-item>
    </el-carousel>
  </div>
    <Music class="music" />
  </div>
</template>

<script>
  import Music from "./children/Music";
  export default {
    name: "Welcome",
    components:{
      Music
    },
    data(){
      return{
        imgList:[],
      }
    },
    created() {
    this.imgList[0]=require('../../../assets/img/welcome/1.jpg');
    this.imgList[1]=require('../../../assets/img/welcome/2.jpg');
    this.imgList[2]=require('../../../assets/img/welcome/3.jpeg');
    this.imgList[3]=require('../../../assets/img/welcome/4.jpeg');
      //console.log(this.imgList)
    }
  }
</script>

<style scoped>
  .welcome-con{
    display: flex;
    
  }
.carousel{
  width: 500px;
  height: 100px;
  margin: 35px auto;
}

.carousel h2{
  text-align: center;
  font-family: '华文行楷';
  font-size: 30px;
}
  .carousel img{
    width: 100%;
    height: 100%;
  }
  .music{
    width: 700px;
  }
</style>