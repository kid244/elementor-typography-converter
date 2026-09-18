// Base Root Size & Ratios for Font Scaling
const BREAKPOINTS = [
  { name: 'Desktop', width: '1920px', scale: 1.0 },
  { name: 'Laptop', width: '1440px', scale: 0.875 },
  { name: 'Tablet', width: '1024px', scale: 0.75 },
  { name: 'Mobile', width: '767px', scale: 0.625 }
];

const MIN_FONT_PX = 18; // Minimum threshold limit

let lhUnit = 'px';

function setPx(val) {
  document.getElementById('desktopPx').value = val;
  calculate();
}

function setLhUnit(unit) {
  lhUnit = unit;
  document.getElementById('lhUnitPx').classList.toggle('active', unit === 'px');
  document.getElementById('lhUnitPct').classList.toggle('active', unit === '%');
  
  const label = document.getElementById('lhInputLabel');
  const unitSpan = document.getElementById('lhInputUnit');
  
  if (unit === 'px') {
    label.innerText = 'Line Height Value (PX)';
    unitSpan.innerText = 'px';
  } else {
    label.innerText = 'Line Height Percentage (%)';
    unitSpan.innerText = '%';
  }
  
  calculate();
}

function calculate() {
  const basePx = parseFloat(document.getElementById('basePx').value) || 16;
  const desktopPx = parseFloat(document.getElementById('desktopPx').value) || 0;
  
  const lhFontPx = parseFloat(document.getElementById('lhFontPx').value) || 0;
  const lhInputVal = parseFloat(document.getElementById('lhInputVal').value) || 0;

  // 1. Calculate Font Sizes (with 18px minimum limit)
  const fontTable = document.getElementById('fontSizeTable');
  fontTable.innerHTML = '';

  BREAKPOINTS.forEach(bp => {
    let rawPx = desktopPx * bp.scale;
    
    // Apply 18px minimum threshold limit
    let finalPx = Math.max(rawPx, MIN_FONT_PX);
    let remVal = (finalPx / basePx).toFixed(3);
    
    // Clean up trailing zeros
    remVal = parseFloat(remVal);

    const isClamped = rawPx < MIN_FONT_PX && desktopPx > 0;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${bp.name}</strong></td>
      <td>${bp.width}</td>
      <td>${finalPx.toFixed(1).replace('.0', '')}px ${isClamped ? '<small style="color:#f59e0b;">(Min 18px applied)</small>' : ''}</td>
      <td>
        <span class="code-badge">${remVal}</span>
        <button class="copy-btn" onclick="copyToClipboard('${remVal}', this)">Copy</button>
      </td>
    `;
    fontTable.appendChild(tr);
  });

  // 2. Calculate Line Height Output
  const lhTable = document.getElementById('lineHeightTable');
  lhTable.innerHTML = '';

  BREAKPOINTS.forEach(bp => {
    let calculatedFontPx = Math.max(lhFontPx * bp.scale, MIN_FONT_PX);
    let targetLhPx = 0;

    if (lhUnit === 'px') {
      targetLhPx = lhInputVal * bp.scale;
    } else {
      targetLhPx = calculatedFontPx * (lhInputVal / 100);
    }

    let emVal = calculatedFontPx > 0 ? (targetLhPx / calculatedFontPx).toFixed(2) : 0;
    emVal = parseFloat(emVal);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${bp.name}</strong></td>
      <td>${calculatedFontPx.toFixed(1).replace('.0', '')}px</td>
      <td>${targetLhPx.toFixed(1).replace('.0', '')}px</td>
      <td>
        <span class="code-badge">${emVal}</span>
        <button class="copy-btn" onclick="copyToClipboard('${emVal}', this)">Copy</button>
      </td>
    `;
    lhTable.appendChild(tr);
  });
}

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = btn.innerText;
    btn.innerText = 'Copied!';
    btn.style.background = '#10b981';
    setTimeout(() => {
      btn.innerText = originalText;
      btn.style.background = '';
    }, 1200);
  });
}

// Initial Calculation
document.addEventListener('DOMContentLoaded', calculate);
