const path = require('path')
const fs = require('fs')
const svgtofont = require('svgtofont')
const glob = require('glob-all')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

function fsExistsSync(path) {
  try {
    fs.accessSync(path, fs.F_OK)
  } catch (e) {
    return false
  }
  return true
}

// 约定项目放置svg图片的目录
const SVG_FOLDER = 'svg'
// 约定项目放置处理成fonts的目录
const FONTS_FOLDER = 'fonts'

// 全局字体所在的目录
const APP_FOLDER = 'common'
// 全局字体前缀(全局字体所在的目录里面的)
const APP_PREFIX = 'common-icon'

// ui组件所在目录
const UIKIT_FOLDER = 'uikit'
// ui组件字体前缀
const UIKIT_PREFIX = ''

// 其他组件字体前缀
const LOCAL_PREFIX = 'w-'

let distRuler = new RegExp(`(.*\/)?${SVG_FOLDER}`, 'g')
let fontNameRuler = new RegExp(`(.*\/)?(.*)?\/${SVG_FOLDER}`, 'g')

let fontFiles = glob.sync([
  resolve(`src/${APP_FOLDER}/**/${SVG_FOLDER}`),
  resolve(`src/${UIKIT_FOLDER}/**/${SVG_FOLDER}`),
  // resolve(`src/components/**/${SVG_FOLDER}`),
  // resolve(`src/base-components/**/${SVG_FOLDER}`),
])

// ; (async () => {
//   for (let i = 0; i < fontFiles.length; i++) {
//     await (() => {
//       return new Promise((resolve, reject) => {
//         let item = fontFiles[i]
//         let dist = item.replace(distRuler, `$1${FONTS_FOLDER}`)
//         let fontName = ''
//         if (item.indexOf(APP_FOLDER) !== -1) {
//           fontName = APP_PREFIX
//         } else if (item.indexOf(UIKIT_FOLDER) !== -1) {
//           fontName = UIKIT_PREFIX + item.replace(fontNameRuler, `$2`) + '-icon'
//         } else {
//           fontName = LOCAL_PREFIX + item.replace(fontNameRuler, `$2`) + '-icon'
//         }
//         // 如果没有fonts目录,创建fonts目录
//         let reg = new RegExp(`${SVG_FOLDER}`)
//         let fontsFolderPath = item.replace(reg, `${FONTS_FOLDER}`)
//         if (!fs.existsSync(fontsFolderPath)) {
//           fs.mkdirSync(fontsFolderPath)
//         }

//         svgtofont({
//           src: path.resolve(item),
//           dist: path.resolve(dist),
//           fontName,
//           css: true,
//           startNumber: 20000,
//           emptyDist: false,
//         }).then(() => {
//           console.log('done')
//         }).catch((err) => {
//           console.log('err', err)
//         })
//       })
//     })()
//   }
// })()

fontFiles.forEach((item) => {
  let dist = item.replace(distRuler, `$1${FONTS_FOLDER}`)
  let fontName = ''
  if (item.indexOf(APP_FOLDER) !== -1) {
    fontName = APP_PREFIX
  } else if (item.indexOf(UIKIT_FOLDER) !== -1) {
    fontName = UIKIT_PREFIX + item.replace(fontNameRuler, `$2`) + '-icon'
  } else {
    fontName = LOCAL_PREFIX + item.replace(fontNameRuler, `$2`) + '-icon'
  }
  // 如果没有fonts目录,创建fonts目录
  let reg = new RegExp(`${SVG_FOLDER}`)
  let fontsFolderPath = item.replace(reg, `${FONTS_FOLDER}`)
  if (!fs.existsSync(fontsFolderPath)) {
    fs.mkdirSync(fontsFolderPath)
  }

  svgtofont({
    src: item,
    dist,
    fontName,
    css: true,
    startNumber: 20000,
    emptyDist: false,
    svgicons2svgfont: {
      fontHeight: 1000,
      normalize: true
    },
  }).then(() => {
    console.log('done')
  }).catch((err) => {
    console.log(err)
  })
})


