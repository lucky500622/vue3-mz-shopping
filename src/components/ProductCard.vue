<script setup></script>

<template>
  <div class="mian-box">
    <div class="product-cart">
      <div class="pic"><slot name="proimg"></slot></div>
      <div class="txt">
        <div class="pro-name"><slot name="proname"></slot></div>
        <div class="price"><span>￥</span><slot name="proprice"></slot></div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.product-cart {
  width: 170px;
  border-radius: 7px;
  background-color: #fff;
  .pic {
    display: flex;
    width: 170px;
    height: 170px;
    border-radius: 7px;
    overflow: hidden;
  }
  .txt {
    display: flex;
    flex-direction: column;
    width: 170px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    font-weight: 700;
    font-family:
      'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    padding: 10px 10px 7px;
    word-break: break-all;
    .pro-name {
      line-height: 20px;
      font-size: 14px;
      color: rgb(66, 66, 66);
    }
    .price {
      align-self: flex-end;
      line-height: 23px;
      font-size: 18px;
      color: rgb(255, 119, 0);
      direction: rtl;
      font-family: none;
      span {
        font-size: 14px;
        color: rgb(255, 119, 0);
      }
    }
  }
}
</style>
