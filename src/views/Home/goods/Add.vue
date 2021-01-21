<template>
  <div>
    <!--    面包屑导航-->
    <Breadcrumb>
      <slot slot="t1">商品管理</slot>
      <slot slot="t2">添加商品</slot>
    </Breadcrumb>
    
<!--    卡片视图区域-->
    <el-card>
<!--      提示区域-->
      <el-alert title="添加商品信息,请按步骤逐步完善信息，否则可能会导致失败" type="info" center show-icon :closable="false"></el-alert>
<!--      步骤条区域-->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
  
<!--      Form表单-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
<!--      tab栏区域-->
      <el-tabs v-model="activeIndex" :tab-position="'left'"
               :before-leave="beforeTabLeave" @tab-click="tabClicked">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
<!--              级联选择器-->
            <el-cascader :options="catelist" :props="cateProps"
                         v-model="addForm.goods_cat" @change="handleChange">
            
            </el-cascader>
            </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
<!--          渲染表单item项-->
          <el-form-item v-for="item in manyTableData" :label="item.attr_name" :key="item.attr_id">
<!--          复选框组-->
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox v-for="(cb,i) in item.attr_vals" :key="i" :label="cb" border></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
<!--   action表示图片上传到后台api地址       -->
          <el-upload
                  :action="uploadURL"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  list-type="picture"
                  :headers="headerObj"
                  :on-success="handleSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
<!--          富文本编辑器-->
          <quill-editor v-model="addForm.goods_introduce"></quill-editor>
          <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
      </el-form>
    </el-card>
    
<!--    图片预览-->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
  import _ from 'lodash'
  import Breadcrumb from "../../../components/content/Breadcrumb";
  export default {
    name: "Add",
    components:{
      Breadcrumb,
    },
    data(){
      return{
      //步骤条进度
        activeIndex:'0',
        //添加商品的表单数据对象
        addForm:{
          goods_name:'',
          goods_price:0,
          goods_weight:0,
          goods_number:0,
          goods_cat:[], //商品分类数组
          pics:[],      //图片数组
          goods_introduce:'',   //商品详情描述
          attrs:[],
        },
        //添加商品表单验证规则
        addFormRules:{
          goods_name:[
            { required: true, message: '请输入商品名称', trigger: 'blur' },
            ],
          goods_price:[
            { required: true, message: '请输入商品价格', trigger: 'blur' },
            ],
          goods_weight:[
            { required: true, message: '请输入商品重量', trigger: 'blur' },
            ],
           goods_number:[
            { required: true, message: '请输入商品数量', trigger: 'blur' },
            ],
           goods_cat:[
            { required: true, message: '请选择商品分类', trigger: 'blur' }
          ]
        },
        
        //商品分类列表
        catelist:[],
        //级联选择器props
        cateProps: {
          expandTrigger: 'hover',
          value:'cat_id',
          label:'cat_name',
          children:'children',
      },
       //动态参数列表数组
        manyTableData:[],
       //静态属性列表数组
        onlyTableData:[],
        
        //图片上传url地址
        uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
        //图片上传组件请求头
        headerObj:{
          Authorization:window.sessionStorage.getItem('token')
        },
        //图片预览路径
        previewPath:'',
        //控制图片预览对话框显示与隐藏
        previewVisible:false,
      }
    },
    created() {
    this.getCateList()
    },
    methods:{
      //获取所有商品分类
      async getCateList(){
        const {data:res}=await this.$http.get('categories')
        if(res.meta.status!==200)return this.$message.error('获取商品分类数据失败')
        
        this.catelist=res.data
        //console.log(this.catelist)
      },
      
      //级联选择器选择事件
      handleChange(){
       // console.log(this.addForm.goods_cat)
        //阻止用户选择二级列表
        if(this.addForm.goods_cat.length!==3)
        {
          this.$message.error('请选择三级分类')
          return  this.addForm.goods_cat=[];
  
        }
      },
      //标签页切换处理函数
      beforeTabLeave(activeName,oldActiveName){
        if(oldActiveName=='0'&&this.addForm.goods_cat.length!==3){
          this.$message.error('请先选择商品分类')
          return false
        }
      },
      //标签页点击事件
      async tabClicked(){
        //activeIndex=1，动态参数面板
        if(this.activeIndex==='1') {
          const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`, {
            params: {sel: 'many'}
          })
          
          if(res.meta.status!==200)return  this.$message.error('获取动态参数失败')
          //console.log(res.data)
          res.data.forEach(item=>{
            item.attr_vals=item.attr_vals.length===0?[]:item.attr_vals.split(',');
          })
          //console.log(res.data)
          this.manyTableData=res.data;
        }
        
        //activeIndex=2，静态属性面板面板
        else if(this.activeIndex==='2'){
          const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`, {
            params: {sel: 'only'}
          })
          if(res.meta.status!==200)return  this.$message.error('获取静态属性失败')
          this.onlyTableData=res.data;
          console.log(this.onlyTableData)
        }
      },
      
      //处理图片预览效果
      handlePreview(file){
      this.previewPath=file.response.data.url;
      this.previewVisible=true;
      },
      // 处理移除图片操作
      handleRemove(file){
        //获取将要删除的图片的临时路径
      const filePath=file.response.data.tmp_path;
        // 找出图片路径索引值
      const i=this.addForm.pics.findIndex(item=>{
          item.pic===filePath
        })
        this.addForm.pics.splice(i,1)
        console.log(this.addForm)
      },
      //监听图片上传成功事件
      handleSuccess(response){
        const picInfo={pic:response.data.tmp_path}
        this.addForm.pics.push(picInfo)
        //console.log(this.addForm)
      },
      //添加商品事件
      add(){
        // console.log(this.addForm)
        this.$refs.addFormRef.validate( async valid=>{
          if(!valid)return this.$message.error('请填写必要的表单项')
          const form=_ .cloneDeep(this.addForm)
          form.goods_cat=form.goods_cat.join(',')
  
          /**
           * 处理动态参数，静态属性
           */
          //处理动态参数
          this.manyTableData.forEach(item=>{
            const newInfo={
              attr_id:item.attr_id,
              attr_value:item.attr_vals.join(' ')
            }
            this.addForm.attrs.push(newInfo)
          })
          //处理静态属性
          this.onlyTableData.forEach(item=>{
            const newInfo={
              attr_id:item.attr_id,
              attr_value:item.attr_vals
            }
            this.addForm.attrs.push(newInfo)
          })
          
          form.attrs=this.addForm.attrs;
          
          //发起请求添加商品 商品名称必须唯一
          const {data:res}=await this.$http.post('goods',form)
          
          if(res.meta.status!==201)return this.$message.error('添加商品失败')
          
          this.$message.success('添加商品成功')
          this.$router.push('/goods')
  
        })
      }
    },
    computed:{
      cateId(){
        if(this.addForm.goods_cat.length===3)
          return this.addForm.goods_cat[2]
        return null
      }
    }
  }
</script>

<style scoped>
.el-checkbox{
  margin: 0 5px 0 0;
}
  .previewImg{
    width: 100%;
  }
  .btnAdd{
    margin-top: 15px;
  }
</style>