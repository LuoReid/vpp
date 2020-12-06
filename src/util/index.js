import moment from 'moment'
const states = ['SA', 'WA', 'VIC', 'NSW', 'QLD']
const remoteStatus = { '0': 'Darft', '1': 'Processing', '2': 'Scheduled', '9': 'Completed' }
const inverterState = { '0': 'Offline', '1': 'Online', '2': 'Anomaly' }
const inverterType = { '1': 'Inverter', '3': '', '2': 'Battery','4':'Max','5':'Mix','6':'SPA','7':'Min' }

function RS(v) {
  console.log('all:', v, remoteStatus)
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
const allRS = () => Object.fromEntities(remoteStatus).map((k, v) => ({ value: k, label: v }))()

export { states, RS, allRS,IS ,day,time,DT};