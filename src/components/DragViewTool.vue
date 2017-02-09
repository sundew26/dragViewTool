<template>
  <div class="drag-page">
    <canvas id="canvas" width="1960" height="1000"></canvas>
    <ul class="drag-content" id="dragContent">
      <li class="dragEl" v-for="item in defaultData" id="{{ $index }}" v-show="!!item.isShow"
          @click.stop="choose($index)"
          :class="{'focusd': $index === idx, 'bd': $index === bg}"
          v-drag-and-drop
          drag-start="handleDragStart"
          drag-over="handleDragOver"
          drag-enter="handleDragEnter"
          drag-leave="handleDragLeave"
          drag-end="handleDragEnd"
          drop="handleDrop"
          drag="handleDrag">
        <p class="name-outer flex">
          <label>{{item.inputname}}:</label>
          <input type="text" class="name flex1" value="{{item.inputval}}" v-model="item.inputval"/>
        </p>
        <p class="description-outer flex">
          <label>{{item.textname}}:</label>
          <textarea class="description flex1" v-model="item.textval">{{item.textval}}</textarea>
        </p>
        <a class="iconfont icon-up moveIcon movePrev" @click.stop="movePrev($index)"></a>
        <a class="iconfont icon-down moveIcon moveNext" @click.stop="moveNext($index)"></a>
      </li>
    </ul>
    <div class="tc">
      <button class="btn" id="addBtn" @click="addItem()">新增</button>
      <button class="btn" id="deleteBtn" @click="deleteItem()">删除</button>
      <button class="btn" id="viewImageBtn" @click="viewImage($event)">预览</button>
      <button class="btn" id="downloadImageBtn" @click="downloadImage($event)">下载</button>
    </div>
    </div>
