<template>
  <v-container>
    <v-row align-content="center" justify="center">
      <v-col cols="12" sm="6">
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
    <v-row align-content="center" justify="center" v-if="weatherData">
      <v-col cols="12" sm="6">
        <weather-card :loading="loading" :weather-data="weatherData"/>
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

import WeatherCard from '@/components/WeatherCard';

export default {
  name: 'Home',
  components: { WeatherCard },
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
  },
  watch: {
    '$i18n.locale': {
      handler() {
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
