import config from "./WebIMConfig";
import websdk from "easemob-websdk";
// import emedia from "easemob-emedia";
// import webrtc from "easemob-webrtc";
import { Message } from "view-design";
import store from "../store";

function ack(message) {
	var bodyId = message.id; // 需要发送已读回执的消息id
	var msg = new WebIM.message("read", WebIM.conn.getUniqueId());
	msg.set({
		id: bodyId,
		to: message.from
	});
	WebIM.conn.send(msg.body);
}

// 初始化IM SDK
var WebIM = {};
WebIM = window.WebIM = websdk;
WebIM.config = config;
WebIM.conn = new WebIM.connection({
	appKey: WebIM.config.appkey,
	isHttpDNS: WebIM.config.isHttpDNS,
	isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
	https: WebIM.config.https,
	url: WebIM.config.xmppURL,
	apiUrl: WebIM.config.apiURL,
	isAutoLogin: true,
	heartBeatWait: WebIM.config.heartBeatWait,
	autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
	autoReconnectInterval: WebIM.config.autoReconnectInterval,
	isStropheLog: WebIM.config.isStropheLog,
	delivery: WebIM.config.delivery
});
if (!WebIM.conn.apiUrl) {
	WebIM.conn.apiUrl = WebIM.config.apiURL;
}

