<template>
  <div class="players-list-component">
    <md-list class="md-double-line">
      <md-subheader>Game Players ( {{numReady}} / {{actors.length}} ready )</md-subheader>
      <md-list-item v-if="amInList">
        <md-icon>
          <i class="fa fa-user"></i>
        </md-icon>

        <div class="md-list-item-text">
          <span>{{me.displayName}} (You)</span>
          <span>{{me.isPlayerReadyToStart ? 'Ready' : 'Not Ready'}}</span>
        </div>

        <md-button :disabled="me.isPlayerReadyToStart" @click="readyToPlay" class="md-icon-button md-list-action">
          <md-tooltip v-if="!me.isPlayerReadyToStart" md-direction="top">I'm ready to play!</md-tooltip>
          <md-icon class="md-primary">
            <i class="fa fa-play"></i>
          </md-icon>
        </md-button>
      </md-list-item>

      <md-list-item v-for="(p, i) in others" :key="(p, i)">
        <md-icon>
          <i class="fa fa-child"></i>
        </md-icon>

        <div class="md-list-item-text">
          <span>{{p.displayName}}</span>
          <span>{{p.isPlayerReadyToStart ? 'Ready' : 'Not Ready'}}</span>
        </div>

      </md-list-item>
    </md-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Game, GameActor } from "@/model/game.model";
import { VUE_EMITTED_ACTIONS } from "@/utilities/Constants";

@Component({
  components: {}
})
export default class PlayersList extends Vue {
  LOGGING_CLASS_NAME: string = "[PlayersList]";

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

  get numReady(): number {
    return this.actors.filter(a => a.isPlayerReadyToStart).length;
  }

  readyToPlay(): void {
    console.log('clicked readyToPlay');
    console.log(this.me!.actorId);
    this.$emit(VUE_EMITTED_ACTIONS.READY_TO_START, this.me!.actorId);
  }
}
</script>

<style lang="scss" scoped>

</style>