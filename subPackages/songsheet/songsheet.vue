<template>
	<view class="root">
		<view class="header" :style="{'background':color.color}">
			<view class="header-item">
				<image :src="songshell.coverImgUrl" mode=""></image>
				<view class="conten">
					<view class="conten-item">
						{{songshell.name}}
					</view>
					<view class="conten-item">
						<image :src="songshell.creator.avatarUrl" mode=""></image>
						<text style="font-size: 13px;">{{songshell.creator.nickname}}</text>
					</view>
					<text style="font-size: 12px;opacity: 0.6;">{{songshell.description}}></text>
				</view>
			</view>
			<view class="share">
				<u-icon name="share-square" color="#fff" size="28"></u-icon>
				分享给微信好友
			</view>
		</view>
		<view class="song-list">
			<view class="song-list-all">
				<u-icon name="play-circle" size="28"></u-icon>
				<view class="" @click="toplay(songshell.tracks[0].id,color.id)">
					播放全部
				</view>
				<text>(共{{songshell.tracks.length}})</text>
			</view>
			<view class="song-list-item" v-for="(item,index) in songshell.tracks" :key="item.id" @click="toplay(item.id,color.id)">
				<view class="song-list-item-one">
					<text class="indexes">{{index+1}}</text>
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
				<u-icon name="play-circle" size="28"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				songshell: {},
				back: [{
						id: 19723756,
						color: 'rgb(235,134,174)'
					},
					{
						id: 3779629,
						color: 'rgb(119,210,195)'
					},
					{
						id: 2884035,
						color: 'rgb(119,197,235)'
					},
					{
						id: 3778678,
						color: 'rgb(238,147,130)'
					},
				],
				color: {}
			}
		},
		methods: {
			async getsongsheet(id) {
				const {
					data
				} = await uni.$http.get('/playlist/detail', {
					id
				})
				this.songshell = data.playlist
				console.log(this.songshell);
				this.back.forEach(v => {
					if (v.id == id) {
						this.color = v
					}
				})
			},
			toplay(id,Sid){
				uni.navigateTo({
					url:"../playmusic/playmusic?id="+id+"&Sid="+Sid
				})
			}
		},
		onLoad(option) {
			console.log(option);
			this.getsongsheet(option.id)
		},
		onReady() {
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#ff0000',
				animation: {
					duration: 100,
					timingFunc: 'easeIn'
				}
			})
		}
	}
</script>

<style lang="less">
	.root {
		.header {
			color: #fff;
			padding-bottom: 2rem;
			border: 1px solid transparent;

			.header-item {
				display: flex;
				margin-top: 0.5rem;
				align-items: center;
				justify-content: space-around;

				image {
					width: 100px;
					height: 100px;
					border-radius: 0.5rem;
				}

				.conten {
					width: 200px;

					.conten-item {
						margin-top: 0.5rem;

						image {
							width: 1.5rem;
							height: 1.5rem;
							vertical-align: middle;
							border-radius: 50%;
						}

						text {
							margin-left: 0.5rem;
						}
					}
				}

			}

			.share {
				width: 40%;
				margin: 0 auto;
				margin-top: 1rem;
				font-size: 14px;
				text-align: center;
				display: flex;
				align-items: center;
				justify-content: center;
				padding-top: 0.3rem;
				padding-bottom: 0.3rem;
				border-radius: 1rem;
				background: rgba(255, 255, 255, .2);
			}
		}

		.song-list {
			margin-top: -1rem;
			background-color: #fff;
			border-radius: 1rem 1rem 0rem 0rem;

			.song-list-all {
				padding-top: 0.5rem;
				margin-left: 1rem;
				display: flex;
				align-items: center;
				view{
					margin-left: 0.2rem;
				}
				text {
					font-size: 12px;
					color: #e0e0e0;
				}
			}

			.song-list-item {
				margin-top: 1rem;
				width: 95%;
				font-size: 14px;
				margin-bottom: 1rem;
				display: flex;
				
				justify-content: space-between;
				.song-list-item-one {
					width: 70%;
					display: flex;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					.singer {
						font-size: 12px;
						color: #e0e0e0;
					}
					.name{
						font-size: 12px;
						color: #e0e0e0;
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
