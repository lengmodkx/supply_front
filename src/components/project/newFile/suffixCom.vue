<template>
    <div>
            <img v-if="file.fileThumbnail" :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${file.fileThumbnail}`" />
            <img v-else-if="imageExt.indexOf(file.ext) > -1" :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${file.fileUrl}`" />
            <img v-else-if="'.txt'.includes(file.ext)" src="@/assets/images/viewList/TXT.png" />
            <img v-else-if="'.doc'.includes(file.ext) || '.docx'.includes(file.ext)" src="@/assets/images/viewList/doc.png" />
            <img v-else-if="'.xls'.includes(file.ext) || '.xlsx'.includes(file.ext)" src="@/assets/images/viewList/Excel.png" />
            <img v-else-if="'.pdf'.includes(file.ext)" src="@/assets/images/viewList/PDF.png" />
            <img v-else-if="'.pptx'.includes(file.ext)" src="@/assets/images/viewList/PPT.png" />
            <img v-else-if="'.zip'.includes(file.ext) " src="@/assets/images/viewList/zip.png" />
            <img v-else-if="'.rar'.includes(file.ext) " src="@/assets/images/viewList/rar.png" />
            <img v-else-if="'.3ds'.includes(file.ext) " src="@/assets/images/viewList/3ds.png" />
            <img v-else-if="'.dwf'.includes(file.ext) " src="@/assets/images/viewList/dwf.png" />
            <img v-else-if="'.dwg'.includes(file.ext) " src="@/assets/images/viewList/dwg.png" />
            <img v-else-if="'.dxb'.includes(file.ext) " src="@/assets/images/viewList/dxb.png" />
            <img v-else-if="'.dxf'.includes(file.ext) " src="@/assets/images/viewList/dxf.png" />
            <img v-else-if="'.ifc'.includes(file.ext) " src="@/assets/images/viewList/ifc.png" />
            <img v-else-if="'.max'.includes(file.ext) " src="@/assets/images/viewList/MAX.png" />
            <img v-else-if="'.nwc'.includes(file.ext) " src="@/assets/images/viewList/nwc.png" />
            <img v-else-if="'.rfa'.includes(file.ext) " src="@/assets/images/viewList/rfa.png" />
            <img v-else-if="'.rvt'.includes(file.ext) " src="@/assets/images/viewList/rvt.png" />
            <img v-else-if="'.skp'.includes(file.ext) " src="@/assets/images/viewList/skp.png" />
            <img v-else-if="'.avi'.includes(file.ext) || '.mp4'.includes(file.ext)" src="@/assets/images/viewList/shipin.png" />
            <img v-else-if="'.mp3'.includes(file.ext) " src="@/assets/images/viewList/yinpin.png" />
            <img v-else src="@/icons/img/moren.png" />
          </div>
</template>
<script>
export default {
    data(){
        return{
            imageExt: [".gif", ".GIF", ".jpg", ".JPG", ".JPEG", ".png", ".PNG", ".bmp", ".BMP"],
        }
    },
    props:['file'],
}
</script>