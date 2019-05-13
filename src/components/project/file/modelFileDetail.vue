<template>
    <div id="viewer" class="viewer"></div>
</template>
<script>
    export default {
        props: ['url'],
        data: function () {
            return {}
        },
        mounted() {
            console.log('https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+this.url)
            var initOptions = {
                path: 'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+this.url,
                env: 'Local'
            }
            Autodesk.Viewing.Initializer(
                initOptions,
                () => {
                    this.onEnvInitialized()
                })

        },
        methods: {
            onEnvInitialized () {
                var domContainer = document.getElementById('viewer')
                var viewer = new Autodesk.Viewing.Private.GuiViewer3D(domContainer)
                viewer.initialize()
                viewer.loadModel('https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+this.url)
            },
            onLoadError (errCode) {
                console.log('Error loading document: ' + errCode)
            }
        }
    }
</script>
<style socped>
    .viewer {
        position: relative;
        height: 100%;
        width: 100%;
    }
</style>