export function mountWatermark(options = {}) {
  const text = options.text || 'LUCY'
  const color = options.color || 'rgba(255, 255, 255, 0.08)'
  const font = options.font || '700 14px "Press Start 2P", ui-monospace, monospace'
  const rotate = options.rotate || -20
  const gap = options.gap || 160
  
  let overlay = document.getElementById('__wm_overlay__')
  if (!overlay) {
    overlay = document.createElement('div')
    overlay.id = '__wm_overlay__'
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: 9998,
      backgroundRepeat: 'repeat',
    })
    document.body.appendChild(overlay)
  }
  
  function render() {
    const dpr = window.devicePixelRatio || 1
    const canvas = document.createElement('canvas')
    const size = gap * dpr
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, size, size)

    // 1) 画一个像素格底纹
    const grid = 8 * dpr
    ctx.fillStyle = 'rgba(255,255,255,0.03)'
    for (let x = 0; x < size; x += grid) {
      for (let y = 0; y < size; y += grid) {
        ctx.fillRect(x, y, 1, 1)
      }
    }

    // 2) 斜向像素文字 + 细框
    ctx.save()
    ctx.translate(size / 2, size / 2)
    ctx.rotate((Math.PI / 180) * rotate)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = color
    ctx.font = font.replace(/(\d+)px/, (_, n) => `${Number(n) * dpr}px`)
    const label = `${text.toUpperCase()}`
    // 像素描边（四向阴影）
    ctx.shadowColor = 'rgba(0,0,0,0.18)'
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 1 * dpr
    ctx.shadowOffsetY = 1 * dpr
    ctx.fillText(label, 0, 0)
    ctx.shadowOffsetX = -1 * dpr
    ctx.shadowOffsetY = -1 * dpr
    ctx.fillText(label, 0, 0)
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.restore()
    const dataUrl = canvas.toDataURL('image/png')
    overlay.style.backgroundImage = `url(${dataUrl})`
    overlay.style.backgroundSize = `${gap}px ${gap}px`
  }
  
  render()
  const onResize = () => render()
  window.addEventListener('resize', onResize)
  return () => {
    window.removeEventListener('resize', onResize)
    overlay && overlay.remove()
  }
}


