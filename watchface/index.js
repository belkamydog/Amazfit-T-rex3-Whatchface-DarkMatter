import hmUI from '@zos/ui'
import { Time } from '@zos/sensor'
import { Weather } from '@zos/sensor'
import { HeartRate } from '@zos/sensor'
import { Calorie } from '@zos/sensor'
import { Step } from '@zos/sensor'
import { Distance } from '@zos/sensor'
import { Battery } from '@zos/sensor'
import timer from '@zos/timer'
import { getText } from '@zos/i18n'
import { TEXT_STYLE } from './style'

const WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const BATTERY_LEVEL = ['power/0.png', 'power/1.png', 'power/2.png', 'power/3.png', 'power/4.png', 'power/5.png'];
const HOUR = 3600000

const TIME_SENSOR = new Time()
const WEATHER_SENSOR = new Weather()
const HEART_RATE_SENSOR = new HeartRate()
const CALORIE_SENSOR = new Calorie()
const STEP_SENSOR = new Step()
const DISTANCE_SENSOR = new Distance()
const BATTERY_SENSOR = new Battery()

let hour_timer

const WIDGETS = {
  background: null,
  time: null,
  second: null,
  date: null,
  week_day: null,
  img_lines_hour: null,
  img_lines_minute: null,
  status: {
    disconnect: null,
    connect: null,
    lock: null,
    alarm: null
  },
  weather: {
    icon: null,
    city: null,
    high_t: null,
    low_t: null
  },
  heart: {
    rate: null,
    icon: null
  },
  distance:{
    dist: null,
    icon: null
  },
  steps:{
    count:null,
    icon: null
  },
  calories:{
    count: null,
    icon: null
  },
  battery: {
    count: null,
    icon: null
  }
}

function addZero(str) {
  return str.length == 1 ? '0' + str : str
}

