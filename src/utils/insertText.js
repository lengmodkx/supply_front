export default function (el, str) {
  if (document.selection) {
    var sel = document.selection.createRange()
    sel.text = str
  } else if (typeof el.selectionStart === 'number' && typeof el.selectionEnd === 'number') {
    let startPos = el.selectionStart
    let endPos = el.selectionEnd
    let cursorPos = startPos
    let tmpStr = el.value
    el.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length)
    cursorPos += str.length
    el.selectionStart = el.selectionEnd = cursorPos
  } else {
    el.value += str
  }
  el.dispatchEvent(new Event('input'))
}
