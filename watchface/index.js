import hmUI from '@zos/ui'
import { Time } from '@zos/sensor'
import  { Weather } from '@zos/sensor'
import timer from '@zos/timer'
import { getText } from '@zos/i18n'
import { TEXT_STYLE } from './style'

const WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const BATTERY_LEVEL = ['power/1.png', 'power/2.png', 'power/3.png', 'power/4.png', 'power/5.png', 'power/6.png'];
const HOUR = 3600000
const MINUTE = 60000

const TIME_SENSOR = new Time()
const WEATHER_SENSOR = new Weather()
let seconds_timer, hour_timer

const WIDGETS = {
  background: null,
  time: null,
  second: null,
  date: null,
  week_day: null,
  img_lines_hour: null,
  img_lines_minute: null,
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

  UpdateWeatherWidgets(){
    let { forecastData, tideData, cityName } = WEATHER_SENSOR.getForecast()
    hour_timer = timer.createTimer(HOUR, 1, () => {
      WIDGETS.weather.icon.setProperty(hmUI.prop.MORE, {
          src: 'weather/'+ (forecastData.data[0].index).toString() + '.png'
      }),
      WIDGETS.weather.city.setProperty(hmUI.prop.TEXT, cityName)
      WIDGETS.weather.low_t.setProperty(hmUI.prop.TEXT, forecastData.data[0].low)
      WIDGETS.weather.high_t.setProperty(hmUI.prop.TEXT, forecastData.data[0].high)
    });
  },

  onInit() {
    this.UpdateWeatherWidgets()
    seconds_timer = timer.createTimer(MINUTE, 1, () => {
      let hours = addZero(TIME_SENSOR.getHours().toString())
      let  minutes = addZero(TIME_SENSOR.getMinutes().toString())
      let format_time = hours + ':' + minutes
      let day = addZero(TIME_SENSOR.getDate().toString())
      let month = TIME_SENSOR.getMonth()-1
      let format_date = day + ' ' + getText(MONTHS[month])
      WIDGETS.time.setProperty(hmUI.prop.TEXT, format_time)
      WIDGETS.week_day.setProperty(hmUI.prop.TEXT, getText(WEEK[TIME_SENSOR.getDay()]))
      WIDGETS.date.setProperty(hmUI.prop.TEXT, format_date)
    });
  },

  build() {
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
      text_size: 140,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.NONE,
      text: ''
    }),
    WIDGETS.second = hmUI.createWidget(hmUI.widget.TIME_POINTER, {
      second_centerX: 240,
      second_centerY: 240, 
      second_posX: 241,
      second_posY: 35,
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
      y: 50,
      w: 170,
      h: 50,
      color: 0xffffff,
      text_size: 40,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.NONE,
      text: ''
    }),
    WIDGETS.date = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 130,
      y: 110,
      w: 220,
      h: 50,
      color: 0xffffff,
      text_size: 40,
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
      text_size: 20,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.NONE,
      text: ''
    }),
    WIDGETS.weather.icon = hmUI.createWidget(hmUI.widget.IMG, {
      x: 220,
      y: 370,
      src: ''
    }),
    WIDGETS.weather.low_t = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 160,
      y: 405,
      w: 40,
      h: 20,
      color: 0xffffff,
      text_size: 20,
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
      text_size: 20,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.NONE,
      text: '-20'
    }),
    WIDGETS.heart.rate = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 70,
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
      x: 145,
      y: 335,
      src: 'heart.png'
    }),
    WIDGETS.distance.dist= hmUI.createWidget(hmUI.widget.TEXT, {
      x: 290,
      y: 320,
      w: 100,
      h: 30,
      color: 0xffffff,
      text_size: TEXT_STYLE.size.sport_data,
      align_h: hmUI.align.RIGHT,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.NONE,
      text: '100.0'
    }),
    WIDGETS.distance.icon = hmUI.createWidget(hmUI.widget.IMG, {
      x: 395,
      y: 330,
      src: 'distance.png'
    }),
    WIDGETS.steps.count= hmUI.createWidget(hmUI.widget.TEXT, {
      x: 285,
      y: 360,
      w: 100,
      h: 30,
      color: 0xffffff,
      text_size: TEXT_STYLE.size.sport_data,
      align_h: hmUI.align.RIGHT,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.NONE,
      text: '50000'
    }),
    WIDGETS.steps.icon = hmUI.createWidget(hmUI.widget.IMG, {
      x: 390,
      y: 365,
      src: 'steps.png'
    }),
    WIDGETS.calories.count = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 90,
      y: 360,
      w: 70,
      h: 30,
      color: 0xffffff,
      text_size: TEXT_STYLE.size.sport_data,
      align_h: hmUI.align.RIGHT,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.NONE,
      text: '1000'
    }),
    WIDGETS.calories.icon = hmUI.createWidget(hmUI.widget.IMG, {
      x: 165,
      y: 365,
      src: 'calories.png'
    }),
    WIDGETS.battery.icon = hmUI.createWidget(hmUI.widget.IMG_LEVEL, {
      x: 80,
      y: 100,
      w: 480,
      h: 480,
      image_array: BATTERY_LEVEL,
      image_length: 6,
      level: 1
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
    })
  },

  onDestroy() {
    if (seconds_timer.timer) {
      timer.stopTimer(seconds_timerw)
    }
    if (hour_timer.timer) {
      timer.stopTimer(hour_timer)
    }
  }
})
