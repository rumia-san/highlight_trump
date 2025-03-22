// ==UserScript==
// @name         高亮特朗普总统的光辉名字
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  庆祝特朗普总统的英明领导，高亮展现伟大总统的光辉名字，让人民时刻铭记他的丰功伟绩！
// @author       Rumia
// @match        https://www.whitehouse.gov/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  // 需要加粗的词汇列表
  const wordsToHighlight = [
      'Donald J. Trump',
      'Donald John Trump',
      'Donald Trump',
      'Trump',
      '唐纳德·特朗普',
      '特朗普',
      '川普',
  ];

  // 创建并添加CSS样式
  const style = document.createElement('style');
  style.innerHTML = `
      .highlight-word {
          font-size: 20px;  /* 设置字体大小 */
          font-weight: bold;  /* 设置加粗 */
      }
      nobr.highlight-word {
          white-space: nowrap;  /* 防止关键词换行 */
      }
  `;
  document.head.appendChild(style);


  function adjustFontSize(element) {
      const parent = element.parentElement;
      if (parent) {
          const computedStyle = window.getComputedStyle(parent);
          const currentSize = parseFloat(computedStyle.fontSize);
          if (!isNaN(currentSize)) {
              element.style.fontSize = `${currentSize * 1.2}px`; // 放大 20%
          }
      }
  }

  function highlightWords(node) {
      if (!node || node.nodeType !== Node.ELEMENT_NODE) return;

      node.childNodes.forEach(child => {
          if (child.nodeType === Node.TEXT_NODE && child.nodeValue.trim() !== '') {
              let modifiedText = child.nodeValue;
              let changed = false;
              wordsToHighlight.forEach(word => {
                  const regex = new RegExp(`(\\b${word}\\b)`, 'g');
                  if (regex.test(modifiedText)) {
                      changed = true;
                      modifiedText = modifiedText.replace(regex, `<nobr class="highlight-word" data-highlighted="true">$1</nobr>`);
                  }
              });
              if (changed) {
                  const wrapper = document.createElement('span');
                  wrapper.innerHTML = modifiedText;
                  child.replaceWith(wrapper);
                  wrapper.querySelectorAll('.highlight-word').forEach(adjustFontSize);
              }
          } else if (!child.hasAttribute || !child.hasAttribute('data-highlighted')) {
              highlightWords(child);
          }
      });
  }


  // 初次运行时处理已有内容
  highlightWords(document.body);

  // 每一秒处理页面
  setInterval(function() {
      highlightWords(document.body);
  }, 1000);


})();
