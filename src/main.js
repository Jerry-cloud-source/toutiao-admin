import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 加载全局样式文件
import './styles/index.less'

// 全局注册ElementUI组件库
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// JS大数据问题
// JSON.parse() => JSONbig.parse()
// JSON.stringify() => JSONbig.stringify()
// const str = '{ "id": 1316445571900243968 }'
// console.log(JSON.parse(str)) // 1316445571900244000
// console.log(JSONbig.parse(str).id.toString()) // 1316445571900243968

// const data = JSONbig.parse(str)
// console.log(JSON.stringify(data))
// console.log(JSONbig.stringify(data))
// 它会把超出JS安全整数范围的数字转换为一种类型为BigNumber的对象
// 我们在使用的时候选哟把这个 BigNumber.toString() 就能得到正确的数据了

// ./foo/ 会识别为目录进行加载
// ./foo 如果有同名文件和目录，肯定加载文件
//       如果只有目录，那肯定加载目录
