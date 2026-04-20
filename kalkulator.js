const num = (id, fallback) => {
    const v = parseFloat(document.getElementById(id).value);
    return Number.isFinite(v) ? v : fallback;
};

const setText = (id, value) => {
    document.getElementById(id).textContent = value;
};

const eur = n => Math.round(n) + ' EUR';

function calculate() {
    const wasteKg = num('wasteKg', 80);
    const sortRate = num('sortRate', 50);
    const penaltyFee = num('penaltyFee', 15);
    const canarioPrice = num('canarioPrice', 199);
    const years = Math.max(1, num('years', 3));

    const months = years * 12;
    const canarioSortRate = 95;
    const improvement = Math.max(0, (canarioSortRate - sortRate) / 100);

    const penaltySavings = penaltyFee * months * improvement;
    const transportSavings = wasteKg * 0.08 * months * improvement;
    const totalSavings = penaltySavings + transportSavings - canarioPrice;

    const monthlySaving = (penaltySavings + transportSavings) / months;
    const roiMonths = monthlySaving > 0 ? Math.ceil(canarioPrice / monthlySaving) : null;

    const extraRecycled = wasteKg * improvement * months;
    const co2Saved = extraRecycled * 0.5;

    setText('resPenalty', eur(penaltySavings));
    setText('resTransport', eur(transportSavings));
    setText('resPrice', '–' + eur(canarioPrice));
    setText('resTotal', (totalSavings < 0 ? '–' : '') + eur(Math.abs(totalSavings)));
    setText('resRoi', roiMonths ? roiMonths + ' mesecev' : 'N/A');
    setText('ecoRecycled', Math.round(extraRecycled) + ' kg');
    setText('ecoCo2', Math.round(co2Saved) + ' kg CO₂');
}

document.getElementById('calcBtn').addEventListener('click', calculate);
calculate();
