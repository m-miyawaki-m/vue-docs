<template>
  <apexchart
    type="line"
    height="300"
    :options="chartOptions"
    :series="series"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

export default defineComponent({
  name: 'MyApexChart',
  components: {
    apexchart: VueApexCharts
  },
  props: {
    categories: {
      type: Array as () => string[],
      required: true
    },
    dataSeries: {
      type: Array as () => { name: string; data: number[] }[],
      required: true
    }
  },
  data() {
    return {
      chartOptions: {
        chart: {
          id: 'basic-line',
          zoom: { enabled: false }
        },
        xaxis: {
          categories: this.categories
        },
        yaxis: {
          title: { text: '値' }
        },
        stroke: {
          curve: 'smooth'
        },
        tooltip: {
          shared: true
        }
      }
    }
  },
  computed: {
    series() {
      return this.dataSeries
    }
  }
})
</script>