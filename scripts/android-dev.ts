import { $ } from 'bun'

const androidHome = process.env.ANDROID_HOME

if (!androidHome) {
  throw new Error('ANDROID_HOME must point to the Android SDK.')
}

const adb = `${androidHome}/platform-tools/adb`
const emulator = `${androidHome}/emulator/emulator`
const metroUrl = 'http://127.0.0.1:8081'

async function getAndroidSerial() {
  const devices = await $`${adb} devices`.text()
  const connected = devices
    .split('\n')
    .map((line) => line.match(/^(emulator-\d+)\s+device$/)?.[1])
    .find(Boolean)

  return process.env.ANDROID_SERIAL ?? connected
}

async function waitForEmulator() {
  for (let attempt = 0; attempt < 90; attempt++) {
    const serial = await getAndroidSerial()
    if (serial) {
      const booted = (
        await $`${adb} -s ${serial} shell getprop sys.boot_completed`.quiet().text()
      ).trim()
      if (booted === '1') return serial
    }

    await Bun.sleep(1_000)
  }

  throw new Error('Android emulator did not finish booting within 90 seconds.')
}

async function ensureEmulator() {
  const connected = await getAndroidSerial()
  if (connected) return await waitForEmulator()

  const avds = (await $`${emulator} -list-avds`.text())
    .split('\n')
    .map((name) => name.trim())
    .filter(Boolean)
  const avd = process.env.ANDROID_AVD ?? avds[0]

  if (!avd) {
    throw new Error(
      'No Android Virtual Device found. Create one in Android Studio Device Manager.',
    )
  }

  console.info(`Starting Android emulator ${avd}…`)
  Bun.spawn([emulator, '-avd', avd], {
    env: process.env,
    stdin: 'ignore',
    stdout: 'ignore',
    stderr: 'ignore',
  })

  return await waitForEmulator()
}

async function isMetroRunning() {
  try {
    const response = await fetch(metroUrl, {
      headers: { 'expo-platform': 'android' },
    })
    return response.ok
  } catch {
    return false
  }
}

async function waitForMetro() {
  for (let attempt = 0; attempt < 60; attempt++) {
    if (await isMetroRunning()) return
    await Bun.sleep(500)
  }

  throw new Error('Metro did not start on port 8081 within 30 seconds.')
}

const serial = await ensureEmulator()
process.env.ANDROID_SERIAL = serial

let metro: ReturnType<typeof Bun.spawn> | undefined
if (!(await isMetroRunning())) {
  console.info('Starting Metro…')
  metro = Bun.spawn(['bunx', 'one', 'dev'], {
    cwd: process.cwd(),
    env: process.env,
    stdin: 'inherit',
    stdout: 'inherit',
    stderr: 'inherit',
  })
  await waitForMetro()
} else {
  console.info('Using Metro already running on port 8081.')
}

const stopMetro = () => metro?.kill()
process.on('SIGINT', stopMetro)
process.on('SIGTERM', stopMetro)

const build = Bun.spawn(['bunx', 'one', 'run:android'], {
  cwd: process.cwd(),
  env: process.env,
  stdin: 'inherit',
  stdout: 'inherit',
  stderr: 'inherit',
})

const buildExitCode = await build.exited
if (buildExitCode !== 0) {
  stopMetro()
  process.exit(buildExitCode)
}

const open = Bun.spawn(['bun', 'run', 'android:open'], {
  cwd: process.cwd(),
  env: process.env,
  stdin: 'inherit',
  stdout: 'inherit',
  stderr: 'inherit',
})

const openExitCode = await open.exited
if (openExitCode !== 0) {
  stopMetro()
  process.exit(openExitCode)
}

if (metro) {
  console.info(
    'Android development is ready. Keep this command running for Fast Refresh.',
  )
  process.exit(await metro.exited)
}
