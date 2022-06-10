<template>

<div>
<h3>Babylon Examples</h3>
<canvas></canvas>

</div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BOMBAKLATT } from '@/BabylonExamples/BOMBAKLATT';

export default defineComponent({
  name: 'BabylonExamples',
  mounted(){
    const canvas = document.querySelector("canvas")!;
    new BOMBAKLATT(canvas);
  }
  
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

canvas {
width:90%;
height:90%;

}

</style>
