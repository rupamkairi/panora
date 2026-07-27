import { $ } from 'bun'

const androidHome = process.env.ANDROID_HOME

if (!androidHome) {
  throw new Error('ANDROID_HOME must point to the Android SDK.')
}

const adb = `${androidHome}/platform-tools/adb`
const metroUrl = 'http://127.0.0.1:8081'
const devClientUrl = `exp+panora://expo-development-client/?url=${encodeURIComponent(metroUrl)}`

const devices = await $`${adb} devices`.text()
const connected = devices
  .split('\n')
  .map((line) => line.match(/^(emulator-\d+)\s+device$/)?.[1])
  .find(Boolean)
const serial = process.env.ANDROID_SERIAL ?? connected

if (!serial) {
  throw new Error('No running Android emulator found.')
}

if (!devices.includes(`${serial}\tdevice`)) {
  throw new Error(`Android emulator ${serial} is not connected.`)
}

try {
  await fetch(metroUrl)
} catch {
  throw new Error('Metro is not running. Start the complete workflow with `bun android`.')
}

await $`${adb} -s ${serial} reverse tcp:8081 tcp:8081`
await $`${adb} -s ${serial} shell am start -a android.intent.action.VIEW -d ${devClientUrl}`
