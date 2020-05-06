const Bundler = require('parcel-bundler')
const Path = require('path')
const argv = require('yargs').argv

console.log(argv)
// Single entrypoint file location:
// const entryFiles = Path.join(__dirname, './index.html');
// OR: Multiple files with globbing (can also be .js)
// const entryFiles = './src/*.js';
// OR: Multiple files in an array
const entryFiles = [
  'src/content_script.ts',
  'src/background.ts',
  'src/pageAction/index.tsx',
  'src/options.html',
  'src/main.html',
]

// Bundler options
const options = {
  outDir: argv.outDir || './dist',
  contentHash: false, // Disable content hash from being included on the filename
  minify: process.env.NODE_ENV === 'production', // Minify files, enabled if process.env.NODE_ENV === 'production'
  scopeHoist: false, // Turn on experimental scope hoisting/tree shaking flag, for smaller production bundles
  target: 'browser', // Browser/node/electron, defaults to browser
  logLevel: 3, // 5 = save everything to a file, 4 = like 3, but with timestamps and additionally log http requests to dev server, 3 = log info, warnings & errors, 2 = log warnings & errors, 1 = log errors, 0 = log nothing
  hmr: false, // Enable or disable HMR while watching
  sourceMaps: false, // Enable or disable sourcemaps, defaults to enabled (minified builds currently always create sourcemaps)
  autoInstall: false, // Enable or disable auto install of missing dependencies found during bundling
}

;(async function () {
  try {
    // Initializes a bundler using the entrypoint location and options provided
    const bundler = new Bundler(entryFiles, options)

    bundler.on('buildStart', entryPoints => {
      console.dir(entryFiles)
    })

    bundler.on('buildError', error => {
      console.error(error)
    })

    // Run the bundler, this returns the main bundle
    // Use the events if you're using watch mode as this promise will only trigger once and not for every rebuild
    const bundle = await bundler.bundle()
  } catch (error) {
    console.error('Build failed')
    console.error(error)
  }
})()
