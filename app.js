let db = { data: [], lokasi: [], pengeluaran: [], target: 250000, bahasa: 'id' };
const bahasa = {
  id: { judul: "Pengelola Gaji & Absensi", input: "📝 Input Kerja", statistik: "📈 Statistik Bulan Ini", rekap: "📅 Rekap Bulanan", daftar: "📋 Daftar Lokasi", tambah: "➕ Tambah Lokasi Baru", hariKerja: "Hari Kerja", hariLibur: "Hari Libur", totalJam: "Total Jam", totalKamar: "Total Kamar", pendapatan: "Pendapatan", target: "🎯 Target Bulanan", pengeluaran: "💰 Pengeluaran", kalender: "🗓️ Kalender", backup: "💾 Backup & Restore" },
  en: { judul: "Salary & Attendance Manager", input: "📝 Work Input", statistik: "📈 Monthly Stats", rekap: "📅 Monthly Recap", daftar: "📋 Location List", tambah: "➕ Add New Location", hariKerja: "Work Days", hariLibur: "Days Off", totalJam: "Total Hours", totalKamar: "Total Rooms", pendapatan: "Earnings", target: "🎯 Monthly Target", pengeluaran: "💰 Expenses", kalender: "🗓️ Calendar", backup: "💾 Backup & Restore" },
  jp: { judul: "給与・勤怠管理", input: "📝 作業入力", statistik: "📈 今月の統計", rekap: "📅 月間集計", daftar: "📋 場所リスト", tambah: "➕ 新しい場所を追加", hariKerja: "出勤日数", hariLibur: "休日", totalJam: "合計時間", totalKamar: "合計部屋数", pendapatan: "収入", target: "🎯 月間目標", pengeluaran: "💰 支出", kalender: "🗓️ カレンダー", backup: "💾 バックアップ" }
};

window.onload = () => {
  const saved = localStorage.getItem('gajikuDB');
  if(saved) db = JSON.parse(saved);
  document.getElementById('pilihBahasa').value = db.bahasa;
  gantiBahasa(); setTanggalHariIni(); renderSemua();
};
function simpan() { localStorage.setItem('gajikuDB', JSON.stringify(db)); }
function setTanggalHariIni(){ document.getElementById('tanggal').valueAsDate = new Date(); }

function gantiBahasa(){
  db.bahasa = document.getElementById('pilihBahasa').value;
  const b = bahasa[db.bahasa];
  document.getElementById('subJudul').innerText = b.judul;
  document.getElementById('judulInput').innerText = b.input;
  document.getElementById('judulStatistik').innerText = b.statistik;
  document.getElementById('judulRekap').innerText = b.rekap;
  document.getElementById('judulDaftarLokasi').innerText = b.daftar;
  document.getElementById('judulTambahLokasi').innerText = b.tambah;
  document.getElementById('judulTarget').innerText = b.target;
  document.getElementById('judulPengeluaran').innerText = b.pengeluaran;
  document.getElementById('judulKalender').innerText = b.kalender;
  document.getElementById('judulBackup').innerText = b.backup;
  simpan(); renderSemua();
}

function tambahData() {
  const tanggal = document.getElementById('tanggal').value;
  const lokasiId = document.getElementById('lokasi').value;
  const jumlah = parseFloat(document.getElementById('jumlah').value);
  const lokasi = db.lokasi.find(l=>l.id==lokasiId);
  if(!tanggal ||!lokasiId ||!jumlah) return alert('Isi semua dulu');
  let total = (lokasi.jenis == 'kamar' || lokasi.jenis == 'jam') ? jumlah * lokasi.tarif : lokasi.tarif;
  db.data.push({ tanggal, lokasiId, lokasiNama: lokasi.nama, jumlah, total, jenis: lokasi.jenis });
  simpan(); renderSemua(); document.getElementById('jumlah').value = ''; alert('Data tersimpan!');
}

