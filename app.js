let db = { data: [], lokasi: [], pengeluaran: [], target: 250000 };

// Load data
window.onload = () => {
  const saved = localStorage.getItem('gajikuDB');
  if(saved) db = JSON.parse(saved);
  setTanggalHariIni();
  renderSemua();
};

function simpan() {
  localStorage.setItem('gajikuDB', JSON.stringify(db));
}
function setTanggalHariIni(){
  document.getElementById('tanggal').valueAsDate = new Date();
}

// 1. TAMBAH DATA KERJA
function tambahData() {
  const tanggal = document.getElementById('tanggal').value;
  const lokasiId = document.getElementById('lokasi').value;
  const jumlah = parseFloat(document.getElementById('jumlah').value);
  const lokasi = db.lokasi.find(l=>l.id==lokasiId);
  if(!tanggal ||!lokasiId ||!jumlah) return alert('Isi semua dulu');
  
  let total = 0;
  if(lokasi.jenis == 'kamar' || lokasi.jenis == 'jam') total = jumlah * lokasi.tarif;
  if(lokasi.jenis == 'borongan') total = lokasi.tarif;

  db.data.push({ tanggal, lokasiId, lokasiNama: lokasi.nama, jumlah, total });
  simpan();
  renderSemua();
  document.getElementById('jumlah').value = '';
  alert('Data tersimpan!');
}

// 2. KELOLA LOKASI
function tambahLokasi(){
  const nama = document.getElementById('namaLokasi').value;
  const tarif = parseFloat(document.getElementById('tarifLokasi').value);
  const jenis = document.getElementById('jenisLokasi').value;
  if(!nama ||!tarif) return alert('Isi nama dan tarif');
  db.lokasi.push({id: Date.now(), nama, tarif, jenis});
  simpan(); renderLokasi(); renderSelectLokasi();
}
function renderLokasi(){
  const div = document.getElementById('daftarLokasi');
  div.innerHTML = db.lokasi.map(l=>`<p>${l.nama} - ¥${l.tarif} /${l.jenis}</p>`).join('');
}
function renderSelectLokasi(){
  const sel = document.getElementById('lokasi');
  sel.innerHTML = '<option value="">Pilih Lokasi</option>' + db.lokasi.map(l=>`<option value="${l.id}">${l.nama}</option>`).join('');
}

// 3. RENDER KALENDER
function renderKalender() {
  const grid = document.getElementById('kalender'); // PENTING: id nya kalender
  if(!grid) return;
  grid.innerHTML = '';
  const d = new Date();
  const y = d.getFullYear(), m = d.getMonth();
  const jmlHari = new Date(y, m + 1, 0).getDate();
  const mulai = new Date(y, m, 1).getDay();

  ['Min','Sen','Sel','Rab','Kam','Jum','Sab'].forEach(h=>{
    grid.innerHTML += `<div style="font-size:11px;color:#9ca3af;font-weight:bold;text-align:center">${h}</div>`;
  });
  for(let i=0; i<mulai; i++) grid.innerHTML += `<div class="tanggal-kosong"></div>`;

  for(let t=1; t<=jmlHari; t++){
    const key = `${y}-${String(m+1).padStart(2,'0')}-${String(t).padStart(2,'0')}`;
    const dataHari = db.data.filter(d=>d.tanggal==key);
    const total = dataHari.reduce((a,b)=>a+b.total,0);
    const adaKerja = total > 0? 'ada-kerja' : '';
    grid.innerHTML += `
      <div class="kalender-item ${adaKerja}" onclick="lihatDetail('${key}', ${t})">
        <b>${t}</b>
        <small>${total?'¥'+total.toLocaleString():'-'}</small>
      </div>
    `;
  }
}
function lihatDetail(key, tgl) {
  const data = db.data.filter(d=>d.tanggal==key);
  if(data.length === 0) return alert(`Tanggal ${tgl}\nBelum ada kerjaan`);
  let teks = `Riwayat Tanggal ${tgl}\n\n`;
  let total = 0;
  data.forEach((d, i) => {
    teks += `${i+1}. ${d.lokasiNama} - ${d.jumlah}\n ¥${d.total.toLocaleString()}\n\n`;
    total += d.total;
  });
  teks += `TOTAL: ¥${total.toLocaleString()}`;
  alert(teks);
}

// 4. RENDER STATISTIK + DASHBOARD
function renderSemua(){
  renderKalender(); renderLokasi(); renderSelectLokasi();
  const d = new Date();
  const bulanIni = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
  const dataBulanIni = db.data.filter(x=>x.tanggal.startsWith(bulanIni));
  const totalPemasukan = dataBulanIni.reduce((a,b)=>a+b.total,0);
  const totalSemua = db.data.reduce((a,b)=>a+b.total,0);
  const totalPengeluaran = db.pengeluaran.reduce((a,b)=>a+b.jumlah,0);
  
  document.getElementById('totalGaji').innerText = '¥' + totalPemasukan.toLocaleString(); // PENTING: id nya totalGaji
  document.getElementById('totalSemua').innerText = 'Total Semua: ¥' + totalSemua.toLocaleString();
  
  const persen = db.target > 0 ? (totalPemasukan / db.target * 100).toFixed(0) : 0;
  document.getElementById('progressBar').style.width = persen + '%';
  document.getElementById('progressText').innerText = persen + '%';
}
function ubahTarget(){
  const t = prompt("Masukkan target baru:", db.target);
  if(t){ db.target = parseFloat(t); simpan(); renderSemua(); }
}

// 5. PENGELUARAN
function tambahPengeluaran(){
  const nama = document.getElementById('namaPengeluaran').value;
  const jumlah = parseFloat(document.getElementById('jumlahPengeluaran').value);
  if(!nama ||!jumlah) return alert('Isi semua');
  db.pengeluaran.push({nama, jumlah, tanggal: new Date().toISOString().slice(0,10)});
  simpan(); renderSemua();
}

// 6. BACKUP
function exportBackup(){ /* ... */ }
function importBackup(){ /* ... */ }
