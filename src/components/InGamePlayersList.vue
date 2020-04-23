<template>
  <div class="in-game-players-list-component">
    <md-list>
      <md-subheader>Players</md-subheader>

      <!-- List Row for each Player -->
      <md-list-item v-for="(p, i) in players" :key="(p, i)">
        <md-icon :style="{ color: p.color }">
          <i class="fa fa-child" />
        </md-icon>

        <div class="row md-list-item-text">
          <span class="data-name">{{p.displayName}} <span v-if="p.cookie === me.cookie">(You)</span></span>

          <span class="data-score">
            <md-chip class="data-chip">Score: {{p.score}}</md-chip> 
            <md-icon class="data-chip" :style="{ color: '#42b983' }" v-if="isTurn(p.actorId)">
              <i class="fa fa-circle" />
            </md-icon>
            <!-- <md-chip class="data-chip">On the board</md-chip>
            <md-chip class="data-chip">About to Win</md-chip>
            <md-chip class="data-chip">Score: {{p.score}}</md-chip> -->
          </span>
        </div>
      </md-list-item>
    </md-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Game, GameActor } from "@/model/game.model";
import { GAME_ACTIONS } from "@/utilities/Constants";

@Component({
  components: {}
})
export default class InGamePlayersList extends Vue {
  LOGGING_CLASS_NAME: string = "[InGamePlayersList]";

  @Prop() game!: Game;
  @Prop() me: GameActor | undefined;

  get players(): GameActor[] {
    const players = [];
    for (let pid of this.game.playersOrder) {
      players.push(this.game.actorsMap[pid]);
    }
    return players;
  }

  isTurn(playerId: string): boolean {
    return playerId === this.game.currentTurnPlayerId;
  }

  isAboutToWin(playerId: string): boolean {
    return playerId === this.game.aboutToWinPlayerId;
  }

  isOnBoard(playerScore: number): boolean {
    return playerScore >= this.game.gameConfiguration.pointsToGetOnBoard;
  }
}
</script>

<style lang="scss" scoped>
.my-turn {
  color: #42b983;
}
.row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.score {
  text-align: right;
}
.data-name {
  flex: 0.8;
}
.data-score {
  flex: 0.2;
  display: flex;
  flex-direction: row;
}
.data-chip {
  height: 1rem;
  text-align: center;
}
</style>