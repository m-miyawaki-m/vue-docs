<template>
  <v-container>
    <SensorOnOffChart
      :data="sensorTimelineChartData"
      :timeRange="timeRange"
      :missileRange="missileRange"
    />
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SensorOnOffChart from '../components/SensorOnOffChart.vue';

interface RangeBarItem {
  name: string;
  data: { x: string; y: [number, number] }[];
}

export default defineComponent({
  name: 'DashboardPage',
  components: { SensorOnOffChart },

  data() {
    // ミサイル発射〜着弾の想定時間範囲
    const missileStart = new Date('2025-06-01T09:00:00')
    const missileEnd = new Date('2025-06-01T10:50:00')

    // 単一のセンサー用 ON/OFF パターン生成
    const generateSensorPattern = (
      name: string,
      start: Date,
      end: Date,
      intervalMs: number
    ): RangeBarItem => {
      const data: { x: string; y: [number, number] }[] = []
      let toggle = true
      for (let t = start.getTime(); t < end.getTime(); t += intervalMs) {
        if (toggle) {
          data.push({ x: name, y: [t, t + intervalMs] })
        }
        toggle = !toggle
      }
      return { name, data }
    }

    // センサーのデータ生成
    const sensorTimelineChartData: Record<string, RangeBarItem> = {
      typeA: generateSensorPattern('type A', new Date('2025-06-01T10:00:00'), new Date('2025-06-01T10:15:00'), 60000),
      typeB: generateSensorPattern('type B', new Date('2025-06-01T10:20:00'), new Date('2025-06-01T10:30:00'), 60000),
      typeC: generateSensorPattern('type C', new Date('2025-06-01T10:35:00'), new Date('2025-06-01T10:45:00'), 60000),
    }

    return {
      sensorTimelineChartData,
      timeRange: {
        min: missileStart.getTime(),
        max: missileEnd.getTime()
      },
      missileRange: {
        start: missileStart.getTime(),
        end: missileEnd.getTime()
      }
    }
  }
})
</script>
