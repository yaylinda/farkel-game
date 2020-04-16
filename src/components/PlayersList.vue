<template>
  <div class="players-list-component">
    <md-list class="md-double-line">
      <md-subheader>Game Lobby ( {{numReady}} / {{actors.length}} ready ) (<i class="fa fa-eye" />{{numObservers}} )</md-subheader>
      
      <!-- List Row for Current User (YOU) -->
      <md-list-item v-if="amInList">
        <md-icon :style="{ color: me.color }">
          <i v-if="me.playerReady" class="fa fa-child" />
          <i v-else class="fa fa-user" />
        </md-icon>

        <div class="md-list-item-text">
          <span>{{me.displayName}} (You)</span>
          <span>{{me.playerReady ? 'Ready' : 'Not Ready'}}</span>
        </div>

        <md-button v-if="!me.playerReady" @click="readyToPlay" class="md-icon-button md-list-action">
          <md-tooltip md-direction="top">Press to let others know you're ready to start the game</md-tooltip>
          <md-icon class="md-primary">
            <i class="fa fa-play"/>
          </md-icon>
        </md-button>
      </md-list-item>

      <!-- List Row for each Player -->
      <md-list-item v-for="(p, i) in others" :key="(p, i)">
        <md-icon :style="{ color: p.color }">
          <i v-if="p.playerReady" class="fa fa-child" />
          <i v-else class="fa fa-user" />
        </md-icon>

        <div class="md-list-item-text">
          <span>{{p.displayName}}</span>
          <span>{{p.playerReady ? 'Ready' : 'Not Ready'}}</span>
        </div>

      </md-list-item>
    </md-list>

    <!-- Button to Join Game (if not Player) -->
    <div v-if="!amInList">
      <md-button @click="showDisplayNamePrompt = true" class="md-raised md-primary">
        Join Game
      </md-button>

    <md-dialog-prompt
      @md-confirm="confirmJoinGame"
      @md-cancel="cancelJoinGame"
      :md-active.sync="showDisplayNamePrompt"
      v-model="displayNameInput"
      md-title="What is your name?"
      md-input-placeholder="Type your name..."
    />
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Game, GameActor } from "@/model/game.model";
import { GAME_ACTIONS } from "@/utilities/Constants";

@Component({
  components: {}
})
export default class PlayersList extends Vue {
  LOGGING_CLASS_NAME: string = "[PlayersList]";

  @Prop() actors!: GameActor[]; // These are the "players"
  @Prop() cookie!: string;
  @Prop() numObservers!: number;

  showDisplayNamePrompt: boolean = false;
  displayNameInput: string = '';

  // COMPUTED GETTERS

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
    return this.actors.filter(a => a.playerReady).length;
  }

  // ACTION HANDLERS

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

  readyToPlay(): void {
    console.log('clicked readyToPlay');
    console.log(this.me!.actorId);
    this.$emit('doGameAction', GAME_ACTIONS.READY_TO_PLAY, {});
  }
}
</script>

<style lang="scss" scoped>
.fa-eye {
  padding-right: 5px;
  padding-left: 5px;
}

</style>