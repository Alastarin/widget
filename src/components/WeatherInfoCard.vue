<template functional>
  <v-card class="rounded-xl fill-height" outlined>
    <v-card-text class="text-center">
      <v-row justify="center">
        <v-col cols="12">
          <slot name="icon">
            <v-icon>mdi-cloud-download</v-icon>
          </slot>
        </v-col>
        <v-col cols="12">
        <slot name="title">
          N/A
        </slot>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: 'weather-info-card',

};
</script>
