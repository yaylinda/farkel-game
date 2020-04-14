<template>
  <div class="observers-list-component">
    <md-list class="md-double-line">
      <md-subheader>Game Observers</md-subheader>
      <md-list-item>


      </md-list-item>
    </md-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Game, GameActor } from "../model/game.model";

@Component({
  components: {}
})
export default class ObserversList extends Vue {
  LOGGING_CLASS_NAME: string = "[ObserversList]";

  @Prop() observers!: GameActor[];

  constructor() {
    super();
    console.log(`${this.LOGGING_CLASS_NAME} - constructor`);
  }
}
</script>

<style lang="scss" scoped>

</style>