<template>
    <div class="hello">
        <h1>收到的消息:{{ msg }}</h1>
        <button @click="handleclick">发布</button>
    </div>
</template>

<script>
    import mqtt from "mqtt";
    export default {
        name: "HelloWorld",
        data() {
            return {
                mtopic: 'chat/add/',
                msg: "",
                client: {},
            };
        },
        mounted() {
            // this.client = mqtt.connect("mqtt://192.168.31.51:1883", {
            //     // fromId: "wj",
            //     // toId: "456",
            //     // content: '你好，大家好',
            //     // contentType: '1'
            //     protocolId:'MQTT/TCP',
            //     clientId:'5551cca3-6490-473b-89a9-b14ca195d3f1',
            //     connectTimeout: 4000, // 超时时间
            //     username: 'supply',
            //     password: '123456',
            //     will:{
            //         qos:'QoS'
            //     }
            // });
            // this.mtopic += "wj/456/你好，大家好/1"
            // this.client.on("connect", (e) => {
            //     console.log("连接成功");
            //     this.client.subscribe(this.mtopic, (err) => {
            //         if (!err) {
            //             console.log("订阅成功:" + this.mtopic);
            //         }
            //     });
            // });
            // this.client.on("message", (topic, message) => {
            //     this.msg = message;
            // });

            var client = mqtt.connect('mqtt://test.mosquitto.org')

            client.on('connect', function () {
                client.subscribe('presence', function (err) {
                    if (!err) {
                        client.publish('presence', 'Hello mqtt')
                    }
                })
            })

            client.on('message', function (topic, message) {
                // message is Buffer
                console.log(message.toString())
                client.end()
            })

        },
        methods: {
            handleclick: function () {
                this.client.publish(this.mtopic, this.msg);
            },
        },
    };
</script>