<template>
  <div>
<!--    面包屑导航-->
    <Breadcrumb>
      <slot slot="t1">商品管理</slot>
      <slot slot="t2">参数列表</slot>
    </Breadcrumb>
    
<!--    卡片视图区域-->
    <el-card>
      <!--    警告区域-->
      <el-alert
              title="请先选择商品分类,只允许为第三级分类设置相关参数" type="warning"
              :closable="false" show-icon>
      </el-alert>
      
<!--      选择商品分类区域-->
      <div class="cat_opt">
      <span> 选择商品分类：</span>
<!--      选择商品分类的级联选择框-->
        <el-cascader
                ref="cascaderRef"
                v-model="selectedCateKeys"
                :options="catelist"
                :props="cateProps"
                @change="handleChange" clearable ></el-cascader>
      </div>
      
<!--      tab 页签区域-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
<!--        添加动态参数面板-->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" @click="addDialogVisible=true" :disabled="selectedCateKeys.length===3?false:true">添加参数</el-button>
<!--          动态参数表格-->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand" >
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
<!--                添加tag-->
                <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" >
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
            </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
<!--        添加静态属性面板-->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" @click="addDialogVisible=true" :disabled="selectedCateKeys.length===3?false:true">添加属性</el-button>
          <!--          静态属性表格-->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand" >
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                <!--                添加tag-->
                <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id) ">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    
<!--    添加属性对话框-->
    <el-dialog
            :title="'添加'+titleText"
            :visible.sync="addDialogVisible"
            width="50%" @close="addDialogClosed">