WatchFace({

  Render(){
    WIDGETS.background = hmUI.createWidget(hmUI.widget.IMG, {
      x: 0,
      y: 0,
      w: 480,
      h: 480,
      alpha: 100,
      src: 'Background.png',
      show_level: hmUI.show_level.ONLY_NORMAL | hmUI.show_level.ONAL_AOD
    }),
    WIDGETS.time = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 45,
      y: 180,
      w: 400,
      h: 120,
      color: 0xffffff,
      text_size: TEXT_STYLE.size.time,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.NONE,
      text: ''
    }),
    WIDGETS.second = hmUI.createWidget(hmUI.widget.TIME_POINTER, {
      second_centerX: 240,
      second_centerY: 240, 
      second_posX: -12,
      second_posY: 241,
      second_path: 'second.png',
    }),
    WIDGETS.img_lines_hour = hmUI.createWidget(hmUI.widget.IMG, {
      x: 55,
      y: 180,
      src: 'lines.png'
    }),
    WIDGETS.img_lines_minute = hmUI.createWidget(hmUI.widget.IMG, {
      x: 265,
      y: 180,
      src: 'lines.png'
    }),
    WIDGETS.week_day = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 160,
      y: 60,
      w: 170,
      h: 50,
      color: 0xffffff,
      text_size: TEXT_STYLE.size.week_day,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.NONE,
      text: ''
    }),
    WIDGETS.date = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 130,
      y: 110,
      w: 250,
      h: 50,
      color: 0xffffff,
      text_size: TEXT_STYLE.size.date,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.NONE,
      text: ''
    }),
    WIDGETS.weather.city = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 190,
      y: 430,
      w: 100,
      h: 20,
      color: 0xffffff,
      text_size: TEXT_STYLE.size.city,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.NONE,
      text: ''
    }),
    WIDGETS.weather.icon = hmUI.createWidget(hmUI.widget.IMG, {
      x: 215,
      y: 370,
      src: ''
    }),
    WIDGETS.weather.low_t = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 160,
      y: 405,
      w: 40,
      h: 20,
      color: 0xffffff,
      text_size: TEXT_STYLE.size.temperature,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.NONE,
      text: '-10'
    }),
    WIDGETS.weather.high_t = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 275,
      y: 405,
      w: 40,
      h: 20,
      color: 0xffffff,
      text_size: TEXT_STYLE.size.temperature,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.NONE,
      text: '-20'
    }),
    WIDGETS.heart.rate = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 90,
      y: 320,
      w: 70,
      h: 30,
      color: 0xffffff,
      text_size: TEXT_STYLE.size.sport_data,
      align_h: hmUI.align.RIGHT,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.NONE,
      text: '158'
    }),
    WIDGETS.heart.icon = hmUI.createWidget(hmUI.widget.IMG, {
      x: 165,
      y: 335,
      src: 'heart.png'
    }),
    WIDGETS.distance.dist= hmUI.createWidget(hmUI.widget.TEXT, {
      x: 325,
      y: 320,
      w: 100,
      h: 30,
      color: 0xffffff,
      text_size: TEXT_STYLE.size.sport_data,
      align_h: hmUI.align.LEFT,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.NONE,
      text: '100.0'
    }),
    WIDGETS.distance.icon = hmUI.createWidget(hmUI.widget.IMG, {
      x: 300,
      y: 330,
      src: 'distance.png'
    }),
    WIDGETS.steps.count= hmUI.createWidget(hmUI.widget.TEXT, {
      x: 310,
      y: 360,
      w: 100,
      h: 30,
      color: 0xffffff,
      text_size: TEXT_STYLE.size.sport_data,
      align_h: hmUI.align.LEFT,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.NONE,
      text: '0'
    }),
    WIDGETS.steps.icon = hmUI.createWidget(hmUI.widget.IMG, {
      x: 285,
      y: 365,
      src: 'steps.png'
    }),
    WIDGETS.calories.count = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 70,
      y: 360,
      w: 100,
      h: 30,
      color: 0xffffff,
      text_size: TEXT_STYLE.size.sport_data,
      align_h: hmUI.align.RIGHT,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.NONE,
      text: ''
    }),
    WIDGETS.calories.icon = hmUI.createWidget(hmUI.widget.IMG, {
      x: 175,
      y: 365,
      src: 'calories.png'
    }),
    WIDGETS.battery.icon = hmUI.createWidget(hmUI.widget.IMG_LEVEL, {
      x: 80,
      y: 90,
      image_array: BATTERY_LEVEL,
      image_length: 6,
      level: 6
    }),
    WIDGETS.battery.count = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 55,
      y: 125,
      w: 70,
      h: 30,
      color: 0xffffff,
      text_size: TEXT_STYLE.size.power,
      align_h: hmUI.align.RIGHT,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.NONE,
      text: '100%'
    }),
    WIDGETS.status.lock = hmUI.createWidget(hmUI.widget.IMG_STATUS, {
      x: 225,
      y: 34,
      type: hmUI.system_status.LOCK,
      src: 'Lock.png'
    }),
    WIDGETS.status.connect = hmUI.createWidget(hmUI.widget.IMG, {
      x: 203,
      y: 34,
      src: 'Connect.png'
    }),
    WIDGETS.status.disconnect = hmUI.createWidget(hmUI.widget.IMG_STATUS, {
      x: 203,
      y: 34,
      type: hmUI.system_status.DISCONNECT,
      src: 'Disconnect.png'
    }),
    WIDGETS.status.alarm = hmUI.createWidget(hmUI.widget.IMG_STATUS, {
      x: 252,
      y: 36,
      type: hmUI.system_status.CLOCK,
      src: 'Alarm.png'
    })
  },
  UpdateWeatherWidgets(){
    hour_timer = timer.createTimer(HOUR, 1, () => {
      let { forecastData, tideData, cityName } = WEATHER_SENSOR.getForecast()
      WIDGETS.weather.icon.setProperty(hmUI.prop.MORE, {
          src: 'weather/'+ (forecastData.data[0].index).toString() + '.png'
      }),
      WIDGETS.weather.city.setProperty(hmUI.prop.TEXT, cityName)
      WIDGETS.weather.low_t.setProperty(hmUI.prop.TEXT, forecastData.data[0].low.toString() + '°')
      WIDGETS.weather.high_t.setProperty(hmUI.prop.TEXT, forecastData.data[0].high.toString() + '°')
    });
  },
  UpdateBatteryWidgets(){
    let levelIndex = 0
    let batteryPercent = BATTERY_SENSOR.getCurrent()
    WIDGETS.battery.count.setProperty(hmUI.prop.TEXT, batteryPercent.toString() + '%')
    if (batteryPercent <= 10) levelIndex = 1      // 0-10%
    else if (batteryPercent <= 30) levelIndex = 2 // 11-30%
    else if (batteryPercent <= 50) levelIndex = 3 // 31-50%
    else if (batteryPercent <= 70) levelIndex = 4 // 51-70%
    else if (batteryPercent <= 90) levelIndex = 5 // 71-90%
    else levelIndex = 6                           // 91-100%
    WIDGETS.battery.icon.setProperty(hmUI.prop.LEVEL, levelIndex)
  },
  InitActivityWidgets(){
    WIDGETS.steps.count.setProperty(hmUI.prop.TEXT, STEP_SENSOR.getCurrent().toString())
    WIDGETS.distance.dist.setProperty(hmUI.prop.TEXT, ((DISTANCE_SENSOR.getCurrent()/1000).toFixed(1)))
    WIDGETS.heart.rate.setProperty(hmUI.prop.TEXT, HEART_RATE_SENSOR.getLast().toString())
    WIDGETS.calories.count.setProperty(hmUI.prop.TEXT, CALORIE_SENSOR.getCurrent().toString())
  },
  UpdateActivityWidgets(){
    STEP_SENSOR.onChange(() => {
      WIDGETS.steps.count.setProperty(hmUI.prop.TEXT, STEP_SENSOR.getCurrent().toString())
    })
    DISTANCE_SENSOR.onChange(() => {
      WIDGETS.distance.dist.setProperty(hmUI.prop.TEXT, ((DISTANCE_SENSOR.getCurrent()/1000).toFixed(1)))
    })
    HEART_RATE_SENSOR.onCurrentChange(() => {
      WIDGETS.heart.rate.setProperty(hmUI.prop.TEXT, HEART_RATE_SENSOR.getLast().toString())
    })
    CALORIE_SENSOR.onChange(() => {
      WIDGETS.calories.count.setProperty(hmUI.prop.TEXT, CALORIE_SENSOR.getCurrent().toString())
    })
  },  
  UpdateTimeWidget(){
    let hours = addZero(TIME_SENSOR.getHours().toString())
    let  minutes = addZero(TIME_SENSOR.getMinutes().toString())
    let format_time = hours + ':' + minutes
    WIDGETS.time.setProperty(hmUI.prop.TEXT, format_time)
  },
  UpdateDateAndDayOfWeek(){
    let day = addZero(TIME_SENSOR.getDate().toString())
    let month = TIME_SENSOR.getMonth()-1
    let format_date = day + ' ' + getText(MONTHS[month])
    WIDGETS.week_day.setProperty(hmUI.prop.TEXT, getText(WEEK[TIME_SENSOR.getDay()]))
    WIDGETS.date.setProperty(hmUI.prop.TEXT, format_date)
  },

  onInit() {
    this.Render()
    this.UpdateWeatherWidgets()
    this.UpdateBatteryWidgets()
    this.UpdateTimeWidget()
    this.InitActivityWidgets()
    this.UpdateDateAndDayOfWeek()
  },

  build() {
    this.UpdateActivityWidgets()
    BATTERY_SENSOR.onChange(() => { this.UpdateBatteryWidgets() })
    TIME_SENSOR.onPerMinute(() => { this.UpdateTimeWidget() })
    TIME_SENSOR.onPerDay(() => { this.UpdateDateAndDayOfWeek() })
  },

  onDestroy() {
    if (hour_timer.timer) {
      timer.stopTimer(hour_timer)
    }
      STEP_SENSOR.offChange()
      DISTANCE_SENSOR.offChange()
      HEART_RATE_SENSOR.offCurrentChange()
      CALORIE_SENSOR.offChange()
  }
})
