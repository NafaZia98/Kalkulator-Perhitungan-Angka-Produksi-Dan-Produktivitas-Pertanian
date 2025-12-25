// Data sektor
const sectors = {
    pangan: {
        name: 'Tanaman Pangan',
        icon: '🌾',
        komoditas: ['Padi', 'Jagung', 'Kedelai', 'Kacang Hijau', 'Kacang Tanah', 'Ubi Kayu']
    },
    hortikultura: {
        name: 'Hortikultura',
        icon: '🥬',
        komoditas: []
    },
    peternakan: {
        name: 'Peternakan',
        icon: '🐄',
        komoditas: ['Sapi Bali Jantan', 'Sapi Bali Betina', 'Babi', 'Ayam']
    },
    perkebunan: {
        name: 'Perkebunan',
        icon: '🌴',
        komoditas: []
    }
};

// State aplikasi
let currentSector = null;
let formData = {
    namaKelompok: '',
    lokasi: '',
    jenisKomoditas: '',
    jenisVarietas: '',
    luasPanen: '',
    beratUbinan: '',
    jenisTernak: ''
};
let results = null;

// DOM Elements
const sectorSelectionPage = document.getElementById('sectorSelectionPage');
const calculatorPage = document.getElementById('calculatorPage');
const sectorCards = document.querySelectorAll('.sector-card');
const backButton = document.getElementById('backButton');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');
const resetBtn2 = document.getElementById('resetBtn2');
const copyBtn = document.getElementById('copyBtn');

// Event Listeners untuk Pilih Sektor
sectorCards.forEach(card => {
    card.addEventListener('click', () => {
        const sector = card.getAttribute('data-sector');
        selectSector(sector);
    });
});

// Event Listener Tombol Kembali
backButton.addEventListener('click', () => {
    currentSector = null;
    resetForm();
    sectorSelectionPage.classList.add('active');
    calculatorPage.classList.remove('active');
});

// Event Listener Tombol Hitung
calculateBtn.addEventListener('click', handleCalculate);

// Event Listener Tombol Reset
resetBtn.addEventListener('click', resetForm);
resetBtn2.addEventListener('click', resetForm);

// Event Listener Tombol Salin
copyBtn.addEventListener('click', copyResults);

// Fungsi Pilih Sektor
function selectSector(sector) {
    currentSector = sector;
    const sectorData = sectors[sector];
    
    // Update halaman
    sectorSelectionPage.classList.remove('active');
    calculatorPage.classList.add('active');
    
    // Update class untuk styling
    calculatorPage.className = 'page active ' + sector;
    
    // Update header
    document.getElementById('headerIcon').textContent = sectorData.icon;
    document.getElementById('sectorTitle').textContent = sectorData.name;
    document.getElementById('calcHeader').className = 'calc-header ' + sector;
    
    // Update form section class
    document.getElementById('formSection').className = 'form-section ' + sector;
    
    // Update button class
    document.getElementById('calculateBtn').className = 'btn-calculate ' + sector;
    
    // Update label dan visibility field
    if (sector === 'peternakan') {
        document.getElementById('labelNama').textContent = 'Nama Pemilik/Pelaku Usaha';
        document.getElementById('labelBerat').textContent = 'Berat Ternak (Kg)';
        document.getElementById('komoditasGroup').style.display = 'none';
        document.getElementById('jenisternakGroup').style.display = 'block';
        document.getElementById('varietasGroup').style.display = 'none';
        document.getElementById('luasPanenGroup').style.display = 'none';
        
        // Populate jenis ternak
        const selectTernak = document.getElementById('jenisTernak');
        selectTernak.innerHTML = '<option value="">Pilih Jenis Ternak</option>';
        sectorData.komoditas.forEach(k => {
            const option = document.createElement('option');
            option.value = k;
            option.textContent = k;
            selectTernak.appendChild(option);
        });
    } else {
        document.getElementById('labelNama').textContent = 'Nama Kelompok Tani';
        document.getElementById('labelBerat').textContent = 'Berat Ubinan (Kg)';
        document.getElementById('komoditasGroup').style.display = 'block';
        document.getElementById('jenisternakGroup').style.display = 'none';
        document.getElementById('varietasGroup').style.display = 'block';
        document.getElementById('luasPanenGroup').style.display = 'block';
        
        // Populate komoditas
        const selectKomoditas = document.getElementById('jenisKomoditas');
        if (sectorData.komoditas.length > 0) {
            selectKomoditas.innerHTML = '<option value="">Pilih Komoditas</option>';
            selectKomoditas.disabled = false;
            sectorData.komoditas.forEach(k => {
                const option = document.createElement('option');
                option.value = k;
                option.textContent = k;
                selectKomoditas.appendChild(option);
            });
        } else {
            selectKomoditas.innerHTML = '<option value="">Input Manual</option>';
            selectKomoditas.disabled = true;
        }
    }
}

