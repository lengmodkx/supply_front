<template>
  <Poptip placement="top-start"
          class="emoji fl"
          v-model="showpop">
    <span class="smileFace">
      <Icon type="md-happy"/>
    </span>
    <div slot="content">
      <Carousel v-model="value"
                :height="180"
                trigger="hover"
                arrow="never"
                class="swiper">
        <CarouselItem class="emojiBox clearfix"
                      v-for="(item,index) in newArr"
                      :key="index">
          <div class="emojiItem"
               v-for="i of item"
               :key="i.title"
               @click="showpop=false;$emit('choose',i.url)">
            <img :src="i.url" alt="i.url" />
          </div>
        </CarouselItem>
      </Carousel>
    </div>
  </Poptip>
</template>
<script>
import EmojiList from './list.js'
let list = EmojiList.map(v => { v.url = require(`@/assets/images/emoji/${v.url}`); return v })
export default {
  data () {
    return {
      showpop:false,
      value: 0,
      newArr: [],
      list
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    chunk (array, size) {
      const length = array.length
      if (!length || !size || size < 1) {
        return []
      }
      let index = 0 //用来表示切割元素的范围start
      let resIndex = 0 //用来递增表示输出数组的下标

      //根据length和size算出输出数组的长度，并且创建它。
      let result = new Array(Math.ceil(length / size))
      //进行循环
      while (index < length) {
        //循环过程中设置result[0]和result[1]的值。该值根据array.slice切割得到。
        result[resIndex++] = array.slice(index, (index += size))
      }
      return result
    },
    init () {
      let arr = this.chunk(this.list, 32) //分好组的新数组
      this.newArr = arr
    },
    resolve (cont) {
      // 用于回显时解析字符串
      let pattern1 = /\[[\u4e00-\u9fa5]+\]/g
      let pattern2 = /\[[\u4e00-\u9fa5]+\]/
      let content = cont.match(pattern1)
      let str = cont
      if (content) {
        content.map(v => {
          let item = this.list.find(o => `[${o.title}]` === v)
          if (item) {
            str = str.replace(pattern2, `<img src="${item.url} ">`)
          }
        })
      }
      return str
    }
  }
}
</script>
<style scoped lang="less">
.swiper {
  width: 288px;
}
.emoji {
  width: 25px;
  height: 25px;
  margin-top: 5px;
  margin-left: 12px;
  color: #ABABAB;
  i {
    font-size: 23px;
    cursor: pointer;
  }
  .smileFace {
    &:hover {
      color: #2d8cf0;
    }
  }
}
.emojiBox {
  width: 288px;
  .emojiItem {
    margin-left: 10px;
    margin-top: 10px;
    width: 26px;
    height: 26px;
    float: left;
    cursor: pointer;
    img {
      display: block;
      width: 26px;
      height: 26px;
    }
  }
}
</style>

