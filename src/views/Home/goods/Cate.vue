<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    
<!--    卡片视图区域-->
    <el-card>
      <el-button type="primary" @click="showAddCateDialog"> 添加分类</el-button>
<!--      表格-->
        <tree-table class="treeTable" :data="catelist" :columns="columns"
        :selection-type="false" :expand-type="false"
                    index-text="#" show-index border>
          
<!--        自定义插槽显示列 是否有效-->
          <template slot="isok" slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color: lightgreen"></i>
            <i class="el-icon-error" v-else style="color: red"></i>
          </template>
        <!--        自定义插槽 排序-->
          <template slot="order" slot-scope="scope">
            <el-tag type="primary" size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
            <el-tag type="warning" size="mini" v-else>三级</el-tag>
          </template>
         <!--        自定义插槽 操作-->
          <template slot="opt" slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialog(scope.row.cat_id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.cat_id)">删除</el-button>
          </template>
        </tree-table>
<!--      分页区域-->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[3, 5, 10, 15]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
  
    <!--    添加分类对话框-->
    <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="50%" @close="addCateDialogClosed">
      <!--      添加分类对话框下的添加分类表单-->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name" ></el-input>
        </el-form-item>
        <el-form-item label="父级分类：" >
<!--          级联控件，option用来指定数据源 props用来指定配置对象 -->
          <el-cascader
                  ref="cascaderRef"
                  v-model="selectedKeys"
                  :options="parentCateList"
                  :props="casecaderProps"
                  @change="parentCateChanged" clearable ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
    </el-dialog>
