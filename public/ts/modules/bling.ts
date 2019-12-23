// based on https://gist.github.com/paulirish/12fb951a8b893a454b32

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

Node.prototype.on = window.on = function(name: string, fn: any) {
  this.addEventListener(name, fn);
};

(NodeList.prototype as any).__proto__ = Array.prototype;

NodeList.prototype.on = NodeList.prototype.addEventListener = function(
  name: string,
  fn: any,
) {
  this.forEach(elem => {
    elem.on(name, fn);
  });
};

declare global {
  interface Node {
    on: Element['addEventListener'];
  }

  interface Window {
    on: Window['addEventListener'];
  }

  interface NodeList {
    on: Element['addEventListener'];
    addEventListener: Element['addEventListener'];
  }

  interface NodeListOf<TNode extends Node> extends Array<TNode> {}
}

export { $, $$ };
