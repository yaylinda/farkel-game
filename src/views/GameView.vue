<template>
  <div class="game-view">
    <div class="game-header-section">
      <md-toolbar>
        <h3 class="md-title">Farkel Game</h3>
      </md-toolbar>
    </div>

    <div class="game-content-section">
      <div v-if="loading" class="game-loading-spinner">
        <md-progress-spinner 
            :md-diameter="100" 
            :md-stroke="10" 
            md-mode="indeterminate"
        />
      </div>

      <div v-if="!loading" class="game-data-section">
          <md-card class="md-primary">
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">
            <div>{{game.gameId}}</div>
            <div>Game Phase: {{game.gamePhase}}</div>
            </div>
          <div class="md-subhead">Your Game Master is: {{gameMaster}}</div>
        </md-card-header-text>
        </md-card-header>
        </md-card>
         
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {FARKLE_GAME_COOKIE, WAITING_GAME_PHASE} from '../utilities/Constants';
import { v4 as uuidv4 } from "uuid";
import { Game } from "../model/game.model";
import WaitingGame from '../components/WaitingGame.vue';

const HOST: string = "http://localhost:8080/farkel-backend";
const LOGGING_CLASS_NAME: string = "[GAME]";

@Component({
  components: {
    WaitingGame
  }
})
export default class GameView extends Vue {
  WAITING_PHASE_CONST: string = WAITING_GAME_PHASE;

  game!: Game;
  loading: boolean = true;

  get observers(): GameActor[] {
    const observers: GameActor[] = [];
    this.game.observersRoster.forEach((id: string) =>
      observers.push(this.game.actorsMap[id]!)
    );
    return observers;
  }

  get players(): GameActor[] {
    const players: GameActor[] = [];
    this.game.playersRoster.forEach(id =>
      players.push(this.game.actorsMap[id]!)
    );
    return players;
  }

  get gameMaster(): string {
    const gameMasterId = this.game.gameMasterPlayerId;
    const displayName = this.game.actorsMap[gameMasterId].displayName;
    return displayName ? displayName : '???';
  }

  mounted() {
    console.log(`${LOGGING_CLASS_NAME} - mounted`);

    const cookie = this._getOrSetCookie();

    this._getGameByGameIdAndCookieValue(cookie);
  }

  _getOrSetCookie(): string {
    let cookie = this.$cookies.get(FARKLE_GAME_COOKIE);
    console.log(`${LOGGING_CLASS_NAME} - mounted - using existing ${cookie}`);

    if (!cookie) {
      cookie = uuidv4();
      console.log(
        `${LOGGING_CLASS_NAME} - mounted - new cookie generated as ${cookie}`
      );
      this.$cookies.set(FARKLE_GAME_COOKIE, cookie);
    }

    return cookie;
  }

  _getGameByGameIdAndCookieValue(cookie: string): void {
    const url = `${HOST}/games/${this.$route.params.gameId}`;

    console.log(
      `${LOGGING_CLASS_NAME} - getGameByGameIdAndCookieValue - calling url=${url}, with cookie=${cookie}`
    );

    this.$http
      .get(url, {
        headers: {
          [FARKLE_GAME_COOKIE]: cookie
        }
      })
      .then(
        result => {
          if (result.ok && result.data) {
            console.log(
              `${LOGGING_CLASS_NAME} - getGameByGameIdAndCookieValue - successfully got game state`
            );
            this.game = result.data;
          } else {
            console.log(
              `${LOGGING_CLASS_NAME} - getGameByGameIdAndCookieValue - error getting game state`
            );
            throw new Error(JSON.stringify(result));
          }
          this.loading = false;
        },
        error => {
          // TODO - show error in a friendly way to user
          console.log(error);
        }
      );
  }
}
</script>

<style lang="scss" scoped>
.game-content-section {
  padding: 1rem;
}
</style>