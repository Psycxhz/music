<template>
	<view class="root">
		<view class="header">
			<uni-search-bar placeholder="请输入搜索内容" bgColor="#EEEEEE" clearButton="auto" cancelButton="none" @confirm="search" @input="input" />
		</view>
		<view class="search-result-list" v-if="value">
			<view v-if = "show">
				<view class="search-result-item" v-for="(item, i) in result" :key="i"  @click="matching(item.keyword)">
					<uni-icons type="search" size="18"></uni-icons>
					<view class="goods-name">{{item.keyword}}</view>
				</view>
			</view>
			<view v-else>
				<view class="song-list-item" v-for="(item,index) in getlist" :key="item.id">
					<view class="song-list-item-one">
						<view>
							<text>{{item.name}}</text>
							<view class="singer">
								<view class="name" v-for="son in item.ar" :key="son.id">
									{{son.name}}
								</view>
								-{{item.al.name}}
							</view>
						</view>
					</view>
					<u-icon name="play-circle" size="24"></u-icon>
				</view>
			</view>
		</view>
		<view v-else>
			<view class="historical" v-if="notrecord">
				<view class="historical-t">
					<text>历史记录</text>
					<uni-icons type="trash-filled" color="#A2A2A2" size="25" @click="clear"></uni-icons>
				</view>
				<view class="historical-d">
					<view class="historical-d-item" v-for="(item,index) in record" :key="index" @click="matching(item)">
						{{item}}
					</view>
				</view>
			</view>
			<view class="hot-search">
				<view class="h2">
					热搜榜
				</view>
				<view class="hot-search-list" v-for="(item,index) in hotsearchone" :key="index"  @click="matching(item.searchWord)">
					<view class="hot-search-list-item">
						<text class="text-one">{{index+1}}</text>
						<view class="name">
							{{item.searchWord}}
							<view class="name-item">
								{{item.content}}
							</view>
						</view>
						<image :src="item.iconUrl" mode=""></image>
					</view>
					<view class="count">{{item.score}}</view>
				</view>
				<view class="hot-search-list" v-for="(item,index) in hotsearch" :key="index" @click="matching(item.searchWord)">
					<view class="hot-search-list-item">
						<text class="text">{{index+4}}</text>
						<view class="name">
							{{item.searchWord}}
							<view class="name-item">
								{{item.content}}
							</view>
						</view>
						<image :src="item.iconUrl" mode=""></image>
					</view>
					<view class="count">{{item.score}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hotsearch: [],
				hotsearchone: [],
				result: [],
				value: false,
				timer: null,
				getlist:[],
				show:true,
				limit:30,
				record:[],
				notrecord:false
			};
		},
		methods: {
			async gethot() {
				const {
					data
				} = await uni.$http.get('/search/hot/detail')
				this.hotsearch = data.data
				this.hotsearchone = this.hotsearch.splice(0, 3)
			},
			input(e) {
				this.show = true
				if (e == "") return this.value = false
				this.value = true
				clearTimeout(this.timer); //停止上一个settimeout的执行
				this.timer = setTimeout(async () => {
					const {
						data
					} = await uni.$http.get("/search/suggest", {
						keywords: e,
						type:'mobile'
					})
					this.result = data.result.allMatch
				}, 500)
				this.record = [e,...this.record]
				this.record = ([...new Set(this.record)])
				let localsheef = this.record
				uni.setStorageSync("record",JSON.stringify(localsheef))
			},
			async matching(keywords){
				let limit = this.limit
				this.value = true
				this.show = false
				const {data} = await uni.$http.get('/cloudsearch',{keywords,limit})
				console.log(data);
				this.getlist = data.result.songs
			},
			clear(){
				this.notrecord = false
				this.record = []
				let localsheef = []
				uni.setStorageSync("record",JSON.stringify(localsheef))
			},
			getrecord(){
				let localsheef = JSON.parse(uni.getStorageSync("record") ||  "[]")
				this.record = ([...new Set(localsheef)])
				if(this.record.length > 0){
					this.notrecord = true
				}
			}
		},
		onReady() {
			this.gethot()
			this.getrecord()
		}
	}
</script>

<style lang="less">
	.root {
		.header{
			position: fixed;
			background-color:rgb(245,245,245) ;
			top: 0;
			height: 50px;
			width: 100%;
		}
		.historical {
			margin-top: 4rem;
			.historical-t {
				display: flex;
				justify-content: space-between;
				width: 95%;
				font-size: 14px;
				margin: 0 auto;
			}
			.historical-d{
				display: flex;
				font-size: 12px;
				margin-top: 0.5rem;
				.historical-d-item{
					padding: 0.4rem;
					border-radius: 1rem;
					background-color: #e0e0e0;
					margin-left: 0.5rem;
					margin-right: 0.5rem;
				}
			}
		}

		.hot-search {
			width: 95%;
			margin: 0 auto;
			font-size: 13px;
			margin-top: 3.5rem;
			.hot-search-list {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.text-one {
					color: red;
				}

				.name-item {
					font-size: 12px;
					color: #A2A2A2;
				}

				.hot-search-list-item {
					display: flex;
					align-items: center;
					padding-top: 0.5rem;
					padding-bottom: 0.5rem;

					.text {
						color: #A2A2A2;
					}

					.name {
						margin-left: 1rem;
						margin-right: 0.3rem;
					}

					image {
						height: 15px;
						width: 15px;
					}
				}

				.count {
					color: #A2A2A2;
					font-size: 12px;
				}
			}
		}

		.search-result-list {
			margin-top: 3.5rem;
			.search-result-item {
				padding: 10px 0 10px 6px;
				border-bottom: 1px solid #f8f8f8;
				font-size: 13px;
				display: flex;
				margin-left: 1rem;

				.goods-name {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					font-size: 13px;
					margin-left: 1rem;
					color: #3f3f3f;
				}
			}
			.song-list-item {
				margin-top: 1rem;
				width: 90%;
				margin: 0 auto;
				font-size: 14px;
				margin-bottom: 1rem;
				display: flex;
				padding-top: 0.5rem;
				padding-bottom: 0.5rem;
				border-bottom: 1px solid  #A2A2A2;
				justify-content: space-between;
				.song-list-item-one {
					width: 70%;
					display: flex;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					.singer {
						font-size: 12px;
						color: #A2A2A2;
					}
					.name{
						font-size: 12px;
						color: #A2A2A2;
						display: inline-block;
					}
					.indexes{
						margin-left: 1rem;
						margin-right: 1rem;
					}
				}
			}
		}
	}
</style>
