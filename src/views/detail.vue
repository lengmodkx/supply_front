<template>
  <div id="container"></div>
</template>
<script>
import { joinMeeting } from "../axios/api";
export default {
  mounted() {
    var code = this.$route.query.code;
    var userId = localStorage.userId;
    joinMeeting(userId, code).then((result) => {
        console.log(result)
      var meetingDomain = result.data.meetingDomain;
      var meetingToken = result.data.meetingToken;
      var meetingCode = result.data.meetingCode;
      var memberUUID = result.data.memberUUID;
      var clientAppId = result.data.clientAppId;
      var meetingUUID = result.data.meetingUUID;
      var meetingAppId = result.data.meetingAppId;
      window.pageConfig = {
        meetingRouter: "/detail",
        meetingRouterEnter: "/enter",
        minChromeVersion: 70,
        companyLogo: {
          en: "https://dn-st.teambition.net/meetings/meetings.logo.png",
          "zh-cn": "https://dn-st.teambition.net/meetings/meetings.logo.png",
        },
        meetingLogo: "",
        downloadUrl: "",
        startClientUrl: "",
        unsupportBrowserUrl: false,
        unsupportBrowserVersionUrl: false,
        invalidMeetingUrl: false,
        showChat: false,
        showEmailInvite: false,
        showSpeakerIcon: true,
        showMicroIcon: true,
        showCameraIcon: true,
        showShowScreenIcon: true,
        showClientGuide: false,
        moreInfo: {
          language: true,
          extra: [],
        },
        nickJoinTitle: {
          en: "Participant",
          "zh-cn": "加入会议",
        },
        nickJoinPlaceholder: {
          en: "Your meeting name",
          "zh-cn": "请输入你的姓名",
        },
        useWs: false,
        "appTitle ": {
          "en ": "ALDBIM Meetings ",
          "zh-cn ": "阿拉丁BIM云平台会议",
        },
        token: meetingToken,
        memberUuid: memberUUID,
        wssUrl: meetingDomain,
        empId: userId,
        meetingUUID: meetingUUID,
        meetingAppId: meetingAppId,
        slsInfo: {
          logServiceEndpoint: "log-global.aliyuncs.com",
          logstore: "client_info",
          project: "alimeeting-paas",
        },
        evaluateUrl: "https://tb-meeting-site.aone.alibaba-inc.com/rating?meetingId=dd645d27-d785-49e2-b9cb-5058280570a2",
        shareInfo: {
          title: {
            en: "Share",
            "zh-cn": "快速复制分享",
          },
          tips: {
            en: "After copied, share with others and invite them.",
            "zh-cn": "复制后发送给其他人，邀请他们加入。",
          },
          content: [
            {
              title: {
                en: "Link",
                "zh-cn": "会议链接",
              },
              tooltip: {},
              action: "copy",
              actionValue: "https://www.aldbim.com/detail/?code=" + code,
              actionLabel: {
                en: "Copy Meeting Link",
                "zh-cn": "复制会议链接",
              },
            },
            {
              title: {
                en: "Code",
                "zh-cn": "会议口令",
              },
              tooltip: {
                en: "Use ALDBIM Web or App and enter the Id to join.",
                "zh-cn": "从 阿拉丁BIM云平台 主页或 App 的全局创建入口进入视频讨论，输入此 ID 即可加入。",
              },
              action: "copy",
              actionValue: meetingCode,
              actionLabel: {
                en: "Copy",
                "zh-cn": "复制",
              },
            },
          ],
        },
        appDefaultLang: "zh-cn",
      };
      window.localStorage.setItem("lang", "");
    });
  },
};
</script>
