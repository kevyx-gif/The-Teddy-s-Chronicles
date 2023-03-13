<template>
  <div id="pixi-container"></div>
  <div v-if="showWarning" class="warning">
    <p>Tamaño no soportado. Por favor, aumente el tamaño de la pantalla (1280 x 720)</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showWarning: false
    }
  },
  mounted() {
  const width = 1280;
  const height = 720;

  const app = new this.PIXI.Application({ width, height });
  const container = document.getElementById('pixi-container');
  container.appendChild(app.view);

  window.addEventListener('resize', () => {
    if (window.innerWidth < width || window.innerHeight < height) {
      this.showWarning = true;
    } else {
      this.showWarning = false;
    }
  });

  if (window.innerWidth < width || window.innerHeight < height) {
    this.showWarning = true;
  }
},
}
</script>