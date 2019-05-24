const path = require("path");

function resolve(dir) {
    return path.join(__dirname, ".", dir);
}
module.exports = {
    publicPath: "/",
    outputDir: process.env.NODE_ENV === "development" ? 'devdist' : 'dist', // 不同的环境打不同包名
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
        },
        company: {
            entry: 'src/company/main.js',
            template: 'public/company.html',
        }
    },
    chainWebpack: config => {
        config.resolve.alias
            .set('@$', resolve('src'));
        config.module
            .rule("svg")
            .exclude.add(resolve("src/icons"))
            .end();

        config.module
            .rule("icons")
            .test(/\.svg$/)
            .include.add(resolve("src/icons"))
            .end()
            .use("svg-sprite-loader")
            .loader("svg-sprite-loader")
            .options({
                symbolId: "svg-[name]"
            });
    },
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        port: 8090, // 端口号..
        // host: "localhost",
        https: false, // https:{type:Boolean}
        open: true, //配置自动启动浏览器
        // proxy: 'http://localhost:4000' // 配置跨域处理,只有一个代理
        proxy: {
            "/api": {
                target: "http://192.168.1.101:8080",
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