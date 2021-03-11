import moment from 'moment'
const states = ['SA', 'WA', 'VIC', 'NSW', 'QLD']
const remoteStatus = { '0': 'Darft', '1': 'Processing', '2': 'Scheduled', '3': 'Scheduled', '9': 'Completed' }
const inverterState = { '0': 'Offline', '1': 'Online', '2': 'Standby', '3': 'Abnormal' }
const inverterType = { '1': 'Inverter', '3': 'Other', '2': 'Battery', '4': 'Max', '5': 'Mix', '6': 'SPA', '7': 'Min' }
const plantType = { 'S': 'Solar only', 'SB': 'Solar+Battery' }
const isAllColor = { '0': 'grey', '1': 'green', '2': 'orange', '3': 'red' }

function RS(v) {
  return remoteStatus[v]
}
function IS(v) {
  return inverterState[v]
}
function day(t) {
  return moment(t).format('YYYY-MM-DD')
}
function time(t) {
  return moment(t).format('YYYY-MM-DD HH:mm:ss')
}
function atldTime1(t){
  // return moment(t).format('lll')
  return t.substring(0,t.length-4)
}
function atldTime(t) {
  // return moment(t).clone().tz('Australia/Adelaide').format('lll')
  return moment(t).format('lll')
}
function DT(v) {
  return inverterType[v]
}
function ISColor(v) {
  return isAllColor[v]
}
function PT(v) { return plantType[v] }
function has(v) { return v ? 'Yes' : 'No' }

const allRS = () => Object.fromEntities(remoteStatus).map((k, v) => ({ value: k, label: v }))()
const allIS = () => Object.fromEntities(inverterState).map((k, v) => ({ value: k, label: v }))()

function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }
  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}


export function generateExcel(config = {}) {
  return import('@/util/Export2Excel').then(excel => {
    // excel.export_json_to_excel({
    //   header: header,
    //   data: data,
    //   filename: fname,
    //   autoWidth: true,
    //   bookType: 'xlsx',
    //   color: c
    // })
    excel.export_json_to_excel({ ...config })
  })
}
export function downloadExcel(config) {
  const { temp, title, data } = config
  const keys = Object.keys(temp);
  const header = Object.values(temp);
  const filename = title || "GoSolarVPP-下载文件";
  const d = data.map((m) => keys.map((k) => m[k]));
  generateExcel({ data: d, header, filename });
}

export { states, RS, allRS, IS, day, time, DT, PT, has, allIS, ISColor, debounce, atldTime,atldTime1 };