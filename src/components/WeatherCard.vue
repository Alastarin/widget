<template>
  <v-card
    class="rounded-xl overflow-hidden">
    <v-overlay :value="loading" absolute>
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="text-h5">
          {{ weather.city }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-capitalize">{{
            weather.currentState.description
          }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-card-text>
      <v-row align="center">
        <v-col
          class="text-h2"
          cols="6"
        >
          {{ weather.temp }}&deg;C
        </v-col>
        <v-col cols="6">
          <v-img max-height="62"
                 contain
                 :src="`http://openweathermap.org/img/wn/${weather.currentState.icon}@2x.png`"></v-img>
        </v-col>
      </v-row>
      <v-row justify="space-between">
        <v-col cols="auto">{{ $t('feelsTemp') }}</v-col>
        <v-col cols="auto">{{ weather.tempFeelsLike }}&deg;C</v-col>
      </v-row>
      <v-row justify="space-between">
        <v-col cols="auto">{{ $t('minTemp') }}</v-col>
        <v-col cols="auto">{{ weather.tempMin }}&deg;C</v-col>
      </v-row>
      <v-row justify="space-between">
        <v-col cols="auto">{{ $t('maxTemp') }}</v-col>
        <v-col cols="auto">{{ weather.tempMax }}&deg;C</v-col>
      </v-row>
    </v-card-text>

    <v-divider></v-divider>
    <v-container>
      <v-row>
        <v-col>
          <weather-info-card>
            <template #icon>
              <v-icon>mdi-weather-windy</v-icon>
            </template>
            <template #title>
              {{ weather.wind.speed }} {{ $t('windMetric') }}
            </template>
          </weather-info-card>
        </v-col>
        <v-col>
          <weather-info-card>
            <template #icon>
              <v-icon :style="`transform:rotate(${weather.wind.direction}deg)`">mdi-arrow-up</v-icon>
            </template>
            <template #title>
              {{ weather.wind.direction }}&deg;
            </template>
          </weather-info-card>
        </v-col>
        <v-col>
          <weather-info-card>
            <template #icon>
              <v-icon>mdi-cloud-download</v-icon>
            </template>
            <template #title>
              {{ weather.clouds }}%
            </template>
          </weather-info-card>
        </v-col>
      </v-row>
    </v-container>

    <v-list>
      <v-list-item
        v-for="item in weather.weatherState"
        :key="item.id"
      >
        <v-list-item-content>
          <v-list-item-title class="text-capitalize">{{ item.description }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon>
          <v-img max-height="62" :src="`http://openweathermap.org/img/wn/${item.icon}@2x.png`"></v-img>
        </v-list-item-icon>

      </v-list-item>
    </v-list>

    <v-divider></v-divider>

  </v-card>
</template>
<script>
import WeatherInfoCard from '@/components/WeatherInfoCard';

export default {
  name: 'weather-card',
  components: { WeatherInfoCard },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    weatherData: {
      type: Object,
      required: true
    }
  },
  computed: {
    weather() {
      if (!this.weatherData) {
        return null;
      }
      return {
        city: this.weatherData?.name,
        temp: ~~this.weatherData?.main?.temp,
        tempFeelsLike: ~~this.weatherData?.main?.feels_like,
        tempMax: ~~this.weatherData?.main?.temp_max,
        tempMin: ~~this.weatherData?.main?.temp_min,
        weatherState: this.weatherData?.weather,
        currentState: this.weatherData?.weather?.[0],
        clouds: this.weatherData?.clouds?.all,
        wind: {
          speed: +this.weatherData?.wind?.speed.toFixed(1),
          direction: this.weatherData?.wind?.deg
        }
      };
    },
  },
  methods: {
    findSideOfWorld(value) {
      switch (value) {

      }
    }
  },

};
</script>
<style lang="scss" scoped>
.compass {
  position: relative;
  display: flex;
  width: 64px;
  height: 64px;
  border-radius: 50%;

  .arrow {
    position: absolute;
    width: 0;
    height: 0;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    border-style: solid;
    border-width: 15px 10px 0 10px;
    border-color: red transparent transparent transparent;
    z-index: 1;
  }
}

</style>
