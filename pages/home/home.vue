<template>
	<view id="root">
		<view class="header">
			<view class="header-item" v-if="userInfo.nickName">
				<image :src="userInfo.avatarUrl" mode=""></image>
				<text>{{userInfo.nickName}}</text>
			</view>
			<view class="header-item" v-else>
				未登录
			</view>
			<view class="header-item" @click="sigout" v-if="userInfo.nickName">
				退出登录
			</view>
			<view class="header-item" @click="longin" v-else>
				立即登录
			</view>
		</view>
		<view class="search" @click="tosearch">
			<uni-icons type="search" size="25"></uni-icons>
			搜索歌曲
		</view>
		<view class="song-list">
			<view class="song-list-item" v-for="item in toplist" :key="item.id"  @click="tosongsheet(item.id)">
				<view class="img">
					<image :src="item.coverImgUrl" mode="aspectFit"></image>
					<span>{{item.updateFrequency}}</span>
				</view>
				<view class="song-list-l">
					<view class="song-list-l-item">
						<view class="son" v-for="(son,index) in item.tracks" :key="son.first">
							{{index+1}}.{{son.first}}-{{son.second}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from "vuex"
	export default {
		data() {
			return {
				toplist:[]
			};
		},
		computed:{
			...mapState(['userInfo'])
		},
		methods:{
			...mapMutations(["upUserInfo"]),
			async getToplist(){
				const {data} = await uni.$http.get('/toplist/detail')
				this.toplist = data.list.splice(0,4)
			},
			tosongsheet(item){
				uni.navigateTo({
					url:"../../subPackages/songsheet/songsheet?id="+item
				})
			},
			longin(){
				uni.getUserProfile({
					desc:"用于登录",
					success:(res)=>{
						const localsheel = {
							nickName:res.userInfo.nickName,
							avatarUrl:res.userInfo.avatarUrl
						}
						this.upUserInfo(localsheel)
						uni.setStorageSync("userInfo",JSON.stringify(localsheel))
					},
					fail:(err)=>{
						uni.$showMsg("您拒绝了登录")	
					}
				})
			},
			sigout(){
				this.upUserInfo({})
				uni.setStorageSync("userInfo","{}")
			},
			tosearch(){
				uni.navigateTo({
					url:"../../subPackages/search/search"
				})
			}
		},
		onReady() {
			this.getToplist()
		}
	}
</script>

<style lang="less">
#root{
	.header{
		width: 95%;
		margin: 0 auto;
		font-size: 12px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.header-item{
			image{
				width: 1.5rem;
				height: 1.5rem;
				border-radius: 50%;
				vertical-align: middle;
			}
			text{
				vertical-align: middle;
				margin-left: 0.5rem;
			}
			&:nth-of-type(1){
			}
			&:nth-of-type(2){
				padding: 0.2rem 0.5rem 0.2rem 0.5rem;
				border-radius: 1rem;
				border: 1px solid #e0e0e0;
			}
		}
	}
	.search{
		width: 90%;
		margin: 0 auto;
		margin-top: 0.5rem;
		font-size: 13px;
		display: flex;
		align-items: center;
		background: #EEEEEE;
		border-radius: 1rem;
		padding: 0.5rem 1rem 0.5rem 1rem;
	}
	.song-list{
		width: 95%;
		margin: 0 auto;
		margin-top: 0.5rem;
		.song-list-item{
			display: flex;
			margin-top: 0.5rem;
			height: 100px;
			.img{
				position: relative;
				width: 100px;
				height: 100px;
				span{
					position: absolute;
					width: 100%;
					left: 5%;
					color: white;
					font-size: 12px;
					bottom: 0;
				}
				image{
					width: 100px;
					height: 100px;
					border-radius: 10px;
				}
			}
			.song-list-l{
				font-size: 12px;
				display: flex;
				margin-left: 1rem;
				align-items: center;
				.song-list-l-item{
					.son{
						width: 230px;
						overflow:hidden;
						white-space:nowrap;
						text-overflow:ellipsis;
						margin-top: 0.8rem;
					}
				}
			}
		}
	}
}
</style>
