<template>
  <div>
    <!--    面包屑导航-->
    <Breadcrumb>
      <slot slot="t1">商品管理</slot>
      <slot slot="t2">商品列表</slot>
    </Breadcrumb>
    
<!--    卡片视图区域-->
    <el-card>
<!--      顶部商品查询及商品添加部分-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query"
                    clearable @clear="getGoodsList" @keyup.enter.native="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
      <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      
<!--      商品表格区域-->
      <el-table :data="goodslist" border stripe>
<!--        索引列-->
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="100"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="80"></el-table-column>
        <el-table-column label="商品创建时间" prop="add_time" width="120">
          <template slot-scope="scope">
            {{scope.row.add_time|formatDate}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      
<!--      分页区域-->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total" background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  import Breadcrumb from "../../../components/content/Breadcrumb";
  import {dateFormat,bulletFrame} from  "../../../assets/js/utils"
  export default {
    name: "List",
    components:{
      Breadcrumb,
    },
    data(){
      return{
        //查询参数对象
        queryInfo:{
          query:'',
          //当前页码
          pagenum:1,
          //每页多少条数据
          pagesize:10
        },
        //商品列表数组
        goodslist:[],
        //商品总数据条数,用于实现分页
        total:0,
      }
    },
    created() {
      this.getGoodsList();
    },
    methods:{
      //调用接口请求数据后,根据请求结果提示用户
      showMsg(res,msg,bool=1){
        if(res.meta.status!==200)
          return this.$message.error(msg+'失败')
        if(bool===1)
        this.$message.success(msg+'成功')
      },
      //调用接口根据分页获取对应商品信息
      async getGoodsList(){
        const {data:res }=await this.$http.get('goods',{params:this.queryInfo})
        this.showMsg(res,'获取商品列表')
        //console.log(res.data)
        this.goodslist=res.data.goods
        this.total=res.data.total;
      },
      /**
       * 分页
       * @param newSize
       */
      //监听每页多少条数据改变
      handleSizeChange(newSize){
        this.queryInfo.pagesize=newSize;
        this.getGoodsList();
      },
      //监听页码发生变化
      handleCurrentChange(newPage){
        this.queryInfo.pagenum=newPage;
        this.getGoodsList();
      },
      
      //商品删除事件
      async removeById(id){
      const confirmResult=await bulletFrame(this,'商品');
        //console.log(confirmResult)
      if(confirmResult!=='confirm')return this.$message.info('已取消删除')
       
       const {data:res}=await this.$http.delete(`goods/${id}`)
        this.showMsg(res,'商品删除',0)
        this.getGoodsList()
      },
  
      /**
       * 添加商品
       */
      goAddPage(){
      this.$router.push('goods/add')
      }
    },
    filters:{
      //时间过滤器
      formatDate(time) {
        let date = new Date(time);
        return dateFormat(date, "yyyy-MM-dd");
      }
    }
  }
</script>

<style scoped>

</style>