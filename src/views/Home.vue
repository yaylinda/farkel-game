<template>
  <div class="home-header-section">
    <md-toolbar>
      <h3 class="md-title">Farkel Game</h3>
    </md-toolbar>

    <div class="home-content-section">
      <GoToGame></GoToGame>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GoToGame from "@/components/GoToGame.vue";

@Component({
  components: {
    GoToGame
  }
})
export default class Home extends Vue {
  LOGGING_CLASS_NAME: string = "[HOME]";

  constructor() {
    super();
    console.log(`${this.LOGGING_CLASS_NAME} - constructor`);
  }
}
</script>

<style lang="scss" scoped>
.home-content-section {
  padding: 1rem;
}
</style>