#!/usr/bin/env bun

/**
 * @description npm postinstall tasks
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { $ } from 'bun'

// Expo's settings plugin invokes a bare `node`, which fails when Android Studio
// starts Gradle with macOS's reduced GUI PATH. The native settings script
// resolves Node once and exposes its absolute path as a Gradle extra property.
try {
  const autolinkingPackagePath = require.resolve('expo-modules-autolinking/package.json')
  const settingsPluginDirectory = join(
    autolinkingPackagePath,
    '../android/expo-gradle-plugin/expo-autolinking-settings-plugin/src/main/kotlin/expo/modules/plugin',
  )
  for (const filename of [
    'ExpoAutolinkingSettingsPlugin.kt',
    'ExpoAutolinkingSettingsExtension.kt',
  ]) {
    const sourcePath = join(settingsPluginDirectory, filename)
    const source = readFileSync(sourcePath, 'utf-8')
    const patchedSource = source.replaceAll(
      'env.commandLine("node",',
      'env.commandLine(settings.gradle.extensions.extraProperties["nodeExecutable"] as String,',
    )
    if (patchedSource !== source) {
      writeFileSync(sourcePath, patchedSource)
      console.info(`Patched Expo Android Node resolution in ${filename}`)
    }
  }

  const commandBuilderPath = join(
    autolinkingPackagePath,
    '../android/expo-gradle-plugin/expo-autolinking-plugin-shared/src/main/kotlin/expo/modules/plugin/AutolinkingCommandBuilder.kt',
  )
  const commandBuilderSource = readFileSync(commandBuilderPath, 'utf-8')
  const sourceWithFileImport = commandBuilderSource.includes('import java.io.File')
    ? commandBuilderSource
    : commandBuilderSource.replace(
        'package expo.modules.plugin\n',
        'package expo.modules.plugin\n\nimport java.io.File\n',
      )
  const patchedCommandBuilderSource = sourceWithFileImport.replace(
    '    "node",',
    '    System.getenv("NODE_BINARY") ?: listOf("/opt/homebrew/bin/node", "/usr/local/bin/node").firstOrNull { File(it).canExecute() } ?: "node",',
  )
  if (patchedCommandBuilderSource !== commandBuilderSource) {
    writeFileSync(commandBuilderPath, patchedCommandBuilderSource)
    console.info('Patched Expo Android autolinking command Node resolution')
  }
} catch {
  // ignore if package is not installed
}

for (const [packageName, relativePath] of [
  ['expo-constants', 'scripts/get-app-config-android.gradle'],
  [
    'expo-modules-core',
    'expo-module-gradle-plugin/src/main/kotlin/expo/modules/plugin/gradle/ExpoGradleHelperExtension.kt',
  ],
] as const) {
  try {
    const packagePath = require.resolve(`${packageName}/package.json`)
    const sourcePath = join(packagePath, '..', relativePath)
    const source = readFileSync(sourcePath, 'utf-8')
    const patchedSource = source.replaceAll(
      'commandLine("node",',
      'commandLine(gradle.extensions.extraProperties["nodeExecutable"] as String,',
    )
    if (patchedSource !== source) {
      writeFileSync(sourcePath, patchedSource)
      console.info(`Patched Android Node resolution in ${packageName}`)
    }
  } catch {
    // ignore if package is not installed
  }
}

// patch @take-out/scripts package.json to add missing "." export (vite strict exports)
try {
  const scriptsPackagePath = require.resolve('@take-out/scripts/package.json')
  const pkg = JSON.parse(readFileSync(scriptsPackagePath, 'utf-8'))
  if (!pkg.exports['.']) {
    pkg.exports['.'] = { types: './src/run.ts', default: './src/run.ts' }
    writeFileSync(scriptsPackagePath, JSON.stringify(pkg, null, 2))
    console.info('Patched @take-out/scripts package.json exports')
  }
} catch {
  // ignore if package not found
}

// Both commands invoke build tooling. Run them serially so `bun install` does not
// compete for memory and get either process killed on constrained machines.
await $`bun tko run env-update`.nothrow()
await $`bun run one patch`.nothrow()

// fix @take-out/helpers asyncContext.native.js - published version has dynamic import bug
const asyncContextNativeFix = `// react native implementation - no node:async_hooks available
export function createAsyncContext() {
  var currentContext = undefined;
  var contextStack = [];

  return {
    get: function() {
      return currentContext;
    },
    run: async function(value, fn) {
      var prevContext = currentContext;
      currentContext = value;
      contextStack.push(prevContext);

      try {
        return await fn();
      } finally {
        currentContext = contextStack.pop();
      }
    }
  };
}

var globalContext = null;

export function getAsyncContext() {
  if (!globalContext) {
    globalContext = createAsyncContext();
  }
  return globalContext;
}
`

try {
  const helpersPath = require.resolve('@take-out/helpers')
  const asyncContextPath = join(helpersPath, '../../esm/async/asyncContext.native.js')
  writeFileSync(asyncContextPath, asyncContextNativeFix)
  console.info('Patched @take-out/helpers asyncContext.native.js')
} catch {
  // ignore if package not found
}
