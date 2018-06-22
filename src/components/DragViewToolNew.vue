<template>
  <div class="drag-page">
    <div id="canvas" class="hidEl"></div>
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
          <input @keyup="nl2br(item.inputval, $index, 'inputval')" @focus="focusInput" @blur="blurInput" type="text" class="input name flex1" value="{{item.inputval}}" v-model="item.inputval" placeholder="请输入项目名称"/>
        </p>
        <p class="description-outer flex">
          <label>{{item.textname}}:</label>
          <textarea @keyup="nl2br(item.textval, $index, 'textval')" @focus="focusInput" @blur="blurInput" class="textarea description flex1" v-model="item.textval" placeholder="请输入项目内容">{{item.textval}}</textarea>
        </p>
        <a v-if="hideBf" class="iconfont icon-up moveIcon movePrev" @click.stop="movePrev($index)"></a>
        <a v-if="hideBf" class="iconfont icon-down moveIcon moveNext" @click.stop="moveNext($index)"></a>
      </li>
    </ul>
    <div class="op-outer">
      <div class="tc btn-op">
        <button class="btn" id="addBtn" @click="addItem()">新增</button>
        <button class="btn" id="deleteBtn" @click="deleteItem()">删除</button>
        <button class="btn" id="viewImageBtn" @click="viewImage($event)">预览</button>
        <button class="btn" id="downloadImageBtn" @click="downloadImage($event)">下载</button>
      </div>
    </div>
    <popup :show.sync="popshow" height="100%">
      <div class="imgPop">
        <img alt="from canvas" id="showImg"/>
        <a class="iconfont icon-close closePop" @click="hidePop()"></a>
      </div>
    </popup>
  </div>

  <div class="read-page" id="drawImg">
    <ul class="read-content" :style="{width: wH + 'px'}">
      <li v-for="item in changeData" v-show="!!item.isShow">
        <div class="read-outer clearfix">
          <div class="read fl">
            <p class="num">0{{$index + 1}}</p>
            <p class="readn bdb">{{{item.inputval}}}</p>
          </div>
          <p class="readp bdb fl">{{{item.textval}}}</p>
        </div>
      </li>
    </ul>
  </div>

</template>
<script>
/* eslint-disable no-new */
  import { Popup } from 'vux/src/components'
  export default {
    data () {
      return {
        loggedEvent: '',
        defaultData: [
          {'id': 0, 'inputname': '名称', 'inputval': '', 'textname': '内容', 'textval': '', 'isShow': 1},
          {'id': 1, 'inputname': '名称', 'inputval': '', 'textname': '内容', 'textval': '', 'isShow': 1},
          {'id': 2, 'inputname': '名称', 'inputval': '', 'textname': '内容', 'textval': '', 'isShow': 1}
        ],
        changeData: {},
        idx: -1,
        bg: -1,
        ob: {},
        popshow: false,
        hideBf: true,
        wH: '1000',
        dragList: []  // 拖拽列表
      }
    },
    components: {
      Popup
    },
    methods: {
      nl2br: function (str, idx, tag, isXhtml) {
        let blankTag = '&nbsp;'
        let breakTag = (isXhtml || typeof isXhtml === 'undefined') ? '<br />' : '<br>'
        let newStr = (str + '').replace(/([^>\s]?)(\s)/g, '$1' + blankTag + '$2')
        newStr = (newStr + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2')
        if (tag) {
          this.changeData[idx][tag] = newStr
        }
        return newStr
      },
      // 隐藏pop
      hidePop: function () {
        this.popshow = false
        document.documentElement.style.overflowY = 'scroll'
      },
      // 选中元素删除
      choose: function (idx) {
        this.idx = idx
      },
      // 添加列
      addItem: function () {
        let len = this.defaultData.length
        let newline = {'id': len, 'inputname': '名称', 'inputval': '', 'textname': '内容', 'textval': '', 'isShow': 1}
        this.defaultData.push(newline)
        this.default2change()
        this.dragList = document.getElementsByClassName('dragEl')
      },
      // 删除列
      deleteItem: function () {
        if (this.idx < 0) {
          return false
        }
        this.defaultData[this.idx].isShow = 0
        this.default2change()
        this.dragList = document.getElementsByClassName('dragEl')
      },
      handleDragStart: function (elem) {
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
          this.default2change()
        }
      },
      // 拖拽事件
      handleDrag: function (elem) {
        this.loggedEvent = 'handleDrag'
      },
      // 文本信息画成canvas
      draw: function (callback) {
        if (this.idx !== -1) {
          document.getElementById(this.idx).className = 'dragEl'
          this.idx = -1
        }
        let y = document.body.scrollTop || document.documentElement.scrollTop || 0
        window.scrollTo(0, 0)
        window.html2canvas(document.querySelector('#drawImg'), {allowTaint: false, taintTest: false}).then(function (canvas) {
          this.ob.innerHTML = ''
          this.ob.appendChild(canvas)
          window.scrollTo(0, y)
          callback && callback()
        }.bind(this))
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
        let mycanvas = this.ob.firstChild
        let image = mycanvas.toDataURL('image/png')
        document.documentElement.style.overflowY = 'hidden'
        this.popshow = true
        let w = mycanvas.width * 0.5
        let h = mycanvas.height * 0.5
        let img = document.getElementById('showImg')
        img.src = image
        img.height = h
        img.w = w
      },
      // 存为本地图片
      saveAsLocalImage: function () {
        let myCanvas = this.ob.firstChild
        let image = myCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
        window.location.href = image
      },
      // 预览图片
      viewImage: function () {
        this.draw(function () {
          this.saveImageInfo()
        }.bind(this))
      },
      // 下载图片
      downloadImage: function () {
        this.draw(function () {
          this.saveAsLocalImage()
        }.bind(this))
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
        this.default2change()
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
        this.default2change()
      },
      default2change: function () {
        this.changeData = JSON.parse(JSON.stringify(this.defaultData))
        for (let i = 0, len = this.changeData.length; i < len; i++) {
          this.changeData[i].inputval = this.nl2br(this.changeData[i].inputval)
          this.changeData[i].textval = this.nl2br(this.changeData[i].textval)
        }
      },
      // 解决拖拽与复制之间的冲突
      disableDrag (op) {
        console.log(op)
        const len = this.dragList.length
        for (let i = 0; i < len; i++) {
          this.dragList[i].setAttribute('draggable', op)
        }
      },
      focusInput () {
        this.disableDrag(false)
      },
      blurInput () {
        this.disableDrag(true)
      }
    },
    ready () {
      this.wH = window.innerWidth
      this.dragList = document.getElementsByClassName('dragEl')
      console.log(this.wH)
      this.ob = document.getElementById('canvas')
      this.default2change()
    }
  }
