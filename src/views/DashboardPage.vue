<template>
  <v-container>
    <AltitudeObstacleChart :timeLabels="timeLabels" :altitudeData="altitude" :obstacleData="obstacles" />
  </v-container>
  <v-container>
    <RangeBarChart :items="rangeData" />
  </v-container>
  <v-container>
    <RangeBarChart2 :items="rangeData2" />
  </v-container>
  <v-container>
    <SensorOnOffChart
      :data="sensorTimelineChartData"
      :timeRange="timeRange"
      :missileRange="missileRange"
      :periodMs="60000"
    />
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AltitudeObstacleChart from '../components/AltitudeObstacleChart.vue'
import MyApexChart from '../components/MyApexChart.vue'
import RangeBarChart from '../components/RangeBarChart.vue'
import RangeBarChart2 from '../components/RangeBarChart2.vue'
import SensorOnOffChart from '../components/SensorOnOffChart.vue'

interface RangeBarItem {
  name: string;
  data: { x: string; y: [number, number] }[];
}

export default defineComponent({
  name: 'DashboardPage',
  components: { AltitudeObstacleChart, MyApexChart, RangeBarChart, RangeBarChart2, SensorOnOffChart },
  data() {
    const rangeData: RangeBarItem[] = [
      {
        name: 'フライト1',
        data: [
          { x: '離陸〜上昇', y: [0, 15] },
          { x: '巡航', y: [15, 30] },
          { x: '降下〜着陸', y: [30, 45] }
        ]
      },
      {
        name: 'フライト2',
        data: [
          { x: '離陸〜上昇', y: [5, 20] },
          { x: '巡航', y: [20, 40] },
          { x: '降下〜着陸', y: [40, 55] }
        ]
      }
    ];

    const missileStart = new Date('2025-06-01T09:00:00')
    const missileEnd = new Date('2025-06-01T10:30:00')

    const generateSensorPattern = (name: string, flightRanges: { start: Date; end: Date }[], intervalMs: number): RangeBarItem => {
      const data: { x: string; y: [number, number] }[] = []
      for (const { start, end } of flightRanges) {
        let toggle = true
        for (let t = start.getTime(); t < end.getTime(); t += intervalMs) {
          if (toggle) {
            data.push({ x: 'ON', y: [t, t + intervalMs] })
          }
          toggle = !toggle
        }
      }
      return { name, data }
    }

    const flightRanges = [
      { start: new Date('2025-06-01T10:00:00'), end: new Date('2025-06-01T10:15:00') },
      { start: new Date('2025-06-01T10:20:00'), end: new Date('2025-06-01T10:30:00') },
      { start: new Date('2025-06-01T10:35:00'), end: new Date('2025-06-01T10:45:00') }
    ]

    return {
      rangeData,
      timeLabels: ['00:00', '00:01', '00:02', '00:03', '00:04'],
      altitude: [100, 110, 105, 120, 115],
      obstacles: [30, 45, 50, 40, 35],
      chartSeries: [
        { name: '高度', data: [100, 120, 110, 130, 125] },
        { name: '障害物', data: [20, 25, 30, 22, 26] }
      ],
      rangeData2: [
        {
          name: 'フライト',
          data: [
            { x: 'Flight A', y: ['2025-06-01T10:00:00', '2025-06-01T10:15:00'] },
            { x: 'Flight B', y: ['2025-06-01T10:20:00', '2025-06-01T10:30:00'] },
            { x: 'Flight C', y: ['2025-06-01T10:35:00', '2025-06-01T10:45:00'] }
          ]
        }
      ],
      timeRange: {
        min: missileStart.getTime(),
        max: missileEnd.getTime()
      },
      missileRange: {
        start: missileStart.getTime(),
        end: missileEnd.getTime()
      },
      sensorTimelineChartData: {
        typeA: [generateSensorPattern('センサーA', flightRanges, 60000)],
        typeB: [generateSensorPattern('センサーB', flightRanges, 60000)],
        type3: [generateSensorPattern('センサー3', flightRanges, 60000)]
      }
    }
  }
})
</script>
