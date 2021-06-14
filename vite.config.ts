import dotenv from 'dotenv'
import { resolve } from 'path'
import { ConfigEnv, defineConfig, UserConfigExport } from 'vite'
import { VitePluginNode } from 'vite-plugin-node'
import { NestServer } from 'vite-plugin-node/dist/servers/nest-server'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_config: ConfigEnv): UserConfigExport => {
  dotenv.config()

  const port =
    process.env.APP_PORT !== undefined ? parseInt(process.env.APP_PORT) : 3000

  return defineConfig({
    resolve: {
      alias: {
        src: resolve(__dirname, 'src'),
        '@libs/winston-logger': resolve(__dirname, 'libs/winston-logger/src'),
        '@libs/winston-logger/*': resolve(__dirname, 'libs/winston-logger/src'),
      },
    },
    clearScreen: false,
    plugins: [
      ...VitePluginNode({
        // the node framework you are using,
        // currently this plugin support 'express', 'nest' and 'custom',
        // more framework support incoming!
        // when set this to 'custom', you have to the createCustomServer option // to tell the plugin how to create/start/... your node server
        server: 'nest',

        // tell the plugin where is your project entry
        appPath: './src/main.ts',

        // the port you want the server to run on
        port,

        // Optional, the TypeScript compiler you want to use
        // by default this plugin is using vite default ts compiler which is esbuild
        // 'swc' compiler is supported to use as well for frameworks
        // like Nestjs (esbuild don't support 'emitDecoratorMetadata' yet)
        tsCompiler: 'swc',

        // Required field when set server option to 'custom'
        // For examples, check out './src/servers' folder
        createCustomServer: () => NestServer,
      }),
    ],
  })
}
