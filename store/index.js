import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex);
const store = new Vuex.Store({
	state:{
		userInfo:JSON.parse(uni.getStorageSync("userInfo")|| "{}")
	},
	mutations:{
		upUserInfo(state,newState){
			console.log(state);
			state.userInfo = newState
		}
	}
})
export default store