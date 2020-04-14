<template>
  <div class="observers-list-component">
    <md-list>
      <md-subheader>Game Observers</md-subheader>

      <md-list-item v-if="amInList">
        <md-icon>
          <md-tooltip md-direction="top">You</md-tooltip>
          <i class="fa fa-user"></i>
        </md-icon>
        <span class="md-list-item-text">You are currently an observer</span>
        <md-button @click="joinGame" class="md-icon-button md-list-action">
          <md-tooltip md-direction="top">Join Game</md-tooltip>
          <md-icon class="md-primary">
            <i class="fa fa-plus-circle"></i>
          </md-icon>
        </md-button>
      </md-list-item>

      <md-divider class="md-inset"></md-divider>

      <md-list-item>
        <md-icon>
          <i class="fa fa-eye"></i>
        </md-icon>
        <span class="md-list-item-text">There are {{others.length}} other observers of this game</span>
      </md-list-item>
    </md-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Game, GameActor } from "../model/game.model";
import { VUE_EMITTED_ACTIONS } from "@/utilities/Constants";

@Component({
  components: {}
})
export default class ObserversList extends Vue {
  LOGGING_CLASS_NAME: string = "[ObserversList]";

  @Prop() actors!: GameActor[];
  @Prop() cookie!: string;

  get amInList(): boolean {
    return !!this.me;
  }

  get me(): GameActor | undefined {
    return this.actors.find(a => a.cookie === this.cookie);
  }

  get others(): GameActor[] {
    return this.actors.filter(a => a.cookie !== this.cookie);
  }

  joinGame(): void {
    console.log("clicked join game");
    console.log(this.me!.actorId);
    this.$emit(VUE_EMITTED_ACTIONS.JOIN_GAME, this.me!.actorId);
  }
}
</script>

<style lang="scss" scoped>
</style>