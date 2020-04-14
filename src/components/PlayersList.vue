<template>
  <div class="players-list-component">
    <md-list class="md-double-line">
      <md-subheader>Game Players</md-subheader>
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
export default class PlayersList extends Vue {
  LOGGING_CLASS_NAME: string = "[PlayersList]";

  @Prop() players!: GameActor[];

  constructor() {
    super();
    console.log(`${this.LOGGING_CLASS_NAME} - constructor`);
  }
}
</script>

<style lang="scss" scoped>

</style>