<template>
	<view class="root">
		<view class="cover">
			<image :src="songshellIng.al.picUrl" mode="" :class="{playto:isclass}"></image>
			<view class="cover-play">
				<u-icon class="cover-play" :name="playOut" color="#fff" size="30" @click="stop"></u-icon>
			</view>
		</view>
		<view class="lyric" :style="{'top':top}">
			<view class="other"
				:style="{'color':index==nowlirics?'#fff':'#000' , 'transform':'translateY('+ height + 'px)'}"
				v-for="(item,index) in arr" :key="index" style="text-align: center;">
				{{item.words}}
			</view>
		</view>
		<view class="share">
			分享给微信好友
		</view>
		<view class="similar">
			<view class="similar-header">
				<view>喜欢这首歌的人在听</view>
				<view class="l">
					<u-icon class="cover-play" name="play-circle" color="#fff" size="15"></u-icon>
					<text  @click="newPaly()">一键收听</text>
				</view>
			</view>
			<view class="similar-item" v-for="(item,index) in besimilar" :key="index" @click="newPaly(item.id)">
				<view class="similar-item-l">
					<image :src="item.album.picUrl" mode=""></image>
					<view class="nameou">
						<text>{{item.name}}</text>
						<view>
							{{item.artists[0].name}}-{{item.name}}
						</view>
					</view>
				</view>
				<view class="similar-item-r">
					<u-icon class="cover-play" name="play-circle" color="#fff" size="20"></u-icon>
				</view>
			</view>
		</view>
		<view class="comment">
			<view class="comment-header">
				精彩评论
			</view>
			<view class="comment-item" v-for="item in comment.hotComments" :key="item.user.userId">
				<view class="comment-item-t">
					<view class="img-name">
						<image :src="item.user.avatarUrl" mode=""></image>
						<view class="name-date">
							<text>{{item.user.nickname}}</text>
							<view>{{item.time}}</view>
						</view>
					</view>
					<view class="of-likes">
						{{item.likedCount}}
						<u-icon class="cover-play" name="thumb-up" color="#fff" size="20"></u-icon>
					</view>
				</view>
				<view class="comment-item-d">
					{{item.content}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				musicdata: {},
				songshell: [],
				songshellIng: {},
				innerAudioContext: {},
				playOut: "pause-circle",
				isclass: true,
				num: 0,
				tirem: null,
				lyricdata: '',
				comment: [],
				besimilar: [],
				maxTime: "",
				arr: "",
				nowtimes: '',
				top: '10px',
				height: "",
				nowlirics: ''
			};
		},
		onLoad(option) {
			console.log(option);
			this.getMusic(option.id)
			this.getsongsheet(option.Sid, option.id)
		},
		methods: {
			//通过歌的id获取音乐地址
			async getMusic(id) {
				const {
					data
				} = await uni.$http.get("/song/url", {
					id
				})
				console.log(data);
				this.musicdata = data.data[0]
				uni.setNavigationBarTitle({
					title: this.songshellIng.name
				})
				this.getlyric(id)
				this.getcomment(id)
				this.getsimilar(id)
				this.play(this.musicdata.url)
			},
			// 播放新音乐
			async newPaly(id = false){
				this.innerAudioContext.stop()
				if(id==false){
					this.songshell = this.besimilar
					this.getMusic(this.songshell[0].id)
					const ids = this.songshell[0].id
					const {
						data
					} = await uni.$http.get('/song/detail', {
						ids
					})
					this.songshellIng = data.songs[0]
					this.songshellIng.indexes = 0
					return
				}
				this.getMusic(id)
				const {
					data
				} = await uni.$http.get('/song/detail', {
					ids:id
				})
				this.songshellIng = data.songs[0]
			},
			//通过歌单id和音乐id获取歌单以及当前音乐索引，方便后面做顺序播放
			async getsongsheet(id, Sid) {
				const {
					data
				} = await uni.$http.get('/playlist/detail', {
					id
				})
				this.songshell = data.playlist.tracks
				this.songshell.forEach((v, index) => {
					if (v.id == Sid) {
						this.songshellIng = v
						this.songshellIng.indexes = index
					}
				})
			},
			//通过id获取歌词
			async getlyric(id) {
				const {
					data
				} = await uni.$http.get("/lyric", {
					id
				})
				this.lyricdata = data
				let left = data.lrc.lyric.split("\n");
				this.lyricdata = data.lrc.lyric
				let arr = []
				left.forEach((val, i) => {
					let words = val.split("]") //分割歌词
					let time = words[0].slice(1, 10) //选择从下标为1到下标为10的字符串
					// 向arr数组添加内容（时间和歌词）
					arr.push({
						// 歌词时间转换
						time: ((time.slice(0, 2) - 0) * 60) + (time.slice(3, 5) - 0) + ((time.slice(6,
							9) - 0) / 1000), //歌词时间转换为秒
						words: words[1] ? words[1] : ""
					})
				})
				this.arr = arr
				this.maxTime = arr[arr.length - 2].time;
			},
			//通过id获取评论
			async getcomment(id) {
				const {
					data
				} = await uni.$http.get("/comment/music", {
					id,
					limit: 10
				})
				console.log(data);
				this.comment = data
				this.comment.hotComments.forEach(v => {
					let oDate = new Date(v.time),
						oYear = oDate.getFullYear(),
						oMonth = oDate.getMonth() + 1,
						oDay = oDate.getDate(),
						oTime = oYear + '年' + oMonth + '月' + oDay + '日'
					v.time = oTime
				})
			},
			//通过id获取相似歌单
			async getsimilar(id) {
				const {
					data
				} = await uni.$http.get("/simi/song", {
					id
				})
				console.log(data);
				this.besimilar = data.songs
			},
			//生成音乐播放器
			play(url) {
				const innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.autoplay = true;
				innerAudioContext.src = url;
				innerAudioContext.onTimeUpdate(() => {
					this.nowtimes = Number(innerAudioContext.currentTime);
					let realtime = Number(innerAudioContext.currentTime)
					for (let i = 1; i < this.arr.length; i++) {
						if (realtime < this.arr[i].time) {
							let newi = i - 1;
							this.nowlirics = newi;
							this.top = (newi * -30) + "px";
							// console.log(this.top)
							let height = -newi * 30
							// console.log(height);
							this.height = height
							break;
						}
					}
				})
				innerAudioContext.onPlay(() => {
					console.log('开始播放');
				});
				innerAudioContext.onEnded(() => {
					const nextsong = this.songshell[this.songshellIng.indexes + 1]
					const nextindexes = this.songshellIng.indexes + 1
					this.songshellIng = this.songshell[nextindexes]
					this.songshellIng.indexes = nextindexes
					this.getMusic(nextsong.id)
				})
				this.innerAudioContext = innerAudioContext
			},
			stop() {
				if (this.playOut == 'play-circle') {
					this.playOut = 'pause-circle'
					this.innerAudioContext.play()
					this.isclass = true
				} else {
					this.playOut = 'play-circle'
					this.innerAudioContext.pause()
					this.isclass = false
				}
			},
		},
		onUnload(){
			this.innerAudioContext.stop()
		}
	}
