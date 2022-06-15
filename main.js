
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import { $http } from '@escook/request-miniprogram'
import store from './store/index.js'
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
uni.$http = $http

$http.baseUrl = 'http://localhost:3000'

$http.beforeRequest = function (options) {
  uni.showLoading({
    title: '数据加载中...',
  })
}

$http.afterRequest = function () {
  uni.hideLoading()
}

uni.$showMsg = function(title='数据请求失败',duration = 1500,icon = 'none'){
	uni.showToast({
		title,
		duration,
		icon
	})
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif