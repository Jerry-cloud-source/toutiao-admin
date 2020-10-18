<template>
  <div id="container" class="bmap"></div>
</template>

<script>
export default {
  name: 'BMap',
  mounted () {
    var map = new window.BMap.Map('container')
    var point = new window.BMap.Point(116.404, 39.915)
    map.centerAndZoom(point, 15)
  }
}
</script>

<style>
.bmap {
  width: 600px;
  height: 400px;
}
</style>
