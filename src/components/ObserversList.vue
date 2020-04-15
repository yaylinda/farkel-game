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
        <md-button @click="showDisplayNamePrompt = true" class="md-icon-button md-list-action">
          <md-tooltip md-direction="top">Join Game</md-tooltip>
          <md-icon class="md-primary">
            <i class="fa fa-plus-circle"></i>
          </md-icon>
        </md-button>

        <md-divider class="md-inset"></md-divider>
      </md-list-item>

      <md-list-item>
        <md-icon>
          <i class="fa fa-eye"></i>
        </md-icon>
        <span class="md-list-item-text">There are {{others.length}} other observers of this game</span>
      </md-list-item>
    </md-list>

    <md-dialog-prompt
      @md-confirm="confirmJoinGame"
      @md-cancel="cancelJoinGame"
      :md-active.sync="showDisplayNamePrompt"
      v-model="displayNameInput"
      md-title="What is your name?"
      md-input-placeholder="Type your name..."
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Game, GameActor } from "@/model/game.model";
import { GAME_ACTIONS } from "@/utilities/Constants";

@Component({
  components: {}
})
export default class ObserversList extends Vue {
  LOGGING_CLASS_NAME: string = "[ObserversList]";

  @Prop() actors!: GameActor[];
  @Prop() cookie!: string;

  showDisplayNamePrompt: boolean = false;
  displayNameInput: string = '';

  get amInList(): boolean {
    return !!this.me;
  }

  get me(): GameActor | undefined {
    return this.actors.find(a => a.cookie === this.cookie);
  }

  get others(): GameActor[] {
    return this.actors.filter(a => a.cookie !== this.cookie);
  }

  cancelJoinGame(): void {
    this.showDisplayNamePrompt = false;
    this.displayNameInput = '';
  }

  confirmJoinGame(): void {
    if (this.displayNameInput){
      this.$emit('doGameAction', GAME_ACTIONS.JOIN_AS_PLAYER, { displayName: this.displayNameInput });
      this.showDisplayNamePrompt = false;
    } else {
      this.showDisplayNamePrompt = true;
    }
    this.displayNameInput = '';
  }
}
</script>

<style lang="scss" scoped>
</style>