</script>
<style lang="scss">
  @import '../style/common.scss';
  body{
    position: relative;
  }
.drag-page{
  width: 100%;
  margin-top: 70px;
  font-size: 12px;
  padding: 20px;
  background-color: #fff;
  position: relative;
  box-sizing: border-box;
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
    line-height: 24px;
  }
  .flex{
    display: flex;
  }
  .flex1{
    flex: 1;
  }
  .text-read{
    height: auto;
    .textarea, .input{
      height: auto;
      border: 0 none;
    }
  }
  .input{
    line-height: 24px;
    padding: 0 5px;
    box-sizing: border-box;
    border: 1px solid #efefef;
    display: inline-block;
  }
  .textarea{
    padding: 5px;
    border-color: #efefef;
    box-sizing: border-box;
    line-height: 16px;
    height: 60px;
    resize:none;
    display: inline-block;
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
.imgPop{
  position: relative;
  overflow: hidden;
  text-align: center;
  padding: 20px;
}
.vux-popup-dialog{
  overflow-y: scroll;
  background: rgba(0, 0, 0, 0.2);
}
.closePop{
  position: fixed;
  z-index: 9999;
  cursor: pointer;
  font-size: 50px;
  animation: flicker 1s infinite;
  top: 0;
  right: 20px;
}
@keyframes flicker {
  0%{color: green;font-size: 50px;top: 5px; right: 25px;}
  100%{color: red; font-size: 60px;}
}
@keyframes rotate {
  0%{color: green;transform: rotate(0deg)}
  25%{color: green;transform: rotate(90deg)}
  100%{color: red;transform: rotate(0deg)}
}
.closePop:hover{
  color: red;
  animation: none;
  font-size: 60px;
  animation: rotate 2s 1;
}
.hidEl{
  position: fixed;
  top: -20000px;
  left: -20000px;
}
.op-outer{
  position: fixed;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
}
.btn-op{
  width: 100%;
  background-color: #fff;
  margin: 0 auto;
  padding: 20px;
}
.read-page{
  overflow: hidden;
  background-color: #fff;
  font-family: '微软雅黑', "Helvetica Neue", Helvetica, Arial, sans-serif;
  margin-top: 1000px;
  padding: 20px;
  display: flex;
  box-sizing: border-box;
  .read-outer{
    overflow: hidden;
    display: flex;
  }
  .read{
    width: 200px;
    margin-right: 100px;
    vertical-align: top;
    display: flex;
    flex-direction: column;
  }
  .num{
    font-size: 100px;
    font-weight: bold;
    color: #74756f;
    height: 160px;
    font-family: -webkit-pictograph;
  }
  .readn{
    font-size: 48px;
    height: 80px;
    color: #757672;
    padding-bottom: 80px;
    flex: 1;
  }
  .readp{
    display: inline-block;
    min-height: 80px;
    line-height: 80px;
    padding: 160px 0 80px 0;
    font-size: 32px;
    flex: 1;
  }
  .bdb{
    border-bottom: 2px solid #dadbd6;
    padding-left: 20px;
  }
}
</style>