// Fungsi Hitung
function handleCalculate() {
    // Ambil data form
    formData.namaKelompok = document.getElementById('namaKelompok').value;
    formData.lokasi = document.getElementById('lokasi').value;
    formData.jenisKomoditas = document.getElementById('jenisKomoditas').value;
    formData.jenisVarietas = document.getElementById('jenisVarietas').value;
    formData.luasPanen = document.getElementById('luasPanen').value;
    formData.beratUbinan = document.getElementById('beratUbinan').value;
    formData.jenisTernak = document.getElementById('jenisTernak').value;
    
    const beratUbinan = parseFloat(formData.beratUbinan);
    const luasPanen = parseFloat(formData.luasPanen);
    
    if (!beratUbinan) {
        alert('Mohon masukkan berat!');
        return;
    }
    
    if (currentSector !== 'peternakan' && !luasPanen) {
        alert('Mohon masukkan luas panen!');
        return;
    }
    
    let calculatedResults = null;
    
    if (currentSector === 'pangan') {
        switch(formData.jenisKomoditas) {
            case 'Padi':
                calculatedResults = calculatePadi(beratUbinan, luasPanen);
                break;
            case 'Jagung':
                calculatedResults = calculateJagung(beratUbinan, luasPanen);
                break;
            case 'Kedelai':
                calculatedResults = calculateKedelai(beratUbinan, luasPanen);
                break;
            case 'Kacang Hijau':
                calculatedResults = calculateKacangHijau(beratUbinan, luasPanen);
                break;
            case 'Kacang Tanah':
                calculatedResults = calculateKacangTanah(beratUbinan, luasPanen);
                break;
            case 'Ubi Kayu':
                calculatedResults = calculateUbiKayu(beratUbinan, luasPanen);
                break;
        }
    } else if (currentSector === 'hortikultura' || currentSector === 'perkebunan') {
        calculatedResults = calculateHortiPerkebunan(beratUbinan, luasPanen);
    } else if (currentSector === 'peternakan') {
        calculatedResults = calculatePeternakan(beratUbinan, formData.jenisTernak);
    }
    
    results = calculatedResults;
    displayResults();
}

// Fungsi Kalkulasi Padi
function calculatePadi(beratUbinan, luasPanen) {
    const gkp = beratUbinan * 16;
    const gkg = gkp * 0.8456;
    const beras = gkg * 0.6261;
    
    return {
        produktivitas: {
            'GKP': gkp.toFixed(2),
            'GKG': gkg.toFixed(2),
            'Beras': beras.toFixed(2)
        },
        produksi: {
            'GKP': (luasPanen * gkp).toFixed(2),
            'GKG': (luasPanen * gkg).toFixed(2),
            'Beras': (luasPanen * beras).toFixed(2)
        }
    };
}

// Fungsi Kalkulasi Jagung
function calculateJagung(beratUbinan, luasPanen) {
    const keringPanen = beratUbinan * 16;
    const ppilanKering = keringPanen * 0.5673;
    
    return {
        produktivitas: {
            'Kering Panen': keringPanen.toFixed(2),
            'Pipilan Kering': ppilanKering.toFixed(2)
        },
        produksi: {
            'Kering Panen': (luasPanen * keringPanen).toFixed(2),
            'Pipilan Kering': (luasPanen * ppilanKering).toFixed(2)
        }
    };
}

// Fungsi Kalkulasi Kedelai
function calculateKedelai(beratUbinan, luasPanen) {
    const polongPanen = beratUbinan * 16;
    const bijiKering = polongPanen * 0.369;
    
    return {
        produktivitas: {
            'Polong Panen': polongPanen.toFixed(2),
            'Biji Kering': bijiKering.toFixed(2)
        },
        produksi: {
            'Polong Panen': (luasPanen * polongPanen).toFixed(2),
            'Biji Kering': (luasPanen * bijiKering).toFixed(2)
        }
    };
}

// Fungsi Kalkulasi Kacang Hijau
function calculateKacangHijau(beratUbinan, luasPanen) {
    const polongKering = beratUbinan * 16;
    const bijiKering = polongKering * 0.67;
    
    return {
        produktivitas: {
            'Polong Kering': polongKering.toFixed(2),
            'Biji Kering': bijiKering.toFixed(2)
        },
        produksi: {
            'Polong Kering': (luasPanen * polongKering).toFixed(2),
            'Biji Kering': (luasPanen * bijiKering).toFixed(2)
        }
    };
}

