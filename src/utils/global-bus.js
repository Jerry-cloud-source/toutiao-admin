/**
 * 全局通信总线
 * 作用：可以让任何组件之间相互通信
 */

import Vue from 'vue'

export default new Vue()

// 假设 a 组件要给 b 组件发送数据
// a 发布事件，b 注册事件

// b 注册通信的事件
// import globalBus from '@/utils/global-bus'
// globalBus.$on('自定义事件名称', (val) => {
//     // 处理函数
//     })

// a 发布通信事件
// import globalBus from '@/utils/global-bus'
// globalBus.$emit('自定义事件名称',val)

// 注意： 通信两端所使用的事件名称必须一致，否则无效
