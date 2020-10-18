<template>
  <div class="image-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 图片列表 -->
      <image-list />
    </el-card>
  </div>
</template>

<script>
import ImageList from '@/components/image-list'
export default {
  name: 'ImageIndex',
  components: {
    ImageList
  }
}
</script>

<style scoped lang="less"></style>