<!--    编辑分类对话框-->
    <el-dialog
            title="编辑分类"
            :visible.sync="editCateDialogVisible"
            width="50%" @close="editCateDialogClosed">
      <!--      修改编辑分类对话框下的编辑分类表单-->
      <el-form :model="editCateForm" :rules="addCateFormRules" ref="editCateFormRef" label-width="100px" >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editCate">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Cate",
    data(){
      return{
        //商品分类数据列表
        catelist:[],
        //发送请求时附带的查询条件
        queryInfo:{
          type:3,
          //当前页数
          pagenum:1,
          //每页显示多少条数据
          pagesize:5
        },
        //数据总条数
        total:0,
        //为tree-table指定列的定义
        columns:[
            {
          label:'分类名称',
          prop:'cat_name',
        },
            //自定义插槽 是否有效
          {
            label: '是否有效',
            type:'template',
            template:'isok'
          },
            //自定义插槽，排序
        {
            label: '排序',
            type:'template',
            template:'order'
          },
        //自定义插槽，操作
        {
            label: '排序',
            type:'template',
            template:'opt'
          }
        ],
        
        //控制添加分类对话框显示与隐藏
        addCateDialogVisible:false,
        //添加分类的表单数据对象
        addCateForm:{
          //将要添加的分类名称
          cat_name:'',
          //父级分类id
          cat_pid:0,
          //分类等级,默认添加一级分类
          cat_level:0
    
        },
        //添加分类表单的验证规则对象
        addCateFormRules:{
          cat_name:[
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ]
        },
        //父级分类列表
        parentCateList:[],
        //指定级联选择器配置对象
        casecaderProps:{
          value:'cat_id',
          label:'cat_name',
          children:'children',
          expandTrigger: 'hover',
          checkStrictly:true,
        },
        //选中的父级分类id数组
        selectedKeys:[],
        
        //控制编辑分类对话框显示与隐藏
        editCateDialogVisible:false,
        //编辑分类的表单数据对象
        editCateForm:{
          //将要编辑的分类名称
          cat_name:'',
          //父级分类id
          cat_pid:0,
          //分类等级,默认添加一级分类
          cat_level:0
        },
        
      }
    },
    created() {
      this.getCateList();
    },
    methods:{
      //调用接口，获取列表信息
     async  getCateList(){
        const {data:res}=await this.$http.get('categories',{params:this.queryInfo})
       
       this.catelist=res.data.result;
        this.total=res.data.total;
       //console.log(this.catelist)
      },
      //监听每页显示数据的改变
      handleSizeChange(newSize){
       this.queryInfo.pagesize=newSize;
       this.getCateList()
      },
      //监听页数变化 比如点击第几页
      handleCurrentChange(newPage){
       this.queryInfo.pagenum=newPage;
       this.getCateList()
      },
      
      //点击添加分类，显示添加分类对话框
      showAddCateDialog(){
       //先获取父级分类数据列表，再显示出对话框
        this.getParentCateList();
       this.addCateDialogVisible=true
      },
      
      //获取父级分类的数据列表
      async getParentCateList(){
       const {data:res}=await this.$http.get('categories',{params:{type:2}})
        if(res.meta.status!==200)return this.$message.error('获取父级分类数据失败')
  
        this.parentCateList=res.data;
      },
      //接连选择器中选择性发生变化时触发此函数
      parentCateChanged(){
        this.$refs.cascaderRef.dropDownVisible = false;
        //如果selectedKeys数组中 length大于0 证明有选中父级分类
        //否则，说明没有选中任何父级分类
        if(this.selectedKeys.length>0){
          this.addCateForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1]
          this.addCateForm.cat_level=this.selectedKeys.length
          return
        }
        else {
          this.addCateForm.cat_pid=0
          this.addCateForm.cat_level=0
        }
        //console.log(this.selectedKeys)
      },
      //点击添加分类对话框中确定分类，添加新的分类
      addCate(){
        //console.log(this.addCateForm)
        this.$refs.addCateFormRef.validate(async valid=>{
          if(!valid)return
          const {data:res}=await this.$http.post('categories',this.addCateForm)
          if(res.meta.status!==201)return this.$message.error('添加分类失败');
          this.$message.success('添加分类成功')
          this.getCateList();
          this.addCateDialogVisible=false
        })
      },
      //添加分类对话框关闭事件
      addCateDialogClosed(){
       this.$refs.addCateFormRef.resetFields();
       this.selectedKeys=[];
       this.addCateForm.cat_pid=0;
       this.addCateForm.cat_level=0;
      },
      
      //点击编辑按钮，弹出编辑对话框，并显示相应信息
     async  showEditCateDialog(id){
       //通过接口请求数据
        const {data:res}=await this.$http.get(`categories/${id}`)
       if(res.meta.status!==200)return this.$message.error('获取数据失败')
      this.editCateForm=res.data;
      this.editCateDialogVisible=true
      },
      //编辑分类对话框关闭事件
      editCateDialogClosed(){
       this.$refs.editCateFormRef.resetFields();
       this.editCateDialogVisible=false;
      },
      //点击编辑分类对话框中确定按钮，编辑分类
      editCate(){
        this.$refs.editCateFormRef.validate(async valid=>{
          if(!valid)return
          //console.log(this.editCateForm);
          const {data:res}=await this.$http.put(`categories/${this.editCateForm.cat_id}`,this.editCateForm)
          if(res.meta.status!==200)return this.$message.error('编辑分类请求失败')
  
          this.$message.success('编辑分类成功')
          this.getCateList()
          this.editCateDialogVisible=false
        })
      },
      
      //删除分类事件
      async removeById(id){
        //弹窗询问用户是否确认删除
        const confirmResult=await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).catch(err=>err)
        //点击确认 返回字符串confirm,点击取消,返回字符串cancel
        if(confirmResult!=='confirm'){
          return this.$message.info('已取消')
        }
        const {data:res}=await this.$http.delete('categories/'+id)
        if(res.meta.status!==200)return this.$message.error('删除分类失败')
        this.getCateList();
        this.$message.success('删除分类成功')
      },
    
    },
  }
</script>

<style scoped>
.treeTable{
  margin-top: 15px;
}
  .el-cascader{
    width: 100%;
  }
</style>