// Fungsi Kalkulasi Kacang Tanah
function calculateKacangTanah(beratUbinan, luasPanen) {
    const glondonganBasah = beratUbinan * 16;
    const glondonganKering = glondonganBasah * 0.53;
    const bijiKering = glondonganKering * 0.32;
    
    return {
        produktivitas: {
            'Glondongan Basah': glondonganBasah.toFixed(2),
            'Glondongan Kering': glondonganKering.toFixed(2),
            'Biji Kering': bijiKering.toFixed(2)
        },
        produksi: {
            'Glondongan Basah': (luasPanen * glondonganBasah).toFixed(2),
            'Biji Kering': (luasPanen * bijiKering).toFixed(2)
        }
    };
}

// Fungsi Kalkulasi Ubi Kayu
function calculateUbiKayu(beratUbinan, luasPanen) {
    const ubiBasah = beratUbinan * 16;
    const ubiLepasKulit = ubiBasah * 0.8;
    const gaplek = ubiLepasKulit * 0.36;
    const tepungKampung = gaplek * 0.265;
    
    return {
        produktivitas: {
            'Ubi Basah': ubiBasah.toFixed(2),
            'Ubi Lepas Kulit': ubiLepasKulit.toFixed(2),
            'Gaplek': gaplek.toFixed(2),
            'Tepung Kampung': tepungKampung.toFixed(2)
        },
        produksi: {
            'Ubi Basah': (luasPanen * ubiBasah).toFixed(2),
            'Ubi Lepas Kulit': (luasPanen * ubiLepasKulit).toFixed(2),
            'Gaplek': (luasPanen * gaplek).toFixed(2),
            'Tepung Kampung': (luasPanen * tepungKampung).toFixed(2)
        }
    };
}

// Fungsi Kalkulasi Hortikultura/Perkebunan
function calculateHortiPerkebunan(beratUbinan, luasPanen) {
    const produktivitas = beratUbinan * 16;
    
    return {
        produktivitas: {
            'Produk Segar': produktivitas.toFixed(2)
        },
        produksi: {
            'Produk Segar': (luasPanen * produktivitas).toFixed(2)
        }
    };
}

// Fungsi Kalkulasi Peternakan
function calculatePeternakan(beratTernak, jenisTernak) {
    let persenKarkas = 0;
    if (jenisTernak === 'Sapi Bali Jantan') persenKarkas = 0.50;
    else if (jenisTernak === 'Sapi Bali Betina') persenKarkas = 0.45;
    else if (jenisTernak === 'Ayam') persenKarkas = 0.75;
    else if (jenisTernak === 'Babi') persenKarkas = 0.70;
    
    const beratKarkas = beratTernak * persenKarkas;
    
    return {
        beratTernak: beratTernak.toFixed(2),
        persenKarkas: (persenKarkas * 100).toFixed(0),
        beratKarkas: beratKarkas.toFixed(2)
    };
}

