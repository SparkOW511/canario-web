function calculate() {
    const members = parseInt(document.getElementById('members').value) || 4;
    const wasteKg = parseFloat(document.getElementById('wasteKg').value) || 80;
    const sortRate = parseFloat(document.getElementById('sortRate').value) || 50;
    const penaltyFee = parseFloat(document.getElementById('penaltyFee').value) || 15;
    const canarioPrice = parseFloat(document.getElementById('canarioPrice').value) || 199;
    const years = parseInt(document.getElementById('years').value) || 3;

    const months = years * 12;
    const canarioSortRate = 95;
    const improvementPct = (canarioSortRate - sortRate) / 100;

    const penaltySavings = penaltyFee * months * (improvementPct > 0 ? improvementPct : 0);
    const transportSavings = wasteKg * 0.08 * months * (improvementPct > 0 ? improvementPct : 0);
    const totalSavings = penaltySavings + transportSavings - canarioPrice;

    const monthlySaving = (penaltySavings + transportSavings) / months;
    const roiMonths = monthlySaving > 0 ? Math.ceil(canarioPrice / monthlySaving) : Infinity;

    const extraRecycled = wasteKg * improvementPct * months;
    const co2Saved = extraRecycled * 0.5;

    document.getElementById('resPenalty').textContent = penaltySavings.toFixed(0) + ' EUR';
    document.getElementById('resTransport').textContent = transportSavings.toFixed(0) + ' EUR';
    document.getElementById('resPrice').textContent = '–' + canarioPrice.toFixed(0) + ' EUR';
    document.getElementById('resTotal').textContent = (totalSavings >= 0 ? '' : '–') + Math.abs(totalSavings).toFixed(0) + ' EUR';
    document.getElementById('resRoi').textContent = roiMonths === Infinity ? 'N/A' : roiMonths + ' mesecev';
    document.getElementById('ecoRecycled').textContent = extraRecycled.toFixed(0) + ' kg';
    document.getElementById('ecoCo2').textContent = co2Saved.toFixed(0) + ' kg CO₂';
}

document.getElementById('calcBtn').addEventListener('click', calculate);
calculate();
