<template>
  <div>
    <!--    面包屑导航-->
    <Breadcrumb>
      <slot slot="t1">订单管理</slot>
      <slot slot="t2">订单列表</slot>
    </Breadcrumb>
    
<!--    卡片视图区域-->
    <el-card>
<!--      顶部搜索框-->
     <el-row :gutter="10">
       <el-col :span="8">
         <el-input placeholder="请输入内容">
         <el-button slot="append" icon="el-icon-search"></el-button>
         </el-input>
       </el-col>
      <el-col :span="5">
        <el-button type="primary" @click="showBox">省市区三级联动展示</el-button>
      </el-col>
     </el-row>
     
<!--      订单列表数据-->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column  label="订单编号" prop="order_number"></el-table-column>
        <el-table-column  label="订单价格(元)" prop="order_price" width="100"></el-table-column>
        <el-table-column  label="是否付款"  width="90">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column  label="是否发货" prop="is_send" width="90"></el-table-column>
        <el-table-column  label="下单时间" width="160">
          <template slot-scope="scope">
            {{scope.row.create_time|formatDate}}
          </template>
        </el-table-column >
        <el-table-column  label="操作" width="150">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" size="mini" type="primary" @click="showEditDialog(scope.row.order_id)"></el-button>
            <el-button icon="el-icon-location" size="mini" type="success" @click="showProgress"></el-button>
          </template>
        </el-table-column>
      </el-table>
      
<!--      分页功能-->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
    
<!--    显示省市区三级联动对话框-->
    <el-dialog
            title="三级联动"
            :visible.sync="addressVisible"
            width="50%" @close="addressDialogClosed">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px" >
        <el-form-item label="省市区/县" prop="address1">
         <el-cascader :options="cityData" v-model="addressForm.address1">
         
         </el-cascader>
        </el-form-item>
      <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addressVisible = false">取 消</el-button>
    <el-button type="primary" @click="addressVisible = false">确 定</el-button>
  </span>
    </el-dialog>
    
<!--    修改信息对话框-->
    <el-dialog
            title="修改信息"
            :visible.sync="editDialogVisible"
            width="50%">
<!--      修改信息表单-->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" >
        <el-form-item label="订单编号" >
          <el-input v-model="editForm.order_number" disabled></el-input>
        </el-form-item>
      <el-form-item label="是否发货" >
        <el-radio v-model="editForm.is_send" label="是">是</el-radio>
        <el-radio v-model="editForm.is_send" label="否">否</el-radio>
      </el-form-item>
        <el-form-item label="订单价格" >
          <el-input v-model="editForm.order_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="支付状态" >
          <el-input :placeholder="editForm.pay_status===1?'已支付':'未支付'"  disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editOrder">确 定</el-button>
  </span>
    </el-dialog>
    
<!--    物流信息对话框-->
    <el-dialog
            title="物流进度"
            :visible.sync="progressVisible"
            width="50%">
<!--      时间线-->
      <el-timeline >
        <el-timeline-item
                v-for="(activity, index) in prohressInfo"
                :key="index"
                :timestamp="activity.timestamp">
          {{activity.content}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
  import Breadcrumb from "../../../components/content/Breadcrumb";
  import {dateFormat,bulletFrame} from  "../../../assets/js/utils";
  import cityData from "./citydata";
  export default {
    name: "Order",
    components:{
      Breadcrumb
    },
    data(){
      return{
      //接口查询对象
        queryInfo:{
          query:'',  //查询关键字
          pagenum:1,  //当前页码
          pagesize:10  //每页多少条数据
        },
        orderlist:[] , //订单列表
        total:0,    //总数据条数
        
        //控制省市区三级联动对话框显示与隐藏
        addressVisible: false,
        //表单数据对象
        addressForm:{
          address1:[],
          address2:'',
        },
        //表单验证规则
        addressFormRules:{
          address1:[
            { required: true, message: '请选择省市区/县', trigger: 'blur' },
          ],
          address2:[
            { required: true, message: '请填写详细地址', trigger: 'blur' },
          ],
        },
        //城市数据
        cityData,
        
        //控制修改商品信息对话框显示与隐藏
        editDialogVisible:false,
        //修改信息表单数据对象
        editForm:{},
        //修改信息表单验证规则对象
        editFormRules:{},
        
        //控制物流进度对话框显示与隐藏
        progressVisible:false,
        //物流进度信息
        prohressInfo: [
            {
          content: '商品已经下单',
          timestamp: '2018-05-08'
        },
          {
          content: '您的订单将由门店安排发货',
          timestamp: '2018-05-09'
        },
          {
          content: '卖家发货',
          timestamp: '2018-05-09'
        },
        {
          content: '顺丰速运 已收取快件',
          timestamp: '2018-05-10'
        },
        {
          content: '快件到达 四川省成都市',
          timestamp: '2018-05-11'
        },
        {
          content: '派件员 顺丰速运 95338正在为您派件',
          timestamp: '2018-05-11'
        },
         {
          content: '已签收',
          timestamp: '2018-05-11'
        },
        ],
      }
    },
    created() {
      this.getOrderList();
    },
    methods:{
    //通过接口获取订单列表
      async getOrderList(){
        const {data:res}=await this.$http.get('orders',{params:this.queryInfo})
        
        if(res.meta.status!==200)return this.$message.error('获取订单列表失败')
         //console.log(res)
        this.total=res.data.total;
        this.orderlist=res.data.goods;
      },
  
      /**
       * 分页功能
       */
      // 监听每页多少数据
      handleSizeChange(newSize){
        this.queryInfo.pagesize=newSize;
        this.getOrderList()
      },
      //监听页码发生变化
      handleCurrentChange(newPage){
        this.queryInfo.pagenum=newPage
        this.getOrderList()
      },
      
      //展示三级联动对话框
      showBox(){
        this.addressVisible=true;
      },
      //三级联动对话框关闭事件
      addressDialogClosed(){
        this.$refs.addressFormRef.resetFields();
        
      },
      
      //展示修改订单窗口
      async showEditDialog(id){
        const {data:res}=await this.$http.get(`orders/${id}`)
        if(res.meta.status!==200)return this.$message.error('获取订单信息失败')
        //console.log(res)
        this.editForm=res.data;
        this.editDialogVisible=true
      },
      //修改订单事件
      async editOrder(){
        
        // this.editForm.is_send=1;
        // this.editForm.pay_status=1;
        // this.editForm.order_pay=1;
        this.editForm.is_send=this.editForm.is_send==='是'?1:0;
        //console.log(this.editForm)
         const {data: res} = await this.$http.put(`orders/${this.editForm.order_id}`,this.editForm)
        //console.log(res)
        if(res.meta.status!==201)return this.$message.error('修改订单失败')
        
        this.$message.success('修改订单成功')
        this.getOrderList();
        
        this.editDialogVisible=false;
      },
      
      //展示物流信息对话框
      async showProgress(){
        
        // const { data: res } = await this.$http.get('kuaidi/804909574412544580')
        // if(res.meta.status!==200)return this.$message.error('获取物流进度失败')
        //
        // this.prohressInfo=res.data;
        // console.log(this.prohressInfo)
        
        
        this.progressVisible=true
      },
      
    },
    filters:{
      //时间过滤器
      formatDate(time) {
        let date = new Date(time);
        return dateFormat(date, "yyyy-MM-dd hh:mm");
      }
    }
  }
</script>

<style scoped>
.el-cascader{
  width: 100%;
}
</style>