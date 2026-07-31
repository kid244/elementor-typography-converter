let currentLhUnit = 'px';

const breakpoints = [
  { name: 'Desktop', width: '1920px', scale: 1.0 },
  { name: 'Laptop', width: '1440px', scale: 0.875 },
  { name: 'Tablet', width: '1024px', scale: 0.75 },
  { name: 'Mobile', width: '767px', scale: 0.625 }
];

function setPx(val) {
  document.getElementById('desktopPx').value = val;
  document.getElementById('lhFontPx').value = val;
  if(currentLhUnit === 'px') {
    document.getElementById('lhInputVal').value = Math.round(val * 1.2);
  }
  calculate();
}

function setLhUnit(unit) {
  currentLhUnit = unit;
  document.getElementById('lhUnitPx').classList.toggle('active', unit === 'px');
  document.getElementById('lhUnitPct').classList.toggle('active', unit === '%');
  
  const label = document.getElementById('lhInputLabel');
  const unitSpan = document.getElementById('lhInputUnit');
  const inputVal = document.getElementById('lhInputVal');

  if(unit === '%') {
    label.textContent = 'Line Height Value (%)';
    unitSpan.textContent = '%';
    inputVal.value = '120';
  } else {
    label.textContent = 'Line Height Value (PX)';
    unitSpan.textContent = 'px';
    const fontPx = parseFloat(document.getElementById('lhFontPx').value) || 16;
    inputVal.value = Math.round(fontPx * 1.2);
  }
  calculate();
}

function copyText(text, btn) {
  navigator.clipboard.writeText(text);
  const originalText = btn.textContent;
  btn.textContent = 'Copied!';
  btn.classList.add('copied');
  setTimeout(() => {
    btn.textContent = originalText;
    btn.classList.remove('copied');
  }, 1200);
}

function calculate() {
  const basePx = parseFloat(document.getElementById('basePx').value) || 16;
  const desktopPx = parseFloat(document.getElementById('desktopPx').value) || 0;
  const lhFontPx = parseFloat(document.getElementById('lhFontPx').value) || 0;
  const lhInputVal = parseFloat(document.getElementById('lhInputVal').value) || 0;

  // 1. Render Font Size Table
  const fsTable = document.getElementById('fontSizeTable');
  fsTable.innerHTML = '';
  
  breakpoints.forEach(bp => {
    const targetPx = Math.round(desktopPx * bp.scale * 10) / 10;
    const remVal = (targetPx / basePx).toFixed(3).replace(/\.?0+$/, '');
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${bp.name}</strong></td>
      <td style="color:var(--text-muted);">${bp.width}</td>
      <td>${targetPx}px</td>
      <td>
        <span class="val-highlight">${remVal}rem</span>
        <button class="copy-btn" onclick="copyText('${remVal}', this)">Copy</button>
      </td>
    `;
    fsTable.appendChild(tr);
  });

  // 2. Render Line Height Table
  const lhTable = document.getElementById('lineHeightTable');
  lhTable.innerHTML = '';

  breakpoints.forEach(bp => {
    const currentFont = Math.round(lhFontPx * bp.scale * 10) / 10;
    let emVal = 1.2;
    let specText = '';

    if (currentLhUnit === '%') {
      emVal = (lhInputVal / 100).toFixed(3).replace(/\.?0+$/, '');
      specText = `${lhInputVal}%`;
    } else {
      const currentLhPx = Math.round(lhInputVal * bp.scale * 10) / 10;
      emVal = currentFont > 0 ? (currentLhPx / currentFont).toFixed(3).replace(/\.?0+$/, '') : '1';
      specText = `${currentLhPx}px`;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${bp.name}</strong></td>
      <td style="color:var(--text-muted);">${currentFont}px</td>
      <td>${specText}</td>
      <td>
        <span class="val-highlight">${emVal}em</span>
        <button class="copy-btn" onclick="copyText('${emVal}', this)">Copy</button>
      </td>
    `;
    lhTable.appendChild(tr);
  });
}

// Run initial calculation on page load
calculate();