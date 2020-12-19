import moment from 'moment'
const states = ['SA', 'WA', 'VIC', 'NSW', 'QLD']
const remoteStatus = { '0': 'Darft', '1': 'Processing', '2': 'Scheduled', '9': 'Completed' }
const inverterState = { '0': 'Offline', '1': 'Online','2':'Standby', '3': 'Abnormal' }
const inverterType = { '1': 'Inverter', '3': 'Other', '2': 'Battery','4':'Max','5':'Mix','6':'SPA','7':'Min' }
const plantType = { 'S': 'Solar only', 'SB': 'Solar+Battery' }

function RS(v) {
  return remoteStatus[v]
}
function IS(v){
  return inverterState[v]
}
function day(t){
  return moment(t).format('YYYY-MM-DD')
}
function time(t){
  return moment(t).format('YYYY-MM-DD HH:mm:ss')
}
function DT(v){
  return inverterType[v]
}
function PT  (v) { return plantType[v] }
function has (v) { return v ?'yes':'not'}

const allRS = () => Object.fromEntities(remoteStatus).map((k, v) => ({ value: k, label: v }))()
const allIS = () => Object.fromEntities(inverterState).map((k, v) => ({ value: k, label: v }))()

export { states, RS, allRS,IS ,day,time,DT,PT,has,allIS};