function simpanLokasiBaru(){
  const nama = document.getElementById('namaLokasi').value;
  const tarif = parseFloat(document.getElementById('tarifLokasi').value);
  const jenis = document.getElementById('jenisLokasi').value;
  if(!nama ||!tarif) return alert('Isi nama dan tarif');
  db.lokasi.push({id: Date.now(), nama, tarif, jenis});
  simpan(); renderSelectLokasi(); closePopupLokasi();
  document.getElementById('namaLokasi').value = ''; document.getElementById('tarifLokasi').value = '';
}
function renderSelectLokasi(){
  const sel = document.getElementById('lokasi');
  sel.innerHTML = '<option value="">Pilih Lokasi</option>' + db.lokasi.map(l=>`<option value="${l.id}">${l.nama}</option>`).join('');
}
function openPopupLokasi(){ document.getElementById('popupLokasi').style.display = 'block'; document.getElementById('popupOverlay2').style.display = 'block'; }
function closePopupLokasi(){ document.getElementById('popupLokasi').style.display = 'none'; document.getElementById('popupOverlay2').style.display = 'none'; }
function openPopupDaftarLokasi(){ renderDaftarLokasiPopup(); document.getElementById('popupDaftarLokasi').style.display = 'block'; document.getElementById('popupOverlay2').style.display = 'block'; }
function closePopupDaftarLokasi(){ document.getElementById('popupDaftarLokasi').style.display = 'none'; document.getElementById('popupOverlay2').style.display = 'none'; }
function renderDaftarLokasiPopup(){
  const div = document.getElementById('isiDaftarLokasi');
  if(db.lokasi.length === 0){ div.innerHTML = '<p>Belum ada lokasi</p>'; return; }
  div.innerHTML = db.lokasi.map(l=>`
    <div class="stat-item">
      <div><b>${l.nama}</b><br><small>¥${l.tarif.toLocaleString()}/${l.jenis}</small></div>
      <button onclick="hapusLokasi(${l.id})" class="btn-danger" style="width:auto;padding:6px 10px;font-size:12px">Hapus</button>
    </div>
  `).join('');
}
function hapusLokasi(id){ if(confirm('Yakin hapus?')){ db.lokasi = db.lokasi.filter(l=>l.id != id); simpan(); renderSelectLokasi(); renderDaftarLokasiPopup(); } }

function renderKalender() {
  const grid = document.getElementById('kalender'); if(!grid) return; grid.innerHTML = '';
  const d = new Date(); const y = d.getFullYear(), m = d.getMonth();
  const jmlHari = new Date(y, m + 1, 0).getDate(); const mulai = new Date(y, m, 1).getDay();
  ['Min','Sen','Sel','Rab','Kam','Jum','Sab'].forEach(h=>{ grid.innerHTML += `<div style="font-size:11px;color:#9ca3af;font-weight:bold;text-align:center">${h}</div>`; });
  for(let i=0; i<mulai; i++) grid.innerHTML += `<div class="tanggal-kosong"></div>`;
  for(let t=1; t<=jmlHari; t++){
    const key = `${y}-${String(m+1).padStart(2,'0')}-${String(t).padStart(2,'0')}`;
    const dataHari = db.data.filter(d=>d.tanggal==key); const total = dataHari.reduce((a,b)=>a+b.total,0);
    const adaKerja = total > 0? 'ada-kerja' : '';
    grid.innerHTML += `<div class="kalender-item ${adaKerja}" onclick="alert('Tanggal ${t}: ¥${total.toLocaleString()}')"><b>${t}</b><small>${total?'¥'+total.toLocaleString():'-'}</small></div>`;
  }
}

