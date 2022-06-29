function compressImg (res = {}) {
  try {
    let type = 'image/png'
    const image = new Image()
    if (typeof(res.fileObj) === "object") {
      image.src = window.URL.createObjectURL(res.fileObj)
      if (res.fileObj.type) {
        type = res.fileObj.type
      }
    } else {
      image.src = res.fileObj
    }
    image.onload = function() {
      // 等比例压缩宽高
      let w = this.width
      let h = this.height
      
      if (res.width && res.height) {
        w = res.width
        h = res.height
      } else if (res.width || res.height) {
        if (res.width > res.height) {
          h = res.width * (h / w)
          w = res.width
        } else {
          w = res.height * (w / h)
          h = res.height
        }
      }

      // 生成canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      // 创建属性节点
      const anw = document.createAttribute('width')
      anw.nodeValue = w
      const anh = document.createAttribute('height')
      anh.nodeValue = h
      canvas.setAttributeNode(anw)
      canvas.setAttributeNode(anh)
      ctx.drawImage(this, 0, 0, w, h)

      const data = canvas.toDataURL(type, parseFloat(res.quality)) // 设置图片质量
      // 压缩完成执行回调
      const newFile = convertBase64UrlToBlob(data)
      res.callback(newFile)
    }
    image.onerror = function() {
      res.callback(false)
    }
  } catch (e) {
      console.log('压缩失败!')
  }
}

function convertBase64UrlToBlob(dataurl) {
  const bytes = window.atob(dataurl.split(',')[1]) // 去掉url的头，并转换为byte
  // 处理异常,将ascii码小于0的转换为大于0
  const ab = new ArrayBuffer(bytes.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i)
  }
  return new Blob([ab], { type: 'image/png' })
}
