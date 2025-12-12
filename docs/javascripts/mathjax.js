window.MathJax = {
  tex: {
    inlineMath: [["\\(", "\\)"], ['$', '$']],
    displayMath: [["\\[", "\\]"], ['$$', '$$']],
    processEscapes: true,
    processEnvironments: true,
    tags: 'ams',
    packages: {'[+]': ['ams']}
  },
  options: {
    ignoreHtmlClass: ".*|",
    processHtmlClass: "arithmatex|bordered"
  }
};
