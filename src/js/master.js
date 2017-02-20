const sample = "sample";

const docHead = document.getElementsByTagName('head')[0];       
const newLink = document.createElement('link');
newLink.rel = 'shortcut icon';
newLink.href = 'data:image/png;base64,'+favicon;
docHead.appendChild(newLink);
