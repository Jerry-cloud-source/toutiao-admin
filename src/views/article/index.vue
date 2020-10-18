<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 表单 -->
      <el-form label-width="50px" size="middle">
        <el-form-item label="状态">
          <el-radio-group v-model="status"
            >+
            <!-- el-radio默认把label作为文本和选中之后的value值 -->
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="(item, index) in channels"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangDate"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00', '08:00:00']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="loading" @click="loadArticles(1)"
            >筛选</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        根据筛选条件共查询到{{ totalCount }}条结果：
      </div>
      <!--
        table表格组件
        1.把需要展示的数组列表数据绑定给table组件的data属性
        2.设计表格列 el-table-column
          width可以设定表格列的宽度
          label可以设定表格列的标题
          prop用来设定要渲染列表项的数据字段,默认只能渲染文本
        3.表格列默认只能渲染文本，如果需要展示其它内容，例如展示按钮，图片等，那么就需要自定义模板
          自定义表格列中自定义内容放到template里面
        3.1 如果需要在自定义模板中获取当前遍历项数据，那么就在template上声明slot-scope="scope"
           scope.row获得当前遍历项对象, scope.$index获得当前遍历项对象的索引
          https://element.eleme.cn/#/zh-CN/component/table#table-column-scoped-slot
      -->
      <!-- 表格 -->
      <el-table
        class="list-table"
        size="middle"
        :data="articles"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="date" label="封面">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 80px"
              :src="scope.row.cover.images[0]"
              fit="cover"
              lazy
            ></el-image>

            <!-- <img
              class="article-cover"
              v-if="scope.row.cover.images[0]"
              :src="scope.row.cover.images[0]"
              alt=""
            />
            <img
              class="article-cover"
              v-else
              src="../../assets/pic_bg.png"
              alt=""
            /> -->
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <!-- <el-tag v-if="scope.row.status === 0" type="warning">草稿</el-tag>
            <el-tag v-else-if="scope.row.status === 1">待审核</el-tag>
            <el-tag v-else-if="scope.row.status === 2" type="success">审核通过</el-tag>
            <el-tag v-else-if="scope.row.status === 3" type="danger">审核失败</el-tag>
            <el-tag v-else-if="scope.row.status === 4" type="info">已删除</el-tag> -->
            <el-tag :type="articleStatus[scope.row.status].type">{{
              articleStatus[scope.row.status].text
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间" width="180">
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              circle
              size="mini"
              type="primary"
              @click="$router.push('/publish?id=' + scope.row.id)"
            ></el-button>
            <el-button
              icon="el-icon-delete"
              circle
              size="mini"
              type="danger"
              @click="onDelteteArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!--
        total用来设定总数据的条数，它默认按照10条每页计算总页码
       -->
      <el-pagination
        layout="prev, pager, next"
        background
        :total="totalCount"
        :page-size="pageSize"
        :disabled="loading"
        :current-page.sync="page"
        @current-change="onCurrentChange"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles, getArticlesChannels, deleteArticle } from '@/api/article'
export default {
  name: 'Article',
  data () {
    return {
      articles: [], // 文章数据列表
      articleStatus: [
        { status: 0, text: '草稿', type: 'info' },
        { status: 1, text: '待审核', type: '' },
        { status: 2, text: '审核通过', type: 'success' },
        { status: 3, text: '审核失败', type: 'warning' },
        { status: 4, text: '已删除', type: 'danger' }
      ],
      page: 1,
      totalCount: 0, // 总数据条数
      pageSize: 10, // 每页大小
      status: null, // 查询文章的状态，不传就是全部
      channels: [], // 文章频道列表
      channelId: null, // 查询文章的频道，不传默认为全部
      rangDate: null, // 筛选的范围日期
      loading: true // 表单数据加载中 loading
    }
  },
  methods: {
    loadArticles (page = 1) {
      // 展示加载中 loading
      this.loading = true
      getArticles({
        // axios不会发送数据为null、undefined之类的数据
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangDate ? this.rangDate[0] : null, // 起始日期
        end_pubdate: this.rangDate ? this.rangDate[1] : null // 截止日期
      }).then(res => {
        // console.log(res)
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount
        // 关闭表单数据加载中 loading
        this.loading = false
      })
    },
    onCurrentChange (page) {
      // console.log(page)
      this.loadArticles(page)
    },
    loadChannels () {
      getArticlesChannels().then(res => {
        // console.log(res)
        this.channels = res.data.data.channels
      })
    },
    onDelteteArticle (articleId) {
      // 找到数据接口
      // 封装请求方法
      // 调用删除请求
      // 处理响应结果

      // console.log(articleId)
      // console.log(articleId.toString())
      this.$confirm('你确定要删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          deleteArticle(articleId.toString()).then(res => {
            // console.log(res)
            // 删除成功，更新当前页的文章数据列表
            this.loadArticles(this.page)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  created () {
    this.loadChannels()
    this.loadArticles()
  }
}
</script>

<style scoped lang="less">
.article-container {
  .filter-card {
    margin-bottom: 20px;
  }
  .list-table {
    margin-bottom: 30px;
    .article-cover {
      width: 100px;
      height: 80px;
      background-size: cover;
    }
  }
}
</style>
