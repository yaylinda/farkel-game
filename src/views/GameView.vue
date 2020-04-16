<template>
  <div class="game-view">
    <GoToGame v-if="!$route.params.gameId" />

    <div v-else class="game-content-section">
      <div v-if="loading" class="game-loading-spinner">
        <md-progress-spinner :md-diameter="100" :md-stroke="10" md-mode="indeterminate" />
      </div>

      <div v-if="!loading" class="game-data-section">
        <md-card class="md-primary">
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">
                <div>{{game.gameId}}</div>
              </div>
              <div class="md-subhead">
                <div>Game Phase: {{game.gamePhase}}</div>
                <div>{{gameMasterStatement}}</div>
              </div>
            </md-card-header-text>
          </md-card-header>
        </md-card>

        <!-- Board Layout of the WAITING phase -->

        <div v-if="game.gamePhase === 'WAITING'">
          <PlayersList 
            @doGameAction="doGameAction" 
            :actors="players" 
            :cookie="cookie" 
            :numObservers="observers.length"
          />
          <div v-if="isGameMaster">
            <md-tooltip
              v-if="!isStartGameEnabled"
            >Need at least {{game.gameConfiguration.minNumPlayers}} Players to be ready</md-tooltip>
            <md-button
              :disabled="!isStartGameEnabled"
              @click="showConfirmStartGameDialog = true"
              class="md-raised md-primary"
            >Start Game</md-button>
          </div>
          <md-dialog-confirm
            :md-active.sync="showConfirmStartGameDialog"
            md-title="Confirm Start Game"
            md-content="This will start the Farkel Game with all the Ready Players"
            @md-confirm="doGameAction('START_GAME', null, false)"
          />
        </div>

        <!-- Board Layout of the PLAYING phase -->

        <div v-else-if="game.gamePhase === 'PLAYING'">
          <InGamePlayersList :game="game" :me="me" />
          <GameState :game="game" :me="me" />
        </div>

        <!-- Board UI Layout for COMPLETED state -->
        <div v-else-if="game.gamePhase === 'COMPLETED'">

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  FARKLE_GAME_COOKIE,
  GAME_ACTIONS,
  HTTP_METHODS
} from "@/utilities/Constants";
import { v4 as uuidv4 } from "uuid";
import { Game, GameActor, GameActionLogEntry } from "@/model/game.model";
import ActionHistoryList from "@/components/ActionHistoryList.vue";
import InGamePlayersList from "@/components/InGamePlayersList.vue";
import PlayersList from "@/components/PlayersList.vue";
import ActionsBar from "@/components/ActionsBar.vue";
import GoToGame from "@/components/GoToGame.vue";
import GameState from "@/components/GameState.vue";
import { HttpOptions, HttpResponse } from "vue-resource/types/vue_resource";

const HOST: string = "http://localhost:8080/farkel-backend";
const LOGGING_CLASS_NAME: string = "[GAME]";

@Component({
  components: {
    GoToGame,
    ActionHistoryList,
    InGamePlayersList,
    PlayersList,
    ActionsBar,
    GameState
  }
})
export default class GameView extends Vue {
  game: Game = new Game();
  cookie: string = "";
  headers: any = {};
  loading: boolean = true;

  showConfirmStartGameDialog: boolean = false;

  // COMPUTED GETTERS

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

  get actions(): GameActionLogEntry[] {
    const actions: GameActionLogEntry[] = [];
    return this.game.actionLogs;
  }

  get me(): GameActor | undefined {
    for (let actorId of Object.keys(this.game.actorsMap)) {
      let actor = this.game.actorsMap[actorId];
      if (actor.cookie === this.cookie) {
        return actor;
      }
    }
  }

  get isGameMaster(): boolean {
    return this.me!.actorId === this.game.gameMasterPlayerId;
  }

  get gameMasterStatement(): string {
    if (this.isGameMaster) {
      return "You are the GameMaster";
    }

    if (!this.game.gameMasterPlayerId) {
      return "Your GameMaster is ???";
    }

    const gameMaster = this.game.actorsMap[this.game.gameMasterPlayerId];
    const gameMasterDisplayName = gameMaster.displayName
      ? gameMaster.displayName
      : "???";

    return `Your GameMaster is ${gameMasterDisplayName}`;
  }

  get isMyTurn(): boolean {
    return this.me!.actorId === this.game.currentTurnPlayerId;
  }

  get isStartGameEnabled(): boolean {
    let numReady = 0;
    for (let playerId of this.game.playersRoster) {
      let player = this.game.actorsMap[playerId];
      if (player.playerReady) {
        numReady += 1;
      }
    }
    return numReady >= this.game.gameConfiguration.minNumPlayers;
  }

  // VUE COMPONENT LIFECYCLE METHODS

  mounted() {
    console.log(`${LOGGING_CLASS_NAME} - mounted`);
    this.initializeCookieAndHeaders();
    this.getGame(
      HTTP_METHODS.GET,
      `${HOST}/games/${this.$route.params.gameId}`,
      null
    );
  }

  // ACTION HANDLERS

  doGameAction(gameAction: string, metadata: any, isPreview: boolean, previousAction: any) {
    console.log(
      `${LOGGING_CLASS_NAME} doGameAction: gameAction=${gameAction}, metadata=${JSON.stringify(
        metadata
      )}, isPreview=${isPreview}`
    );
    const url = `${HOST}/games/${this.$route.params.gameId}/actions/${
      this.me!.actorId
    }`;

    const body = {
      actorId: this.me!.actorId,
      gameAction: gameAction,
      metadata: metadata,
      isPreview: isPreview,
      lastPreviewedActionRequest: this.game.lastPreviewedActionRequest,
    };

    this.getGame(HTTP_METHODS.PUT, url, body);
  }

  // HELPER METHODS

  initializeCookieAndHeaders() {
    this.cookie = this.$cookies.get(FARKLE_GAME_COOKIE);
    console.log(
      `${LOGGING_CLASS_NAME} - mounted - using existing cookie ${this.cookie}`
    );

    if (!this.cookie) {
      this.cookie = uuidv4();
      console.log(
        `${LOGGING_CLASS_NAME} - mounted - new cookie generated as ${this.cookie}`
      );
      this.$cookies.set(FARKLE_GAME_COOKIE, this.cookie);
    }

    this.headers = {
      [FARKLE_GAME_COOKIE]: this.cookie
    };
  }

  getGame(httpMethod: string, url: string, body: any | undefined) {
    console.log(
      `${LOGGING_CLASS_NAME} - [${httpMethod}] url=${url}, cookie=${
        this.cookie
      }, body=${JSON.stringify(body)}`
    );

    this.loading = true;

    let protocol: PromiseLike<HttpResponse> | null = null;

    if (httpMethod === HTTP_METHODS.GET) {
      protocol = this.$http.get(url, { headers: this.headers });
    } else if (httpMethod === HTTP_METHODS.PUT) {
      protocol = this.$http.put(url, body, { headers: this.headers });
    }

    if (!protocol) {
      console.error("Unknown or unimplemented http method: " + httpMethod);
      this.loading = false;
    }

    protocol!.then(
      result => {
        if (result.ok && result.data) {
          console.log(`${LOGGING_CLASS_NAME} - getGame - SUCCESS`);
          this.game = result.data;
        } else {
          console.log(`${LOGGING_CLASS_NAME} - getGame - ERROR`);
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

.submit {
  color: #4caf50;
}
</style>