// 注册监听回调
WebIM.conn.listen({
	onOpened: function (message) { // 连接成功回调
		// console.log(message)
		// 登录或注册成功后 跳转到好友页面
		console.log("用户已上线");
	},
	onClosed: function (message) {
		// Vue.$router.push({ path: "/login" });
		console.log("用户下线");
		console.log(message)

	}, // 连接关闭回调
	onTextMessage: function (message) {
		const { from, to, type } = message;
		const chatId = type !== "chat" ? to : from;
		const typeMap = {
			chat: "contact",
			groupchat: "group",
			chatroom: "chatroom"
		};
		console.log(message)
		store.commit("updateMsgList", {
			chatType: typeMap[message.type],
			chatId: chatId,
			msg: message.data,
			bySelf: false,
			from: message.from,
			mid: message.id,
		});
		
	}, // 收到文本消息
	onEmojiMessage: function (message) {
		console.log("onEmojiMessage", message);
		const { type } = message;
		type === 'chat' && ack(message);
	}, // 收到表情消息
	onPictureMessage: function (message) {
		const { from, to, type } = message;
		const chatId = type !== "chat" ? to : from;
		const typeMap = {
			chat: "contact",
			groupchat: "group",
			chatroom: "chatroom"
		};
		store.commit("updateMsgList", {
			chatType: typeMap[message.type],
			chatId: chatId,
			msg: message.url,
			bySelf: false,
			type: "img",
			from: message.from
		});
		type === 'chat' && ack(message);
	}, // 收到图片消息
	onCmdMessage: function (message) {
		console.log("onCmdMessage", message);
	}, // 收到命令消息
	onAudioMessage: function (message) {
		const typeMap = {
			chat: "contact",
			groupchat: "group",
			chatroom: "chatroom"
		};
		const chatId = message.type !== "chat" ? message.to : message.from;
		let options = {
			url: message.url,
			headers: { Accept: "audio/mp3" },
			onFileDownloadComplete: function (response) {
				let objectUrl = WebIM.utils.parseDownloadResponse.call(WebIM.conn, response);
				store.commit("updateMsgList", {
					chatType: typeMap[message.type],
					chatId: chatId,
					msg: objectUrl,
					bySelf: false,
					type: "audio",
					from: message.from
				});
			},
			onFileDownloadError: function () {
				console.log("音频下载失败");
			}
		};
		WebIM.utils.download.call(WebIM.conn, options);
		message.type === 'chat' && 	ack(message);
	}, // 收到音频消息
	onLocationMessage: function (message) {
		console.log("onLocationMessage", message);
		// message.type === 'chat' && 	ack(message);
	}, // 收到位置消息
	onFileMessage: function (message) {
		console.log(message)
		const { from, to, type } = message;
		const chatId = type !== "chat" ? to : from;
		const typeMap = {
			chat: "contact",
			groupchat: "group",
			chatroom: "chatroom"
		};
		store.commit("updateMsgList", {
			chatType: typeMap[message.type],
			chatId: chatId,
			msg: message.url,
			bySelf: false,
			type: "file",
			filename: message.filename,
			file_length: message.file_length,
			from: message.from
		});
		type === 'chat' && 	ack(message);
	}, // 收到文件消息
	onVideoMessage: function (message) {
		console.log("onVideoMessage", message);
		const { from, to, type } = message;
		const chatId = type !== "chat" ? to : from;
		const typeMap = {
			chat: "contact",
			groupchat: "group",
			chatroom: "chatroom"
		};
		let options = {
			url: message.url,
			headers: {
				Accept: "audio/mp4"
			},
			onFileDownloadComplete: function (response) {
				let objectURL = WebIM.utils.parseDownloadResponse.call(WebIM.conn, response);
				store.commit("updateMsgList", {
					chatType: typeMap[message.type],
					chatId: chatId,
					msg: objectURL,
					bySelf: false,
					type: "video",
					filename: message.filename,
					file_length: message.file_length,
					from: message.from
				});
			},
			onFileDownloadError: function () {
				console.log("视频下载失败");
			}
		};
		WebIM.utils.download.call(WebIM.conn, options);
		type === 'chat' && 	ack(message);
	}, // 收到视频消息
	onPresence: function (message) {
		// console.log("onPresence", message);
		let select_id = store.state.group.groupInfo.gid; // 群组相关操作，更新数据时需要
		switch (message.type) {
			case "subscribe":
				let options = {
					isShow: true,
					...message
				};
				store.commit("changeFriendRequestState", options);
				break;
			case "subscribed":
				store.dispatch("onGetContactUserList");
				break;
			case "unsubscribed":
				store.dispatch("onGetContactUserList");
				// TODO
				if ("code" in message) {
					alert(message.from + " " + "请求被拒绝");
				}
				else {
					// Message.success({
					// 	content: message.from + " " + "已退订"
					// });
				}
				break;

			case "direct_joined": // 被拉进群--不需要同意
				store.dispatch("onGetGroupUserList")
				break;
			case "invite": //收到邀请进群的通知
				let groupInviteOptions = {
					isShow: true,
					...message
				};
				store.commit("updateGroupInviteNotifications", groupInviteOptions);
				break;
			case "joinGroupNotifications": // 收到申请进群的通知
				let groupOptions = {
					isShow: true,
					...message
				};
				store.commit("updateGroupNotifications", groupOptions);
				break;
			case "memberJoinPublicGroupSuccess": // 成员加入聊天室成功回调
				store.dispatch("onGetGroupinfo", { select_id });
				break;
			case "joinPublicGroupSuccess":  //申请加入群组成功回调
				store.dispatch("onGetGroupUserList");
				break;
			case "deleteGroupChat": // 解散群组
				store.dispatch("onGetGroupUserList")
				break
			case "removedFromGroup": //移除
				store.dispatch("onGetGroupUserList")
				break;
			case "leaveGroup":
				store.dispatch("onGetGroupinfo", { select_id });
			default:
				break;
		}
	}, // 处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
	onRoster: function (message) {
		console.log("onRoster", message);
	}, // 处理好友申请
	onInviteMessage: function (message) {
		console.log("onInviteMessage", message);
	}, // 处理群组邀请
	onOnline: function () {
		console.log("onOnline 网络已连接");
	}, // 本机网络连接成功
	onOffline: function () {
		console.log("onOffline 网络已断开");
	}, // 本机网络掉线
	onError: function (message) {
		console.log(message)
		// if (message.type == 0) {
		// 	console.log('请输入账号密码')
		// } else if (message.type == 28) {
		// 	console.log("未登陆")
		// } else if (JSON.parse(message.data.data).error_description == "user not found") {
		// 	Message.error("用户名不存在！")
		// } else if (JSON.parse(message.data.data).error_description == "invalid password") {
		// 	console.log('密码无效！')
		// } else 
		// if (JSON.parse(message.data.data).error_description == "user not activated") {
		// 	Message.error("用户已被封禁！")
		// } 
		// else if (message.type == "504") {
		// 	Message.info("消息撤回失败");
		// }
		// 报错返回到登录页面
		// Vue.$router.push({ path: '/login' });
	}, // 失败回调
	onRecallMessage: message => {
		console.log("撤回消息", message);
		message.status = "recall";
		message.msg = "对方撤回了一条消息";
		// store.commit("updateMessageStatus", message);
	},
	onReceivedMessage: function (message) {
		// console.log("onReceivedMessage", message);
		// store.commit("updateMessageMid", message);
		// message.status = "sent";
		// store.commit("updateMessageStatus", message);
	}, // 收到消息送达服务器回执

	onDeliveredMessage: function (message) {
		console.log("onDeliveredMessage", message);
		// store.commit('updateMessageStatus', message)
	}, // 收到消息送达客户端回执

	onReadMessage: function (message) {
		console.log("onReadMessage", message);
		message.status = "read";
		// store.commit("updateMessageStatus", message);
	}, // 收到消息已读回执

	onCreateGroup: function (message) {
		console.log("onCreateGroup", message);
		store.dispatch("onGetGroupUserList");
	}, // 创建群组成功回执（需调用createGroupNew）
	onMutedMessage: function (message) {
		console.log("onMutedMessage", message);
	} // 如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
});

// WebIM.WebRTC = webrtc;
// WebIM.EMedia = emedia;
export default WebIM;
