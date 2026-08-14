// GAJIKU JEPANG v19 - FIX IMPORT
let db = { data: [], lokasi: [], target: 250000, bahasa: 'id' };

// FUNGSI CORE
function muat(){
  const d = localStorage.getItem('gajikuDB');
  if(d){ db = JSON.parse(d); }
}
function simpan(){
  localStorage.setItem('gajikuDB', JSON.stringify(db));
}

// PAS BUKA LANGSUNG BACA + GAMBAR
document.addEventListener('DOMContentLoaded', () => {
  muat();
  renderSemua();
});

// RENDER SEMUA TAMPILAN
function renderSemua(){
  renderKalender();
  renderTotal();
  renderLokasi();
}

// KALENDER
function renderKalender(){
  const kalender = document.getElementById('kalender');
  if(!kalender) return;
  kalender.innerHTML = '';
  const bulanIni = new Date().getMonth();
  const tahunIni = new Date().getFullYear();
  const tglAwal = new Date(tahunIni, bulanIni, 1).getDay();
  const jmlHari = new Date(tahunIni, bulanIni + 1, 0).getDate();

  for(let i=0; i<tglAwal; i++) kalender.innerHTML += `<div></div>`;
  for(let tgl=1; tgl<=jmlHari; tgl++){
    const dataHari = db.data.find(d => d.tgl === `${tahunIni}-${String(bulanIni+1).padStart(2,'0')}-${String(tgl).padStart(2,'0')}`);
    kalender.innerHTML += `<div class="tgl ${dataHari? 'ada-data' : ''}">${tgl}<br><small>${dataHari? '¥'+dataHari.gaji : '-'}</small></div>`;
  }
}

// TOTAL
function renderTotal(){
  const totalEl = document.getElementById('totalGaji');
  if(!totalEl) return;
  const total = db.data.reduce((a,b) => a + b.gaji, 0);
  totalEl.innerText = '¥' + total.toLocaleString('ja-JP');
}

// LOKASI
function renderLokasi(){
  const sel = document.getElementById('lokasi');
  if(!sel) return;
  sel.innerHTML = '<option value="">Pilih Lokasi</option>';
  db.lokasi.forEach(l => sel.innerHTML += `<option>${l}</option>`);
}

// TAMBAH DATA
function tambahData(){
  const tgl = document.getElementById('tgl').value;
  const jam = document.getElementById('jam').value;
  const gaji = parseInt(document.getElementById('gaji').value);
  const lokasi = document.getElementById('lokasi').value;
  if(!tgl ||!jam ||!gaji ||!lokasi) return alert('Lengkapi dulu');
  
  db.data.push({tgl, jam, gaji, lokasi});
  simpan(); // SIMPEN KE HP
  renderSemua();
  alert('Data tersimpan!');
}

// EXPORT
function exportBackup(){
  const blob = new Blob([JSON.stringify(db, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'gajiku-backup.json'; a.click();
}

// IMPORT - INI YG UDAH DIBENERIN
function importBackup(){
  const file = document.getElementById('importFile').files[0];
  if(!file) return alert('Pilih file dulu ya');

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      let dataImport = JSON.parse(e.target.result);

      // Anti gagal kalau format lama
      if(Array.isArray(dataImport)){
        dataImport = { data: dataImport, lokasi: [], target: 250000, bahasa: 'id' };
      }

      db = {
        data: dataImport.data || [],
        lokasi: dataImport.lokasi || [],
        target: dataImport.target || 250000,
        bahasa: dataImport.bahasa || 'id'
      };

      simpan(); // SIMPEN KE HP
      renderSemua(); // LANGSUNG MUNCUL

      alert('✅ Import berhasil! \nData 2 bulan kamu sudah kembali');
      navigator.vibrate && navigator.vibrate(200);

    } catch(err) {
      alert('❌ Gagal import: ' + err.message)
    }
  };
  reader.readAsText(file);
}
