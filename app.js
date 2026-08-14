let db = { kerja: {}, pengeluaran: [] };

// Load data dari localStorage pas buka
window.onload = () => {
  const saved = localStorage.getItem('laporanKerjaDB');
  if(saved) db = JSON.parse(saved);
  renderSemua();
};

// Simpan ke localStorage
function simpan() {
  localStorage.setItem('laporanKerjaDB', JSON.stringify(db));
}

// Render semua bagian
function renderSemua() {
  renderKalender();
  renderStatistik();
  renderRiwayatSingkat();
}

// 1. TAMBAH KERJA
function tambahKerja() {
  const tanggal = document.getElementById('tanggal').value;
  const jam = document.getElementById('jam').value;
  const deskripsi = document.getElementById('deskripsi').value;
  const total = parseFloat(document.getElementById('total').value);

  if(!tanggal ||!jam ||!deskripsi ||!total) return alert('Isi semua dulu');

  if(!db.kerja[tanggal]) db.kerja[tanggal] = [];
  db.kerja[tanggal].push({ jam, deskripsi, total });

  simpan();
  renderSemua();
  document.getElementById('deskripsi').value = '';
  document.getElementById('total').value = '';
  alert('Data kerja tersimpan!');
}

// 2. TAMBAH PENGELUARAN
function tambahPengeluaran() {
  const tanggal = document.getElementById('tglPengeluaran').value;
  const nama = document.getElementById('namaPengeluaran').value;
  const jumlah = parseFloat(document.getElementById('jumlahPengeluaran').value);

  if(!tanggal ||!nama ||!jumlah) return alert('Isi semua dulu');

  db.pengeluaran.push({ tanggal, nama, jumlah });
  simpan();
  renderStatistik();
  document.getElementById('namaPengeluaran').value = '';
  document.getElementById('jumlahPengeluaran').value = '';
  alert('Pengeluaran tersimpan!');
}

// 3. RENDER KALENDER GRID 7 KOLOM
function renderKalender() {
  const grid = document.getElementById('kalenderGrid');
  grid.innerHTML = '';
  const d = new Date();
  const y = d.getFullYear(), m = d.getMonth();
  const jmlHari = new Date(y, m + 1, 0).getDate();
  const mulai = new Date(y, m, 1).getDay();

  // Header Hari
  ['Min','Sen','Sel','Rab','Kam','Jum','Sab'].forEach(h=>{
    grid.innerHTML += `<div style="font-size:11px;color:#9ca3af;font-weight:bold;text-align:center">${h}</div>`;
  });

  // Kotak Kosong
  for(let i=0; i<mulai; i++) grid.innerHTML += `<div class="tanggal-kosong"></div>`;

  // Tanggal 1-31
  for(let t=1; t<=jmlHari; t++){
    const key = `${y}-${String(m+1).padStart(2,'0')}-${String(t).padStart(2,'0')}`;
    const data = db.kerja[key] || [];
    const total = data.reduce((a,b)=>a+b.total,0);
    const adaKerja = total > 0? 'ada-kerja' : '';

    grid.innerHTML += `
      <div class="kalender-item ${adaKerja}" onclick="lihatDetail('${key}', ${t})">
        <b>${t}</b>
        <small>${total?'¥'+total.toLocaleString():'-'}</small>
      </div>
    `;
  }
}

// 4. POPUP RIWAYAT KETIKA KLIK TANGGAL
function lihatDetail(key, tgl) {
  const data = db.kerja[key] || [];

  if(data.length === 0){
    alert(`Tanggal ${tgl}\nBelum ada kerjaan`);
    return;
  }

  let teks = `Riwayat Tanggal ${tgl}\n\n`;
  let total = 0;

  data.forEach((d, i) => {
    teks += `${i+1}. ${d.jam} - ${d.deskripsi}\n`;
    teks += ` ¥${d.total.toLocaleString()}\n\n`;
    total += d.total;
  });

  teks += `TOTAL: ¥${total.toLocaleString()}`;
  alert(teks);
}

// 5. RENDER STATISTIK
function renderStatistik() {
  const d = new Date();
  const bulanIni = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;

  let totalPemasukan = 0;
  let totalPengeluaran = 0;

  Object.keys(db.kerja).forEach(key => {
    if(key.startsWith(bulanIni)){
      db.kerja[key].forEach(k => totalPemasukan += k.total);
    }
  });

  db.pengeluaran.forEach(p => {
    if(p.tanggal.startsWith(bulanIni)) totalPengeluaran += p.jumlah;
  });

  document.getElementById('totalPemasukan').innerText = '¥' + totalPemasukan.toLocaleString();
  document.getElementById('totalPengeluaran').innerText = '¥' + totalPengeluaran.toLocaleString();
  document.getElementById('totalBersih').innerText = '¥' + (totalPemasukan - totalPengeluaran).toLocaleString();
}

// 6. RENDER RIWAYAT 5 TERAKHIR
function renderRiwayatSingkat() {
  const list = document.getElementById('riwayatList');
  list.innerHTML = '';
  let semua = [];

  Object.keys(db.kerja).forEach(key => {
    db.kerja[key].forEach(k => semua.push({...k, tanggal: key }));
  });

  semua.sort((a,b) => b.tanggal.localeCompare(a.tanggal)).slice(0,5).forEach(k => {
    list.innerHTML += `<div style="padding:8px;border-bottom:1px solid #374151">
      <b>${k.tanggal}</b> - ${k.deskripsi}<br>
      <small>${k.jam} | ¥${k.total.toLocaleString()}</small>
    </div>`;
  });
}

// 7. BACKUP & RESTORE
function backupData() {
  const dataStr = JSON.stringify(db);
  const blob = new Blob([dataStr], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup-laporan-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
}

function restoreData(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = e => {
    db = JSON.parse(e.target.result);
    simpan();
    renderSemua();
    alert('Data berhasil direstore!');
  };
  reader.readAsText(file);
}