<!--      form表单-->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
    </el-dialog>
  
    <!--    修改属性对话框-->
    <el-dialog
            :title="'修改'+titleText"
            :visible.sync="editDialogVisible"
            width="50%" @close="editDialogClosed">
      <!--      form表单-->
      <el-form ref="editFormRef" :model="editForm" :rules="addFormRules" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import Breadcrumb from "../../../components/content/Breadcrumb";
  export default {
    name: "Params",
    components:{
      Breadcrumb,
    },
    //计算属性
    computed:{
      titleText(){
        return this.activeName==='many'? '动态参数':'静态属性';
      },
      cateId() {
        if (this.selectedCateKeys.length === 3) {
          return this.selectedCateKeys[2]
        }
        return null
      },
    },
    data(){
      return{
      //商品分类列表
        catelist:[],
        //级联选择框的配置对象对象
        cateProps:{
          value:'cat_id',
          label:'cat_name',
          children:'children',
          expandTrigger: 'hover',
        },
        //级联选择框双向绑定的数组
        selectedCateKeys:[],
        
        //tab 页签中的数据
        //被激活的页签名称
        activeName:'many',
        //动态参数数据
        manyTableData:[],
        //静态属性数据
        onlyTableData:[],
        
        //控制添加属性对话框显示与隐藏
        addDialogVisible:false,
        //添加属性对话框中表单对象
        addForm:{
          attr_name:'',
        },
        //添加属性表单验证规则对象
        addFormRules:{
          attr_name: [
            { required: true, message: '请输入参数名称', trigger: 'blur' },
           ],
        },
        
        //控制修改对话框显示与隐藏
        editDialogVisible:false,
        //修改的表单数据对象
        editForm:{
          attr_name:''
        },
        
        // 控制inout与button哪个显示 默认隐藏文本输入框
        inputVisible:false,
        //文本框中输入的内容
        inputValue:'',
        
      }
    },
    created() {
    this.getCateList()
    },
    methods:{
      //通过请求获取商品分类列表
    async getCateList(){
      const {data:res}=await this.$http.get('categories')
      if(res.meta.status!==200)return this.$message.error('获取商品分类失败')
      this.catelist=res.data;
      //console.log(this.catelist);
    },
      //级联选择框选中项变化时的事件
     handleChange(){
      this.getParamsData()
      },
      //tab 页签点击事件处理函数
     handleTabClick(){
       this.getParamsData()
     },
      //获取参数列表数据
      async getParamsData(){
        //清除级联选择框时直接跳出函数,不发起请求
        if(this.selectedCateKeys.length!==3){
          this.selectedCateKeys=[];
          this.manyTableData=[];
          this.onlyTableData=[];
          return
        }
  
        //发起数据请求
        const {data:res}=await this.$http.get(`categories/${this.selectedCateKeys[2]}/attributes`,{
          params:{sel:this.activeName}
        })
        if(res.meta.status!==200)return this.$message.error('获取参数列表失败')
  
        //console.log(res.data)
        res.data.forEach(item=>{
          item.attr_vals=item.attr_vals?item.attr_vals.split(','):[];
          item.inputVisible=false;
          item.inputValue='';
        })
        
        
  
        console.log(res.data)
        if(this.activeName==='many')
          this.manyTableData=res.data;
        else
          this.onlyTableData=res.data;
        //console.log(res.data)
        //console.log(this.selectedCateKeys)
      },
      
      //添加属性对话框关闭事件
      addDialogClosed(){
      this.$refs.addFormRef.resetFields();
      },
      //点击添加属性对话框中确定按钮,添加参数事件
      addParams(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid)return
        const {data:res}=await this.$http.post(`categories/
        ${this.selectedCateKeys[2]}/attributes`,{
          attr_name:this.addForm.attr_name,
          attr_sel:this.activeName
        })
        if(res.meta.status!==201)return this.$message.error('添加参数失败')
        this.$message.success('添加参数成功')
        this.getParamsData();
        this.addDialogVisible=false;
      })
      },
      
      //编辑按钮,获取数据,并显示编辑对话框
      async showEditDialog(attr_id){
        const {data:res}=await this.$http.get(`categories/${this.selectedCateKeys[2]}/attributes/${attr_id}`,{
          params:{attr_sel:this.activeName}
        })
        if(res.meta.status!==200)return this.$message.error('获取参数信息失败')
        this.editForm=res.data
      this.editDialogVisible=true
      },
      // 编辑属性对话框关闭事件
      editDialogClosed(){
      this.$refs.editFormRef.resetFields() ;
      },
      //点击修改属性对话框中确定按钮,修改参数事件
      editParams(){
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return
          const { data: res } = await this.$http.put(
              `categories/${this.selectedCateKeys[2]}/attributes/${this.editForm.attr_id}`,
              { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
          )
        if(res.meta.status!==200)return this.$message.error('修改参数失败')
        this.$message.success('修改数据成功')
        this.getParamsData();
        this.editDialogVisible=false
      })
      },
      
      //删除属性事件
     async  removeParams(id){
        const confirmResult=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
       
       if(confirmResult!=='confirm')return this.$message.info('已取消删除')
       
       const {data:res}=await this.$http.delete(`categories/${this.selectedCateKeys[2]}/attributes/${id}`)
       
       if(res.meta.status!==200)return this.$message.error('删除参数失败')
       this.$message.success('删除参数成功')
       this.getParamsData();
      },
      
      //展示文本框函数
      showInput(row){
      row.inputVisible=true;
      //让文本框自动获得焦点
      //   $nextTick函数作用：页面上元素被重新渲染后，才会回调函数中的代码
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      //编辑tag属性时接口请求函数
      async saveAttrVals(row,str){
        const {data:res}=await this.$http.
        put(`categories/${this.selectedCateKeys[2]}/attributes/${row.attr_id}`,{
          attr_name:row.attr_name,
          attr_sel:row.attr_sel,
          attr_vals:row.attr_vals.join(',')
        })
        if(res.meta.status!==200) this.$message.error(str+'参数失败')
        else this.$message.success(str+'参数成功')
      },
      //添加新tag input失去焦点时处理函数
       handleInputConfirm(row){
       if(row.inputValue.trim().length!==0){
         row.attr_vals.push(row.inputValue.trim());
         this.saveAttrVals(row,'修改');
         row.inputValue='';
         row.inputVisible=false
       }
       
       },
      //删除tag处理函数
      handleClose(i,row){
      row.attr_vals.splice(i,1);
      this.saveAttrVals(row,'删除');
      }
    },
  }
</script>

<style scoped>
.cat_opt{
  margin: 15px 0;
}
  .el-tag{
    margin: 5px;
  }
  .input-new-tag{
    width: 120px;
  }
</style>