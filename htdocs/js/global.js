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
  },
  
  removeLineBreak: function () {
    const canvas = document.getElementById('canvas');
    const lb = canvas.querySelector('.selected ~ aes70-line-break');
    if (!lb)
      return;
    lb.parentElement.removeChild(lb);
  },
  
}
