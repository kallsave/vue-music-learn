## 初始化
```javascript
let canvas = document.getElementById('canvas')
canvas.width = 1024
canvas.height = 768
let context = canvas.getContext('2d')
```

## 开始一段绘图
```javascript
context.beginPath()
```

## 结束一段绘图
```javascript
// 闭合路径
context.closePath()
```

## 线条起点
```javascript
context.moveTo(100, 100)
```

## 绘制线条
```javascript
context.beginPath()
context.moveTo(100, 100)
context.lineTo(700, 700)
context.lineWidth = 5
context.strokeStyle = '#000'
context.stroke()
```

## 填充一个多边形
```javascript
context.beginPath()
context.moveTo(100, 100)
context.lineTo(700, 700)
context.lineTo(100, 700)
context.lineTo(100, 100)
context.fillStyle = 'red'
context.fill()
```
