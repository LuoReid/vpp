const states = ['SA', 'WA', 'VIC', 'NSW', 'QLD']
const remoteStatus = { '0': 'Darft', '1': 'Processing', '2': 'Scheduled', '9': 'Completed' }
const inverterState = { '0': 'Offline', '1': 'Online', '2': 'Anomaly' }

function RS(v) {
  console.log('all:', v, remoteStatus)
  return remoteStatus[v]
}
function IS(v){
  return inverterState[v]
}
const allRS = () => Object.fromEntities(remoteStatus).map((k, v) => ({ value: k, label: v }))()

export { states, RS, allRS,IS };