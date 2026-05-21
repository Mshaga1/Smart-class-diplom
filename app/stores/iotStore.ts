import { defineStore } from 'pinia'

export type DeviceMode = 'simulated' | 'real'
export type DeviceStatus = 'active' | 'offline'

export interface SensorPayload {
  temperature: number
  humidity: number
  airQuality: number
  fireValue: number
  light: number
  mode: DeviceMode
  updatedAt: string
}

export interface SensorHistoryItem extends SensorPayload {
  label: string
}

export const useIotStore = defineStore('iotStore', {
  state: () => ({
    temperature: 0,
    humidity: 0,
    airQuality: 0,
    fireValue:0,
    light: 0,
    mode: 'simulated' as DeviceMode,
    updatedAt: '',
    classroomLights: false,
    fan: false,
    isOnline: false,
    history: [] as SensorHistoryItem[],
    now: Date.now()
  }),

  getters: {
    deviceStatus: (state): DeviceStatus => {
      if (!state.updatedAt) return 'offline'

      const lastUpdate = new Date(state.updatedAt).getTime()
      const diffSeconds = (state.now - lastUpdate) / 1000

      return diffSeconds <= 10 ? 'active' : 'offline'
    },

    deviceStatusText(): string {
      return this.deviceStatus === 'active' ? 'Active' : 'Offline'
    },

    airStatus: (state) => {
      if (state.airQuality < 700) return 'good'
      if (state.airQuality < 1000) return 'warning'
      return 'danger'
    },

    tempStatus: (state) => {
      if (state.temperature >= 18 && state.temperature <= 28) return 'good'
      if (state.temperature >= 15 && state.temperature <= 32) return 'warning'
      return 'danger'
    },

    humidityStatus: (state) => {
      if (state.humidity >= 35 && state.humidity <= 65) return 'good'
      if (state.humidity >= 25 && state.humidity <= 75) return 'warning'
      return 'danger'
    },

    lightStatus: (state) => {
      if(state.light <=2000) return 'good'
      if(state.light >=2000 && state.light ==4095) return 'warning'
      return 'danger'
    },

     fireStatus: (state) => {
      if(state.fireValue ==4095) return 'good'
      if(state.fireValue ==0 && state.light <=4095) return 'warning'
      return 'danger'
    }
  },

  actions: {
    updateSensors(payload: Partial<SensorPayload>) {
      const now = new Date().toISOString()

      this.temperature = payload.temperature ?? 0
      this.humidity = payload.humidity ?? 0
      this.airQuality = payload.airQuality ?? 0
      this.fireValue = payload.fireValue ?? 0
      this.light = payload.light ?? 0
      this.mode = payload.mode ?? 'real'
      this.updatedAt = payload.updatedAt ?? now
      this.isOnline = true
      this.now = Date.now()

      const time = new Date(this.updatedAt).toLocaleTimeString('mn-MN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })

      this.history.push({
        temperature: this.temperature,
        humidity: this.humidity,
        airQuality: this.airQuality,
        fireValue: this.fireValue,
        light: this.light,
        mode: this.mode,
        updatedAt: this.updatedAt,
        label: time
      })

      if (this.history.length > 20) {
        this.history.shift()
      }
    },

    async fetchLatestSensors() {
      try {
        const data = await $fetch<SensorPayload>('/api/sensors/latest')

        this.updateSensors(data)

        const lastUpdate = new Date(data.updatedAt).getTime()
        const diffSeconds = (Date.now() - lastUpdate) / 1000

        this.isOnline = diffSeconds <= 10
      } catch (error) {
        console.error('Sensor data авах алдаа:', error)
        this.isOnline = false
      }
    },

    refreshNow() {
      this.now = Date.now()
    }

    // toggleLights() {
    //   this.classroomLights = !this.classroomLights
    // },

    // toggleFan() {
    //   this.fan = !this.fan
    // }
  }
})