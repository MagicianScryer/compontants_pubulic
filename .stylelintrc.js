module.exports = {
  // 继承的预设，这些预设包含了规则集插件
  extends: [
    // 基本 scss 规则
    "stylelint-config-standard-scss",
    // 样式属性顺序规则
    "stylelint-config-recess-order",
  ],
  rules: {
    // 自定义规则集的启用 / 禁用
    // 'stylistic/max-line-length': null,
  },
};