</script>

<style lang="less">
	.root {
		background: #090909;
		border: 1px solid transparent;

		.cover {
			width: 150px;
			height: 150px;
			background: #000;
			position: relative;
			margin: 0 auto;
			margin-top: 4rem;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 50%;
			border: 5px solid rgba(255, 255, 255, 0.5);

			.cover-play {
				position: absolute;
				left: 50%;
				display: inline-block;
				top: 50%;
				transform: translate(-50%, -50%);
			}

			image {
				width: 70%;
				height: 70%;
				margin: 0 auto;
				border-radius: 50%;
				transition: 20s;

				&.playto {
					animation: move infinite linear 30s;
				}
			}

			@keyframes move {
				0% {
					transform: rotate(0deg);
				}

				100% {
					transform: rotate(360deg);
				}
			}
		}

		.lyric {
			margin-top: 1rem;
			font-size: 13px;
			height: 100px;
			text-align: center;
			line-height: 60rpx;
			color: white;
			overflow: hidden;
			overflow-y: scroll;

			.other {
				transform: translateY(150px);
				height: 30px;
			}
		}

		.share {
			margin: 0 auto;
			margin-top: 1rem;
			font-size: 13px;
			text-align: center;
			width: 30%;
			border-radius: 1rem;
			padding: 0.3rem 0rem 0.3rem 0rem;
			color: white;
			border: 1px solid white;
		}

		.similar {
			width: 90%;
			margin: 0 auto;
			margin-top: 1rem;

			.similar-header {
				color: white;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.l {
					display: flex;
					font-size: 12px;
					border: 1px solid white;
					border-radius: 20px;
					padding: 0.3rem 0.5rem 0.3rem 0.5rem;
				}
			}

			.similar-item {
				margin-top: 1rem;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 0.5rem;

				.similar-item-l {
					display: flex;

					image {
						width: 40px;
						height: 40px;
						border-radius: 5px;
						margin-right: 0.5rem;
						vertical-align: middle;
					}

					.nameou {
						color: white;

						view {
							color: rgba(255, 255, 255, 0.7);
							font-size: 12px;
							vertical-align: middle;
						}
					}
				}
			}
		}

		.comment {
			width: 95%;
			margin: 0 auto;
			margin-top: 1rem;
			color: #fff;

			.comment-item {
				margin-top: 1rem;

				.comment-item-t {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.of-likes {
						display: flex;
					}

					.img-name {
						display: flex;
						margin-left: 0.5rem;

						image {
							height: 35px;
							width: 35px;
							border-radius: 50%;
							margin-right: 10px;
						}

						.name-date {
							view {
								margin-top: 0.3rem;
								font-size: 12px;
								color: rgba(255, 255, 255, 0.7);
							}
						}

						text {
							color: rgba(255, 255, 255, 0.7);
						}
					}
				}

				.comment-item-d {
					margin-left: 45px;
				}
			}
		}
	}
</style>