function renderStatistik(){
  const d = new Date(); const bulanIni = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
  const dataBulanIni = db.data.filter(x=>x.tanggal.startsWith(bulanIni));
  const jmlHari = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const hariKerja = [...new Set(dataBulanIni.map(x=>x.tanggal))].length; const hariLibur = jmlHari - hariKerja;
  const b = bahasa[db.bahasa];
  let html = `<div class="stat-item"><span>${b.hariKerja}</span><b>${hariKerja} hari</b></div>`;
  html += `<div class="stat-item"><span>${b.hariLibur}</span><b>${hariLibur} hari</b></div>`;
  db.lokasi.forEach(l=>{
    const dataLokasi = dataBulanIni.filter(x=>x.lokasiId == l.id);
    const total = dataLokasi.reduce((a,b)=>a+b.total,0); const jumlah = dataLokasi.reduce((a,b)=>a+b.jumlah,0);
    if(jumlah > 0){
      if(l.jenis == 'jam') html += `<div class="stat-item"><span>${l.nama} - ${b.totalJam}</span><b>${jumlah} jam / ¥${total.toLocaleString()}</b></div>`;
      if(l.jenis == 'kamar') html += `<div class="stat-item"><span>${l.nama} - ${b.totalKamar}</span><b>${jumlah} kamar / ¥${total.toLocaleString()}</b></div>`;
    }
  });
  document.getElementById('statistik').innerHTML = html;
}

function tambahPengeluaran(){
  const nama = document.getElementById('namaPengeluaran').value; const jumlah = parseFloat(document.getElementById('jumlahPengeluaran').value);
  if(!nama ||!jumlah) return alert('Isi semua'); db.pengeluaran.push({nama, jumlah, tanggal: new Date().toISOString().slice(0,10)});
  simpan(); renderSemua(); document.getElementById('namaPengeluaran').value = ''; document.getElementById('jumlahPengeluaran').value = '';
}

function renderSemua(){
  renderKalender(); renderSelectLokasi(); renderStatistik();
  const d = new Date(); const bulanIni = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
  const dataBulanIni = db.data.filter(x=>x.tanggal.startsWith(bulanIni));
  const totalBulanIni = dataBulanIni.reduce((a,b)=>a+b.total,0);
  const pengeluaranBulanIni = db.pengeluaran.filter(x=>x.tanggal.startsWith(bulanIni));
  const totalPengeluaran = pengeluaranBulanIni.reduce((a,b)=>a+b.jumlah,0);
  const totalSejakAwal = db.data.reduce((a,b)=>a+b.total,0);
  
  document.getElementById('totalGaji').innerText = '¥' + totalBulanIni.toLocaleString();
  document.getElementById('totalSemua').innerText = `Total Bulan Ini: ¥${totalBulanIni.toLocaleString()}`;
  document.getElementById('targetText').innerText = `¥${db.target.toLocaleString()}`;
  const persen = db.target > 0 ? (totalBulanIni / db.target * 100).toFixed(0) : 0;
  document.getElementById('progressBar').style.width = persen + '%'; document.getElementById('progressText').innerText = persen + '%';
  
  const bersih = totalBulanIni - totalPengeluaran;
  document.getElementById('ringkasanKeuangan').innerHTML = `
    <div class="stat-item"><span>Pemasukan</span><b style="color:#10b981">¥${totalBulanIni.toLocaleString()}</b></div>
    <div class="stat-item"><span>Pengeluaran</span><b style="color:#ef4444">¥${totalPengeluaran.toLocaleString()}</b></div>
    <div class="stat-item"><span>Bersih</span><b>¥${bersih.toLocaleString()}</b></div>`;
  
  document.getElementById('totalSejakAwal').innerHTML = `<div class="stat-item"><span>Total Sejak Awal</span><b style="color:#3b82f6">¥${totalSejakAwal.toLocaleString()}</b></div>`;
}
function ubahTarget(){ const t = prompt("Masukkan target baru:", db.target); if(t){ db.target = parseFloat(t); simpan(); renderSemua(); } }
function shareLaporan(){
  const d = new Date(); const bulanIni = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
  const dataBulanIni = db.data.filter(x=>x.tanggal.startsWith(bulanIni)); const total = dataBulanIni.reduce((a,b)=>a+b.total,0);
  const teks = `Laporan GajiKu Jepang - ${bulanIni}\nTotal Pendapatan: ¥${total.toLocaleString()}\nJumlah Kerja: ${dataBulanIni.length} kali`;
  if(navigator.share){ navigator.share({ title: 'Laporan GajiKu', text: teks }); }
  else { navigator.clipboard.writeText(teks); alert('Laporan disalin!'); }
}
function exportBackup(){ /* ... */ } function importBackup(){ /* ... */ }
