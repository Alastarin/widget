<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        Weather widget
      </div>

      <v-spacer></v-spacer>
      <v-btn-toggle
        color="primary"
        dense
        v-model="$i18n.locale"
      >
        <v-btn value="en">
          en
        </v-btn>
        <v-btn value="ru">
         ru
        </v-btn>
      </v-btn-toggle>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
