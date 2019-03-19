<template>
  <li class="file-picker-column thin-scroll">
    <div class="file-picker-handlers">
      <Tooltip content="添加文件夾">
        <Icon type="plus-circled" size="20" color="#3da8f5"></Icon>
      </Tooltip>
    </div>

    <loading v-if="loading"></loading>
    <section v-show="!loading">
      <header>文件夾</header>
      <ul>
        <li v-for="(item, index) in fileList" :key="index" :class="{chosed:activeName==item.fileName}" @click="chooseFolder(item.fileName,item.fileId,$event)">
          <Icon type="android-folder" size="20" class="file-icon"></Icon>
          <span class="file-name">{{item.fileName}}</span>
        </li>
      </ul>
    </section>
  </li>
</template>

<script>
import Loading from '../../public/common/Loading.vue'
import { folder } from '../../../axios/api.js'
import { checkFolder } from '../../../axios/api2.js'
export default {
  components: {
    Loading
  },
  props: ['projectId', 'parentId', 'index'],
  data() {
    return {
      loading: true,
      activeName: '',
      fileList: []
    }
  },
  mounted() {
    let params = { fileId: this.parentId }
    folder(this.projectId, params).then(res => {
      console.log(res)
      if (res.result == 1) {
        this.fileList = res.data
        this.loading = false
      }
    })
  },
  methods: {
    chooseFolder(fileName, fileId, e) {
      this.activeName = fileName
      this.$emit('childByValue', fileId, this.index)
    }
  }
}
</script>

<style lang="less">
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: #f5f5f5;
}
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #a5a5a5;
}
.file-picker {
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  overflow-y: hidden;
  overflow-x: auto;
  height: 438px;
  .file-picker-column {
    overflow-x: hidden;
    overflow-y: auto;
    width: 220px;
    min-width: 220px;
    height: 100%;
    border-right: 1px solid #e5e5e5;
    .file-picker-handlers {
      padding: 16px 0 0 16px;
    }
    li {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 4px 16px;
      cursor: pointer;
      .file-name {
        margin-left: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .file-icon {
        color: #3da8f5;
      }
      &.chosed {
        background-color: #3da8f5;
        .file-name {
          color: white;
        }
        .file-icon {
          color: white;
        }
      }
      &.active {
        background: white;
        color: #3da8f5;
        .file-name {
          color: #3da8f5;
        }
        .file-icon {
          color: #3da8f5;
        }
      }
      &:hover:not(.chosed) {
        background: #f5f5f5;
        .file-name {
          color: #3da8f5;
        }
        .file-icon {
          color: #3da8f5;
        }
      }
      &.normal {
        background: white;
        pointer-events: none;
      }
    }
    header {
      margin-top: 8px;
      padding: 4px 16px;
      color: gray;
      font-size: 13px;
    }
  }
}
</style>