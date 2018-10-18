/*
 * @Author: kallsave
 * @Date: 2018-10-15 11:04:13
 * @Last Modified by: kallsave
 * @Last Modified time: 2018-10-18 11:25:02
 * 这个文件是一些去除的或者待测试的功能
 */

/**
 *
 * FIXME: sticky.vue组件的
 * appendChild同时有removeChild的效果,所以要复制一遍node节点?
 * @param {element} father 被插入的dom节点
 * @param {element} children 插入的dom节点
 */
function deepAppendChild(father, children) {
  // dom转换json的顺序是从里到外递归
  function domToJson(dom) {
    if (dom.children.length === 0) {
      return {
        node: dom,
        children: []
      }
    } else {
      let json = {
        node: dom,
        children: []
      }
      for (let i = 0; i < dom.children.length; i++) {
        json.children.push(domToJson(dom.children[i]))
      }
      return json
    }
  }
  // 把children的dom节点信息记录
  let tree = domToJson(children)
  appendTree(father, tree)
  // 插dom的顺序是从外到里
  function appendTree(father, childrenTree) {
    if (childrenTree.children && childrenTree.children.length === 0) {
      father.appendChild(childrenTree.node)
    } else {
      father.appendChild(childrenTree.node)
      for (let i = 0; i < childrenTree.children.length; i++) {
        appendTree(childrenTree.node, childrenTree.children[i])
      }
    }
  }
}
