<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <slot name="t1"></slot>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <slot name="t2"></slot>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
  export default {
    name: "Breadcrumb"
  }
</script>

<style scoped>

</style>