// Fungsi Tampilkan Hasil
function displayResults() {
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
    
    // Display Input Data
    const inputDataSection = document.getElementById('inputDataSection');
    let inputHTML = `
        <div class="section-title">
            <span>📊</span>
            <h4>Data Input</h4>
        </div>
        <div class="data-grid">
    `;
    
    const colors = ['green', 'blue', 'purple', 'yellow', 'teal', 'rose'];
    let colorIndex = 0;
    
    inputHTML += `
        <div class="data-card ${colors[colorIndex++]}">
            <div class="data-label">${currentSector === 'peternakan' ? 'Kelompok/Pelaku' : 'Kelompok Tani'}:</div>
            <div class="data-value">${formData.namaKelompok}</div>
        </div>
        <div class="data-card ${colors[colorIndex++]}">
            <div class="data-label">Lokasi/Desa:</div>
            <div class="data-value">${formData.lokasi}</div>
        </div>
        <div class="data-card ${colors[colorIndex++]}">
            <div class="data-label">${currentSector === 'peternakan' ? 'Jenis Ternak' : 'Komoditas'}:</div>
            <div class="data-value">${currentSector === 'peternakan' ? formData.jenisTernak : formData.jenisKomoditas}</div>
        </div>
    `;
    
    if (currentSector !== 'peternakan') {
        inputHTML += `
            <div class="data-card ${colors[colorIndex++]}">
                <div class="data-label">Varietas:</div>
                <div class="data-value">${formData.jenisVarietas}</div>
            </div>
            <div class="data-card ${colors[colorIndex++]}">
                <div class="data-label">Luas Panen:</div>
                <div class="data-value">${formData.luasPanen} Ha</div>
            </div>
        `;
    }
    
    inputHTML += `
        <div class="data-card ${colors[colorIndex++]}">
            <div class="data-label">${currentSector === 'peternakan' ? 'Berat Ternak' : 'Berat Ubinan'}:</div>
            <div class="data-value">${formData.beratUbinan} Kg</div>
        </div>
    `;
    
    inputHTML += '</div>';
    inputDataSection.innerHTML = inputHTML;
    
    // Display Results Data
    const resultDataSection = document.getElementById('resultDataSection');
    let resultHTML = '';
    
    if (currentSector === 'peternakan') {
        resultHTML = `
            <div class="result-box green peternakan-results">
                <div class="section-title">
                    <span>🥩</span>
                    <h4>Hasil Perhitungan Karkas</h4>
                </div>
                <div class="result-item green">
                    <div class="result-row">
                        <span class="result-label">Berat Ternak:</span>
                        <span class="result-value">${results.beratTernak} Kg</span>
                    </div>
                </div>
                <div class="result-item green">
                    <div class="result-row">
                        <span class="result-label">Persentase Karkas:</span>
                        <span class="result-value">${results.persenKarkas}%</span>
                    </div>
                </div>
                <div class="result-item highlight">
                    <div class="result-row">
                        <span class="result-label">Berat Karkas:</span>
                        <span class="result-value">${results.beratKarkas} Kg</span>
                    </div>
                </div>
            </div>
        `;
    } else {
        resultHTML = `
            <div class="result-box green">
                <div class="section-title">
                    <span>🌾</span>
                    <h4>Angka Produktivitas</h4>
                </div>
        `;
        
        Object.entries(results.produktivitas).forEach(([key, value]) => {
            resultHTML += `
                <div class="result-item green">
                    <div class="result-row">
                        <span class="result-label">${key}:</span>
                        <span class="result-value green">${value} kuintal/Ha</span>
                    </div>
                </div>
            `;
        });
        
        resultHTML += '</div><div class="result-box blue"><div class="section-title"><span>📦</span><h4>Angka Produksi</h4></div>';
        
        Object.entries(results.produksi).forEach(([key, value]) => {
            resultHTML += `
                <div class="result-item blue">
                    <div class="result-row">
                        <span class="result-label">${key}:</span>
                        <span class="result-value blue">${value} kuintal</span>
                    </div>
                </div>
            `;
        });
        
        resultHTML += '</div>';
    }
    
    resultDataSection.innerHTML = resultHTML;
}

// Fungsi Reset Form
function resetForm() {
    document.getElementById('namaKelompok').value = '';
    document.getElementById('lokasi').value = '';
    document.getElementById('jenisKomoditas').value = '';
    document.getElementById('jenisVarietas').value = '';
    document.getElementById('luasPanen').value = '';
    document.getElementById('beratUbinan').value = '';
    document.getElementById('jenisTernak').value = '';
    
    formData = {
        namaKelompok: '',
        lokasi: '',
        jenisKomoditas: '',
        jenisVarietas: '',
        luasPanen: '',
        beratUbinan: '',
        jenisTernak: ''
    };
    
    results = null;
    
    document.getElementById('formSection').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
}

// Fungsi Salin Hasil
function copyResults() {
    let text = '=== HASIL PERHITUNGAN PRODUKTIVITAS PERTANIAN ===\n\n';
    text += `Nama Kelompok Tani: ${formData.namaKelompok}\n`;
    text += `Lokasi/Desa: ${formData.lokasi}\n`;
    
    if (currentSector === 'peternakan') {
        text += `Jenis Ternak: ${formData.jenisTernak}\n`;
        text += `Berat Ternak: ${results.beratTernak} Kg\n\n`;
        text += 'HASIL PERHITUNGAN:\n';
        text += `Persentase Karkas: ${results.persenKarkas}%\n`;
        text += `Berat Karkas: ${results.beratKarkas} Kg\n`;
    } else {
        text += `Jenis Komoditas: ${formData.jenisKomoditas}\n`;
        text += `Jenis Varietas: ${formData.jenisVarietas}\n`;
        text += `Luas Panen: ${formData.luasPanen} Ha\n`;
        text += `Berat Ubinan: ${formData.beratUbinan} Kg\n\n`;
        text += 'PRODUKTIVITAS:\n';
        Object.entries(results.produktivitas).forEach(([key, value]) => {
            text += `${key}: ${value} kuintal/Ha\n`;
        });
        text += '\nPRODUKSI:\n';
        Object.entries(results.produksi).forEach(([key, value]) => {
            text += `${key}: ${value} kuintal\n`;
        });
    }
    
    navigator.clipboard.writeText(text).then(() => {
        alert('Hasil perhitungan berhasil disalin!');
    }).catch(err => {
        console.error('Gagal menyalin:', err);
        alert('Gagal menyalin hasil perhitungan');
    });
}