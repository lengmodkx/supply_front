module.exports = {
    // 如果您不需要生产时的源映射，那么将此设置为false可以加速生产构建
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        port: 8085, // 端口号
        host: "localhost",
        https: false, // https:{type:Boolean}
        open: true, //配置自动启动浏览器
        // proxy: 'http://localhost:4000' // 配置跨域处理,只有一个代理
        proxy: {
            "/api": {
                target: "http://localhost:8090",
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    "^/api": ""
                }
            },
            "/foo": {
                target: "<other_url>"
            }
        } // 配置多个代理
    }
};