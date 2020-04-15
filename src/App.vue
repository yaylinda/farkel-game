<template>
  <div id="app">
    <div class="game-header-section">
      <md-toolbar class="farkel-header-toolbar md-primary">
        <h1 class="md-title">Farkel</h1>
        <a href="/rules.pdf" target="_blank">
          <md-icon>
            <md-tooltip md-direction="left">Rules (Reardon edition)</md-tooltip>
            <i class="fa fa-file-pdf-o"/>
          </md-icon>
        </a>
      </md-toolbar>
    </div>

    <router-view/>
  </div>
</template>

<style lang="scss">
.farkel-header-toolbar {
  display: flex;
  justify-content: space-between;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
}
</style>
