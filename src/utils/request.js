/* 基于axios封装的请求模块 */
import axios from 'axios'
import JSONbig from 'json-bigint'
import router from '@/router'

// 非组件模块可以这样加载使用element的message提示组件
import { Message } from 'element-ui'

// 创建一个axios实例，说白了就是复制一个axios
// 我们通过这个实例去发请求，把需要的配置配置个这个实例来处理
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn', // 请求的基地址

  // 定义后端返回的原始数据处理
  // 参数data就是后端返回的原始数据（未经处理的JSON格式字符串）
  transformResponse: [
    function (data) {
      // Do whatever you want to transform the data
      // console.log(data)
      try {
        // 后端返回的数据可能不是JSON格式的字符串，如果不是的话，那么JSONbig.parse调用就会报错
        // 所以我们使用 try-catch 来捕获异常，处理异常的发生
        // 如果转换成功，则直接把结果返回
        // console.log(JSONbig.parse(data))
        return JSONbig.parse(data)
      } catch (error) {
        // 如果转换失败，则进入这里
        // 我们在这里把数据原封不懂的直接返回给请求使用
        return data
      }

      // axios默认在内部使用JSON.parse来转换处理原始数据
      // return JSON.parse(data)
    }
  ]
})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(
  // 所有请求都会经过这里
  // config是当前请求的相关配置信息
  // config是可以修改的
  function (config) {
    // Do something before request is sent
    // 我们可以在请求发出之前统一处理业务功能
    // 例如：统一设置token
    // console.log(config)
    const user = JSON.parse(window.localStorage.getItem('user'))

    // 如果有用户登录信息，则统一设置token
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }

    // 当这里 return config 之后请求才会真正发出去
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// 响应拦截器
// Add a response interceptor
request.interceptors.response.use(
  function (response) {
    // 响应码为2xx的响应都会进入这里
    // response是响应处理
    // 注意：一定要把响应结果return，否则真正发请求的位置拿不到数据
    return response
  },
  function (error) {
    const { status } = error.response
    // 任何超出2xx的响应码都会进入这里
    // console.log('状态码异常')
    if (status === 401) {
      // 清除本地存储中的用户登录状态
      window.localStorage.removeItem('user')
      // 跳转到登录页面
      router.push('/login')
      Message('登录状态无效，请重新登录')
    } else if (status === 403) {
      // token未携带或已过期
      Message({
        type: 'warning',
        message: '没有操作权限'
      })
    } else if (status === 400) {
      // 客户端参数错误
      Message.error('参数错误,请检查请求参数')
    } else if (status >= 500) {
      // 服务端错误
      Message.error('服务器内部异常，请稍后重试')
    }
    return Promise.reject(error)
  }
)
// 导出请求方法
export default request
