<template>
  <div class="go-to-game">

    <md-field>
      <label>Farkel Game ID</label>
      <md-input v-model="gameId"></md-input>
      <span class="md-helper-text">Enter the ID of a Farkel Game to go to. If it doesn't exit, we'll create it!</span>
    </md-field>

    <md-button 
        @click="navigateToGame" 
        class="md-raised md-primary" 
        :disabled="!gameId"
    >Go To Game</md-button>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class GoToGame extends Vue {

    LOGGING_CLASS_NAME: string = '[GOTOGAME]';

    gameId: string = '';

    navigateToGame() {
        this.$router.push({ path: `/games/${this.gameId}`});
    }
}
</script>

<style lang="scss" scoped>

</style>