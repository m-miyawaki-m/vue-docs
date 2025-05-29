<template>
  <apexchart
    type="rangeBar"
    height="400"
    :options="chartOptions"
    :series="series"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

export default defineComponent({
  name: 'RangeBarChart',
  components: { apexchart: VueApexCharts },
  props: {
    items: {
      type: Array as () => {
        name: string
        data: { x: string; y: [string, string] }[] // ISO日付文字列を使用
      }[],
      required: true
    }
  },
  data() {
    return {
      chartOptions: {
        chart: {
          type: 'rangeBar',
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        xaxis: {
          type: 'datetime',
          title: { text: '時間' }
        },
        tooltip: {
          x: {
            format: 'yyyy/MM/dd HH:mm'
          }
        }
      }
    }
  },
  computed: {
    series() {
      return this.items
    }
  }
})
</script>
