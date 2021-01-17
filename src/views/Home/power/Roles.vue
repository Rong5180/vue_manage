<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    
<!--    卡片视图-->
    <el-card>
<!--      添加角色按钮-->
      <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
      
<!--      表格视图-->
      <el-table :data="rolelist" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom',i1===0? 'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
<!--              渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
<!--              渲染二级和三级权限-->
              <el-col :span="19">
<!--               通过v-for 渲染二级权限-->
                <el-row :class="[i2===0?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!--               通过v-for 渲染三级权限-->
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3,i3) in item2.children"
                            :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeUserById(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  
    <!--    添加用户的对话框-->
    <el-dialog
            title="添加角色"
            :visible.sync="addDialogVisible"
            width="50%" @close="addFormClosed">
      <!--      添加用户表单 表单验证-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef"
               label-width="80px" >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" >
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
  
    <!--    修改用户对话框-->
    <el-dialog
            title="修改角色"
            :visible.sync="editDialogVisible"
            width="50%" @close="editDialogClosed">
      <!--      修改用户对话框下的修改用户表单-->
      <el-form :model="addForm" :rules="addFormRules" ref="editFormRef"
               label-width="80px" >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" >
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
    </el-dialog>
    
<!--    分配权限对话框-->
    <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="50%" @close="setRightDialogClosed">
<!--      树形控件-权限列表-->
      <el-tree :data="rightslist" :props="treeProps"
               show-checkbox node-key="id" default-expand-all
               :default-checked-keys="defKeys" ref="treeRef">
      </el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Roles",
    data(){
      return{
        // 角色列表对象
        rolelist:[],
        //控制添加角色对话框显示或隐藏
        addDialogVisible:false,
        //控制修改角色对话框显示隐藏
        editDialogVisible:false,
        //添加角色对象
        addForm:{
          roleName:'',
          roleDesc:''
        },
        //添加角色表单验证对象
        addFormRules:{
          roleName: [
            { required: true, message: '请输入角色名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
        },
        
        //控制分配权限对话框显示或隐藏
        setRightDialogVisible:false,
        //所有权限数据
        rightslist:[],
        //树形控件中的属性绑定对象
        treeProps:{
          label:'authName',
          children:'children'
        },
        //默认勾选节点的Id值数组
        defKeys:[],
        //保存修改权限用户的ID
        roleId:'',
        
      }
    },
    created() {
      this.getRolesList()
    },
    methods:{
      //获取用户列表函数
      async getRolesList(){
        const {data:res}=await this.$http.get('roles');
        if(res.meta.status!==200)return this.$message.error('获取角色列表失败')
        this.rolelist=res.data;
      },
      
      //添加角色对话框关闭函数
      addFormClosed(){
        this.$refs.addFormRef.resetFields();
        this.addForm.roleDesc='';
      },
      //修改角色对话框关闭函数
      editDialogClosed(){
        this.$refs.editFormRef.resetFields();
        this.addForm.roleName='';
        this.addForm.roleDesc='';
      },
      //添加角色函数
      addUser(){
        this.$refs.addFormRef.validate(async valid=>{
          if(!valid)return
          //表单校验成功，此时可以发起网络请求
          const {data:res}=await this.$http.post('roles',this.addForm)
          if(res.meta.status!==201){
            this.$message.error('添加角色失败')
          }else {
            this.$message.success('添加角色成功');
            this.getRolesList();
          }
          this.addDialogVisible=false;
        })
      },
      
      //修改角色事件
      editUserInfo(){
        this.$refs.editFormRef.validate(async valid=>{
          if(!valid)return
          //发起修改数据请求
          const {data:res}=await this.$http.put(
              'roles/'+this.addForm.roleId,
              {
                roleName:this.addForm.roleName,
                roleDesc:this.addForm.roleDesc
              }
          )
          if(res.meta.status!==200)return this.$message.error('更新角色失败')
          //关闭对话框
          this.editDialogVisible=false;
          //刷新列表数据
          this.getRolesList();
          //提示修改成功
          this.$message.success('更新角色信息成功')
        })
      },
      //点击按钮,弹出修改用户对话框
      async showEditDialog(id){
        const {data:res}=await this.$http.get('roles/'+id)
        if(res.meta.status!==200)
        {
          return this.$message.error('查询角色信息失败')
        }
        this.addForm=res.data;
        this.editDialogVisible=true;
      },
  
      //根据Id删除对应用户信息
      async removeUserById(id){
        //弹窗询问用户是否确认删除
        const confirmResult=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).catch(err=>err)
        //点击确认 返回字符串confirm,点击取消,返回字符串cancel
        if(confirmResult!=='confirm'){
          return this.$message.info('已取消')
        }
        const {data:res}=await this.$http.delete('roles/'+id)
        if(res.meta.status!==200)return this.$message.error('删除角色失败')
        this.getRolesList();
        this.$message.success('删除角色成功')
      },
      
      //根据id删除对应的权限
      async removeRightById(role,rightId){
        const confirmResult=await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        
        if(confirmResult!=='confirm')return this.$message.info('取消了删除')
        //发起删除网络请求
        const {data:res}=await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if(res.meta.status!==200)return this.$message.error('删除权限失败' )
        role.children=res.data;
      },
  
      //展示分配权限对话框
      async showRightDialog(role){
        //保存修改权限用户的id
        this.roleId=role.id
        //获取所有权限数据
        const {data:res}=await this.$http.get('rights/tree')
        if(res.meta.status!==200)return this.$message.error('获取权限数据失败');
        //获取权限数据保存到rightslist中
        this.rightslist=res.data
        // console.log(this.rightslist);
        //递归获取三级节点Id
        this.getLeafKeys(role,this.defKeys)
        this.setRightDialogVisible=true
      },
      //通过递归函数，获取角色下所有三级权限的Id，并保存到defKeys数组中
      getLeafKeys(node,arr){
        //如果当前node节点不包含children属性,则是三级节点
        if(!node.children)return arr.push(node.id)
        node.children.forEach(item=>this.getLeafKeys(item,arr))
        
      },
      //监听分配权限对话框关闭事件
      setRightDialogClosed(){
        this.defKeys=[];
      },
      //点击确定按钮，为角色分配勾选的权限
      async allotRights(){
        const keys=[
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys(),
        ]
        // console.log(keys)
        const idStr=keys.join(',');
        const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
        console.log(res)
        if(res.meta.status!==200)return this.$message.error('分配权限失败')
        //请求成功后，弹出成功提示，刷新权限列表，关闭权限对话框
        this.$message.success('分配权限成功')
        this.getRolesList()
        this.setRightDialogVisible=false
      },
    },
    
  }
</script>

<style scoped>
.el-tag{
  margin: 7px;
}
  .bdtop{
    border-top: 1px solid #eee;
  }
  .bdbottom{
    border-bottom: 1px solid #eee;
  }
  /*居中对齐格式类*/
  .vcenter{
    display: flex;
    align-items: center;
  }
</style>