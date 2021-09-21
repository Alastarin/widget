<template>
  <v-container>
    <v-row align-content="center" justify="center">
      <v-col cols="12" sm="4">
        <v-combobox
          v-model="value"
          :items="items"
          :rules="[rules.required]"
          solo
          :hint="$t('cityHint')"
          :placeholder="$t('placeholderCity')"
          :label="$t('city')"
        >
        </v-combobox>
        <v-btn block color="primary" @click="getWeatherByCity(value)" :disabled="!value">
          {{ $t('search') }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row align-content="center" justify="center" v-if="weather">
      <v-col cols="12" sm="4">
        <v-card
          class="rounded-xl overflow-hidden"
        >
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

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-weather-windy</v-icon>
            </v-list-item-icon>
            <v-list-item-subtitle>{{ weather.wind.speed }} {{ $t('windMetric') }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-cloud-download</v-icon>
            </v-list-item-icon>
            <v-list-item-subtitle>{{ weather.clouds }}%</v-list-item-subtitle>
          </v-list-item>

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
      </v-col>

    </v-row>
    <v-snackbar
      color="error"
      v-model="snackbar"
      :timeout="timeout"
    >
      {{ $t('notExist', { entity: $t('city') }) }}

      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          {{ $t('close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>

export default {
  name: 'Home',

  data() {
    return {
      value: '',
      snackbar: false,
      timeout: 2000,
      items: [],
      loading: false,
      weatherData: null,
    };
  },
  computed: {
    rules() {
      return {
        required: value => !!value || this.$t('required')
      };
    },
    weather() {
      if (!this.weatherData){
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
  watch: {
    '$i18n.locale': {
      handler(val) {
        this.getWeatherByCity(this.value);
      },
    }
  },
  beforeMount() {
    this.getCitiesFromStorage();
  },
  methods: {
    handleBlur(event) {
      this.value = event.target.value.trim();
    },
    saveCitiesToStorage() {
      localStorage.setItem('cities', JSON.stringify(this.items));
    },
    getCitiesFromStorage() {
      let cities = localStorage.getItem('cities');
      if (cities) {
        this.items = JSON.parse(cities);
      }
    },
    async getWeatherByCity(city) {
      try {
        this.loading = true;
        let { data } = await this.$services.weather.get({
          params: {
            q: city,
            units: 'metric',
            lang: this.$i18n.locale
          }
        });
        if (data) {
          if (!this.items.includes(city) && city) {
            this.items.push(city);
          }
        }
        this.weatherData = data;
        this.saveCitiesToStorage();
      } catch (e) {
        this.weatherData = null;
        this.snackbar = true;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
