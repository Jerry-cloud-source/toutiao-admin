<template>
  <!-- <div class="layout-container">
    <div>顶部导航栏</div>
    <div>侧边栏导航</div>
    <router-view />
  </div> -->
  <el-container class="layout-container">
    <el-aside class="aside" width="200px">
      <Aside class="aside-menu" />
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <i class="el-icon-s-fold"></i>
          <span>江苏传智播客科技教育有限公司</span>
        </div>
        <el-dropdown>
          <div class="avatar-wrap">
            <img class="avatar" :src="user.photo" alt="" />
            <span>{{ user.name }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item>退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <!-- 子路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Aside from './components/aside'
import { getUserProfile } from '@/api/user'
export default {
  name: 'Layout',
  components: {
    Aside
  },
  data () {
    return {
      user: {} // 当前登录用户信息
    }
  },
  created () {
    this.loadUserProfile()
  },
  methods: {
    // 除了登录接口，其它所有接口都需要授权才能请求使用
    // 或者说，除了登录接口，其它接口都需要提供你的身份令牌才能获取数据
    loadUserProfile () {
      getUserProfile().then(res => {
        console.log(res)
        this.user = res.data.data
      })
    }
  }
}
</script>

<style scoped lang="less">
.layout-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  .aside-menu {
    height: 100%;
  }
  .header {
    border-bottom: 1px solid #ccc;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .avatar-wrap {
      display: flex;
      align-items: center;
      .avatar {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }
  .main {
    background-color: #e9eef3;
  }
}
</style>