</template>
<script>
/* eslint-disable no-new */
  import { getInfo } from '../lib/store/action/common'
  export default {
    data () {
      return {
        loggedEvent: '',
        defaultData: [
          {'id': 0, 'inputname': '名称', 'inputval': '1', 'textname': '内容', 'textval': '', 'isShow': 1},
          {'id': 1, 'inputname': '名称', 'inputval': '2', 'textname': '内容', 'textval': '', 'isShow': 1},
          {'id': 2, 'inputname': '名称', 'inputval': '3', 'textname': '内容', 'textval': '', 'isShow': 1}
        ],
        idx: -1,
        bg: -1,
        canvasHeight: 0
      }
    },
    components: {
    },
    methods: {
      // 选中元素删除
      choose: function (idx) {
        this.idx = idx
      },
      // 添加列
      addItem: function () {
        let len = this.defaultData.length
        let newline = {'id': len, 'inputname': '名称', 'inputval': len + 1, 'textname': '内容', 'textval': '', 'isShow': 1}
        this.defaultData.push(newline)
      },
      // 删除列
      deleteItem: function () {
        if (this.idx < 0) {
          return false
        }
        this.defaultData[this.idx].isShow = 0
      },
      handleDragStart: function (elem) {
        // console.log('handleDragStart', elem)
        this.loggedEvent = 'handleDragStart'
      },
      handleDragOver: function (elem) {
        this.loggedEvent = 'handleDragOver'
      },
      handleDragEnter: function (elem) {
        if (elem.closest('li')) {
          this.bg = parseInt(elem.closest('li').id, 10)
        } else {
          this.bg = -1
        }
        this.loggedEvent = 'handleDragEnter'
      },
      handleDragLeave: function (elem) {
        this.loggedEvent = 'handleDragLeave'
      },
      handleDragEnd: function (elem) {
        this.bg = -1
        this.loggedEvent = 'handleDragEnd'
      },
      handleDrop: function (itemOne, itemTwo) {
        this.loggedEvent = 'handleDrop'
        let _index1 = itemOne.closest('li').id
        let _index2 = itemTwo.closest('li').id
        if (_index1 === _index2 || !_index2) {
          return false
        } else {
          for (let item in this.defaultData[_index1]) {
            let tep = this.defaultData[_index1][item]
            this.defaultData[_index1][item] = this.defaultData[_index2][item]
            this.defaultData[_index2][item] = tep
          }
        }
      },
      // 拖拽事件
      handleDrag: function (elem) {
        this.loggedEvent = 'handleDrag'
      },
      // 计算canvas高度,保证图片清晰度
      canvasH: function (canvasH, len, lh) {
        for (let i = 0; i < len; i++) {
          let inputStr = this.defaultData[i].inputval
          let textStr = this.defaultData[i].textval
          let rw = 150
          canvasH += this.getTrueLength(inputStr) === 0 ? lh : 0
          for (let j = 0; this.getTrueLength(inputStr) > 0; j++) {
            let str = this.cutString(inputStr, rw)
            inputStr.substr(0, str)
            canvasH += lh
            inputStr = inputStr.substr(str)
          }
          canvasH += this.getTrueLength(textStr) === 0 ? lh : 0
          for (let j = 0; this.getTrueLength(textStr) > 0; j++) {
            let str = this.cutString(textStr, rw)
            textStr.substr(0, str)
            canvasH += lh
            textStr = textStr.substr(str)
          }
          canvasH += 20
        }
//        canvasH *= 2
        this.canvasHeight = canvasH
        return canvasH
      },
      // 文本信息画成canvas
      draw: function () {
        var canvas = document.getElementById('canvas')
        var ctx = canvas.getContext('2d')
        let len = this.defaultData.length
        // canvas画图初始高度
        var hStart = 20
        // canvas行高
        var lh = 40
        // canvas每行英文字数
        var rw = 150
        // canvas行宽
        var iw = 1900
        ctx.canvas.height = this.canvasH(0, len, lh)
        for (let i = 0; i < len; i++) {
          ctx.font = '24px PingFangSC-Light'
          ctx.fillStyle = '#666'
          ctx.fillText(this.defaultData[i].inputname + ':', 20, hStart, 50)
          let inputStr = this.defaultData[i].inputval
          let textStr = this.defaultData[i].textval
          hStart += this.getTrueLength(inputStr) === 0 ? lh : 0
          for (let j = 0; this.getTrueLength(inputStr) > 0; j++) {
            let str = this.cutString(inputStr, rw)
            ctx.fillText(inputStr.substr(0, str), 100, hStart, iw)
            hStart += lh
            inputStr = inputStr.substr(str)
          }
          ctx.fillText(this.defaultData[i].textname + ':', 20, hStart, 50)
          hStart += this.getTrueLength(textStr) === 0 ? lh : 0
          for (let j = 0; this.getTrueLength(textStr) > 0; j++) {
            let str = this.cutString(textStr, rw)
            ctx.fillText(textStr.substr(0, str), 100, hStart, iw)
            hStart += lh
            textStr = textStr.substr(str)
          }
          hStart += 5
          ctx.moveTo(10, hStart - 15)
          ctx.lineTo(1960, hStart - 15)
          ctx.strokeStyle = '#ddd'
          ctx.lineWidth = 1
          ctx.stroke()
          hStart += 20
        }
      },
      // 获取段落真实长度,包括中英文
      getTrueLength: function (str) {
        let len = str.length
        let truelen = 0
        for (let x = 0; x < len; x++) {
          if (str.charCodeAt(x) > 128) {
            truelen += 2
          } else {
            truelen += 1
          }
        }
        return truelen
      },
      // canvas画图时,文字切割
      cutString: function (str, leng) {
        let len = str.length
        let tlen = len
        let nlen = 0
        for (let x = 0; x < len; x++) {
          if (str.charCodeAt(x) > 128) {
            if (nlen + 2 < leng) {
              nlen += 2
            } else {
              tlen = x
              break
            }
          } else {
            if (nlen + 1 < leng) {
              nlen += 1
            } else {
              tlen = x
              break
            }
          }
        }
        return tlen
      },
      // 绑定按钮信息
      bindButtonEvent: function (element, type, handler) {
        if (element.addEventListener) {
          element.addEventListener(type, handler, false)
        } else {
          element.attachEvent('on' + type, handler)
        }
      },
      // 文本信息保存成图片
      saveImageInfo: function () {
        let mycanvas = document.getElementById('canvas')
        let image = mycanvas.toDataURL('image/png')
        let w = window.open('about:blank', 'image from canvas')
        w.document.write('<img src="' + image + '" alt="from canvas" style="width: 980px; margin: 0 auto; display: block; height: ' + (this.canvasHeight / 2) + 'px"/>')
      },
      // 存为本地图片
      saveAsLocalImage: function () {
        let myCanvas = document.getElementById('canvas')
        let image = myCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
        window.location.href = image
      },
      // 预览图片
      viewImage: function (e) {
        this.draw()
        this.saveImageInfo()
      },
      // 下载图片
      downloadImage: function (e) {
        this.draw()
        this.saveAsLocalImage()
      },
      // 当前选中元素往上移动
      movePrev: function (idx) {
        if (idx === 0) {
          return false
        } else {
          for (let item in this.defaultData[idx]) {
            let tep = this.defaultData[idx][item]
            this.defaultData[idx][item] = this.defaultData[idx - 1][item]
            this.defaultData[idx - 1][item] = tep
          }
          this.idx = idx - 1
        }
      },
      // 当前选中元素往下移动
      moveNext: function (idx) {
        if (idx === this.defaultData.length - 1) {
          return false
        } else {
          for (let item in this.defaultData[idx]) {
            let tep = this.defaultData[idx][item]
            this.defaultData[idx][item] = this.defaultData[idx + 1][item]
            this.defaultData[idx + 1][item] = tep
          }
          this.idx = idx + 1
        }
      }
    },
    vuex: {
      getters: {
        getInfonation: state => state.common.getInfomation
      },
      actions: {
        getInfo
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../style/common.scss";
.drag-page{
  width: 100%;
  box-sizing: border-box;
  font-size: 12px;
  padding: 20px;
  background-color: #fff;
  position: relative;
  canvas{
    position: absolute;
    left: 20000px;
    top: -20000px;
  }
  li{
    background-color: #f5f5f5;
    box-sizing: border-box;
    padding-top: 10px;
    border: 1px solid #f5f5f5;
    margin-bottom: 10px;
    border-radius: 10px;
    position: relative;
    padding-right: 50px;
  }
  .focusd{
    border-color: #d00;
  }
  .bd{
    background: rgba(0, 0, 0, 0.2);
  }
  label{
    width: 50px;
    text-align: right;
    display: inline-block;
    vertical-align: top;
    height: 24px;
    line-height: 24px;
    padding-right: 5px;
  }
  p{
    margin-bottom: 10px;
  }
  .name-outer{
    height: 28px;
  }
  .description-outer{
    height: 60px;
    line-height: 24px;

  }
  .flex{
    display: flex;
  }
  .flex1{
    flex: 1;
  }
  input{
    line-height: 24px;
    padding: 0 5px;
    box-sizing: border-box;
    border: 1px solid #efefef;
  }
  textarea{
    padding: 5px;
    border-color: #efefef;
    box-sizing: border-box;
    line-height: 16px;
    height: 60px;
    resize:none;
  }
}
.moveIcon{
  width: 28px;
  height: 28px;
  position: absolute;
  top: 28px;
  right: 10px;
  font-size: 28px;
  color: #999;
  display: inline-block;
  cursor: pointer;
}
.moveNext{
  top: 60px;
}
.moveIcon:hover {
  color: #34A853;
}
li:last-child .moveNext, li:first-child .movePrev{
  cursor: default;
  color: #ddd;
}
li:last-child .moveNext:hover, li:first-child .movePrev:hover{
  cursor: default;
  color: #ddd;
}
</style>
