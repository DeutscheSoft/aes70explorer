import { getBackendValue } from './../AWML/src/index.pure.js';

window.AES70 = {
  
  addLineBreak: function () {
    const canvas = document.getElementById('canvas');
    const prec = canvas.querySelector('.selected');
    if (!prec)
      return;
    const lb = document.createElement('aes70-line-break');
    if (prec.nextSibling)
      canvas.insertBefore(lb, prec.nextSibling);
    else
      canvas.appendChild(lb);
    getBackendValue('local:canAddLineBreak').set(false);
    getBackendValue('local:canRemoveLineBreak').set(true);
  },
  
  removeLineBreak: function () {
    const canvas = document.getElementById('canvas');
    const lb = canvas.querySelector('.selected ~ aes70-line-break');
    if (!lb)
      return;
    lb.parentElement.removeChild(lb);
    getBackendValue('local:canAddLineBreak').set(true);
    getBackendValue('local:canRemoveLineBreak').set(false);
  },
  
}
