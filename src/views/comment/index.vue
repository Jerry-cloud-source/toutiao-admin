<template>
  <div class="comment-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!--
          1.把数据列表绑定给表格的data
          2.设计表格列
          3.把表格列绑定要渲染的数据字段
       -->
      <el-table
        class="table-list"
        :data="comments"
        style="width: 100%"
        size="middle"
      >
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="total_comment_count" label="总评论数">
        </el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数">
        </el-table-column>
        <el-table-column prop="address" label="评论状态">
          <template slot-scope="scope">
            {{ scope.row.comment_status ? '正常' : '关闭' }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :disabled="scope.row.statusDisabled"
              @change="onStatusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <!--
          绑定页码
          绑定每页大小
          current-page 控制激活的页码，初识是第1页
          page-sizes 页容量数组
          page-size 每页页容量大小
       -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles, updateArticleStatus } from '@/api/article'
export default {
  name: 'Comment',
  data () {
    return {
      comments: [], // 评论列表数据
      totalCount: 0, // 总数据条数
      pageSize: 20,
      page: 1 // 当前激活的页码
    }
  },
  methods: {
    handleSizeChange () {
      this.loadComments(1)
    },
    handleCurrentChange (page) {
      // console.log(page)
      // 页码改变，加载指定页码数据
      this.loadComments(page)
    },
    loadComments (page = 1) {
      // 让分页组件激活页码和请求数据的页码保持一致
      this.page = page
      getArticles({
        response_type: 'comment',
        page,
        per_page: this.pageSize
      }).then(res => {
        // console.log(res)
        const { results } = res.data.data
        results.forEach(comment => {
          comment.statusDisabled = false
        })
        // this.comments = res.data.data.results
        this.comments = results
        this.totalCount = res.data.data.total_count
      })
    },
    onStatusChange (comment) {
      // 禁用开关
      comment.statusDisabled = true
      // console.log(comment)
      // 请求提交，修改评论状态
      updateArticleStatus(comment.id.toString(), comment.comment_status).then(
        res => {
          // console.log(res)
          // 启用开关
          comment.statusDisabled = false

          this.$message({
            type: 'success',
            message: comment.comment_status ? '开启评论功能' : '关闭评论功能'
          })
        }
      )
    }
  },
  created () {
    this.loadComments()
  }
}
</script>

<style scoped lang="less">
.comment-container {
  .table-list {
    margin-bottom: 30px;
  }
}
</style>
