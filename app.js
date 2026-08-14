let db = { data: [], lokasi: [], target: 250000, bahasa: 'id' };
let bulanAktif = new Date();
let idEdit = null;
let tanggalAktifPopup = null;

const bahasa = {
  id: { judul: "Pengelola Gaji & Absensi", statistik: "📈 Statistik", rekap: "📅 Rekap Bulanan", daftar: "📋 Daftar Lokasi", tambah: "➕ Tambah Lokasi Baru", hariKerja: "Hari Kerja", hariLibur: "Hari Libur", totalJam: "Total Jam", totalKamar: "Total Kamar", target: "🎯 Target Bulanan", kalender: "🗓️ Kalender", backup: "💾 Backup & Data", pendapatan: "💴 Pendapatan Bulan" },
  en: { judul: "Salary Manager", statistik: "📈 Statistics", rekap: "📅 Monthly Recap", daftar: "📋 Location List", tambah: "➕ Add Location", hariKerja: "Work Days", hariLibur: "Days Off", totalJam: "Total Hours", totalKamar: "Total Rooms", target: "🎯 Monthly Target", kalender: "🗓️ Calendar", backup: "💾 Backup & Data", pendapatan: "💴 Income for" },
  jp: { judul: "給与管理", statistik: "📈 今月の統計", rekap: "📅 月間集計", daftar: "📋 場所リスト", tambah: "➕ 場所を追加", hariKerja: "出勤日数", hariLibur: "休日", totalJam: "合計時間", totalKamar: "合計部屋数", target: "🎯 月間目標", kalender: "🗓️ カレンダー", backup: "💾 バックアップ", pendapatan: "💴 の収入" }
};

window.onload = () => {
  const saved = localStorage.getItem('gajikuDB');
  if(saved) db = JSON.parse(saved);
  document.getElementById('pilihBahasa').value = db.bahasa;
  gantiBahasa();
  renderSemua();
};

function simpan() { localStorage.setItem('gajikuDB', JSON.stringify(db)); }

function gantiBahasa(){
  db.bahasa = document.getElementById('pilihBahasa').value;
  const b = bahasa[db.bahasa];
  document.getElementById('subJudul').innerText = b.judul;
  document.getElementById('judulStatistik').innerText = b.statistik;
  document.getElementById('judulRekap').innerText = b.rekap;
  document.getElementById('judulDaftarLokasi').innerText = b.daftar;
  document.getElementById('judulTambahLokasi').innerText = b.tambah;
  document.getElementById('judulTarget').innerText = b.target;
  document.getElementById('judulKalender').innerText = b.kalender;
  document.getElementById('judulBackup').innerText = b.backup;
  simpan();
  renderSemua();
}

function gantiBulanHeader(dir){ bulanAktif.setMonth(bulanAktif.getMonth() + dir); renderSemua(); }

// POPUP
function openPopupLokasi(){ document.getElementById('popupLokasi').style.display = 'block'; document.getElementById('popupOverlay2').style.display = 'block'; }
function closePopupLokasi(){ document.getElementById('popupLokasi').style.display = 'none'; document.getElementById('popupOverlay2').style.display = 'none'; }
function openPopupDaftarLokasi(){ renderDaftarLokasiPopup(); document.getElementById('popupDaftarLokasi').style.display = 'block'; document.getElementById('popupOverlay2').style.display = 'block'; }
function closePopupDaftarLokasi(){ document.getElementById('popupDaftarLokasi').style.display = 'none'; document.getElementById('popupOverlay2').style.display = 'none'; }
function openPopupRekap(){ renderPopupRekap(); document.getElementById('popupRekap').style.display = 'block'; document.getElementById('popupOverlay2').style.display = 'block'; }
function closePopupRekap(){ document.getElementById('popupRekap').style.display = 'none'; document.getElementById('popupOverlay2').style.display = 'none'; }
function openPopupDetail(tgl){ tanggalAktifPopup = tgl; renderPopupDetail(tgl); document.getElementById('popupDetail').style.display = 'block'; document.getElementById('popupOverlay2').style.display = 'block'; }
function closePopupDetail(){ document.getElementById('popupDetail').style.display = 'none'; document.getElementById('popupOverlay2').style.display = 'none'; }
function openPopupEdit(id){ idEdit = id; const data = db.data.find(d=>d.id==id); document.getElementById('editTanggal').value = data.tanggal; renderSelectEditLokasi(); document.getElementById('editLokasi').value = data.lokasiId; document.getElementById('editJumlah').value = data.jumlah; document.getElementById('popupEdit').style.display = 'block'; document.getElementById('popupOverlay2').style.display = 'block'; }
function closePopupEdit(){ document.getElementById('popupEdit').style.display = 'none'; document.getElementById('popupOverlay2').style.display = 'none'; }
function openPopupStatistik(){ renderPopupStatistik(); document.getElementById('popupStatistik').style.display = 'block'; document.getElementById('popupOverlay2').style.display = 'block'; }
function closePopupStatistik(){ document.getElementById('popupStatistik').style.display = 'none'; document.getElementById('popupOverlay2').style.display = 'none'; }
function openPopupInputDariDetail(){ renderSelectInputLokasi(); document.getElementById('inputTanggal').value = tanggalAktifPopup; document.getElementById('inputTanggalText').innerText = `Tanggal: ${tanggalAktifPopup}`; document.getElementById('inputJumlah').value = ''; document.getElementById('popupInput').style.display = 'block'; }
function closePopupInput(){ document.getElementById('popupInput').style.display = 'none'; }
function closeSemuaPopup(){ closePopupLokasi(); closePopupDaftarLokasi(); closePopupRekap(); closePopupDetail(); closePopupEdit(); closePopupInput(); closePopupStatistik(); }

// LOKASI
function simpanLokasiBaru(){
  const nama = document.getElementById('namaLokasi').value;
  const tarif = parseFloat(document.getElementById('tarifLokasi').value);
  const jenis = document.getElementById('jenisLokasi').value;
  if(!nama ||!tarif) return alert('Isi nama dan tarif');
  db.lokasi.push({id: Date.now(), nama, tarif, jenis});
  simpan(); renderSelectInputLokasi(); closePopupLokasi();
  document.getElementById('namaLokasi').value = ''; document.getElementById('tarifLokasi').value = '';
}
function renderSelectInputLokasi(){
  const sel = document.getElementById('inputLokasi');
  sel.innerHTML = '<option value="">Pilih Lokasi</option>' + db.lokasi.map(l=>`<option value="${l.id}">${l.nama}</option>`).join('');
}
function renderSelectEditLokasi(){
  const sel = document.getElementById('editLokasi');
  sel.innerHTML = db.lokasi.map(l=>`<option value="${l.id}">${l.nama}</option>`).join('');
}
function renderDaftarLokasiPopup(){
  const div = document.getElementById('isiDaftarLokasi');
  if(db.lokasi.length === 0){ div.innerHTML = '<p>Belum ada lokasi</p>'; return; }
  div.innerHTML = db.lokasi.map(l=>`<div class="stat-item"><div><b>${l.nama}</b><br><small>¥${l.tarif.toLocaleString()}/${l.jenis}</small></div><button onclick="hapusLokasi(${l.id})" class="btn-danger btn-kecil">Hapus</button></div>`).join('');
}
function hapusLokasi(id){
  if(confirm('Yakin hapus?')){ db.lokasi = db.lokasi.filter(l=>l.id!= id); simpan(); renderSelectInputLokasi(); renderDaftarLokasiPopup(); }
}

// KALENDER
function gantiBulan(dir){ bulanAktif.setMonth(bulanAktif.getMonth() + dir); renderSemua(); }

function renderKalender() {
  const grid = document.getElementById('kalender');
  if(!grid) return;
  grid.innerHTML = '';
  const y = bulanAktif.getFullYear(), m = bulanAktif.getMonth();
  const locale = db.bahasa=='jp'?'ja-JP':db.bahasa=='en'?'en-US':'id-ID';
  document.getElementById('bulanTahun').innerText = bulanAktif.toLocaleString(locale, {month: 'long', year: 'numeric'});
  document.getElementById('judulHeaderBulan').innerText = `${bahasa[db.bahasa].pendapatan} ${bulanAktif.toLocaleString(locale, {month: 'long', year: 'numeric'})}`;

  const jmlHari = new Date(y, m + 1, 0).getDate();
  const mulai = new Date(y, m, 1).getDay();
  const hari = db.bahasa=='id'?['Min','Sen','Sel','Rab','Kam','Jum','Sab']:db.bahasa=='en'?['Sun','Mon','Tue','Wed','Thu','Fri','Sat']:['日','月','火','水','木','金','土'];
  hari.forEach(h=>{ grid.innerHTML += `<div style="font-size:11px;color:#9ca3af;font-weight:bold;text-align:center">${h}</div>`; });
  for(let i=0; i<mulai; i++) grid.innerHTML += `<div class="tanggal-kosong"></div>`;
  for(let t=1; t<=jmlHari; t++){
    const key = `${y}-${String(m+1).padStart(2,'0')}-${String(t).padStart(2,'0')}`;
    const dataHari = db.data.filter(d=>d.tanggal==key);
    const total = dataHari.reduce((a,b)=>a+b.total,0);
    const adaKerja = total > 0? 'ada-kerja' : '';
    grid.innerHTML += `<div class="kalender-item ${adaKerja}" onclick="openPopupDetail('${key}')"><b>${t}</b><small>${total? '¥'+total.toLocaleString() : '-'}</small></div>`;
  }
}

// POPUP DETAIL
function renderPopupDetail(tgl){
  const dataHari = db.data.filter(d=>d.tanggal==tgl);
  document.getElementById('judulDetail').innerText = `Detail ${tgl}`;
  if(dataHari.length == 0){
    document.getElementById('isiDetail').innerHTML = '<p style="color:#9ca3af">Belum ada data kerja</p>';
    return;
  }
  let html = `<div class="stat-item"><span>Total</span><b>¥${dataHari.reduce((a,b)=>a+b.total,0).toLocaleString()}</b></div>`;
  dataHari.forEach(d=>{
    html += `<div class="stat-item"><span>${d.lokasiNama}<br><small>${d.jumlah} ${d.jenis}</small></span>
    <div><b>¥${d.total.toLocaleString()}</b><br>
    <button onclick="openPopupEdit(${d.id})" class="btn-kecil" style="background:#3b82f6">Edit</button>
    <button onclick="hapusData(${d.id})" class="btn-kecil btn-danger">Hapus</button></div></div>`;
  });
  document.getElementById('isiDetail').innerHTML = html;
}

function simpanDataDariPopup(){
  const tanggal = document.getElementById('inputTanggal').value;
  const lokasiId = document.getElementById('inputLokasi').value;
  const jumlah = parseFloat(document.getElementById('inputJumlah').value);
  const lokasi = db.lokasi.find(l=>l.id==lokasiId);
  if(!tanggal ||!lokasiId ||!jumlah) return alert('Isi semua dulu');
  let total = (lokasi.jenis == 'kamar' || lokasi.jenis == 'jam')? jumlah * lokasi.tarif : lokasi.tarif;
  db.data.push({ tanggal, lokasiId, lokasiNama: lokasi.nama, jumlah, total, jenis: lokasi.jenis, id: Date.now() });
  simpan(); renderSemua(); closePopupInput();
  renderPopupDetail(tanggal);
  alert('Tersimpan!');
}

function hapusData(id){
  if(confirm('Yakin hapus data ini?')){
    db.data = db.data.filter(d=>d.id!=id);
    simpan(); renderSemua(); renderPopupDetail(tanggalAktifPopup);
  }
}

function simpanEdit(){
  const data = db.data.find(d=>d.id==idEdit);
  const lokasi = db.lokasi.find(l=>l.id==document.getElementById('editLokasi').value);
  data.tanggal = document.getElementById('editTanggal').value;
  data.lokasiId = lokasi.id;
  data.lokasiNama = lokasi.nama;
  data.jumlah = parseFloat(document.getElementById('editJumlah').value);
  data.jenis = lokasi.jenis;
  data.total = (lokasi.jenis == 'kamar' || lokasi.jenis == 'jam')? data.jumlah * lokasi.tarif : lokasi.tarif;
  simpan(); renderSemua(); closePopupEdit(); renderPopupDetail(data.tanggal);
}

// POPUP STATISTIK
function renderPopupStatistik(){
  const bulanIni = `${bulanAktif.getFullYear()}-${String(bulanAktif.getMonth()+1).padStart(2,'0')}`;
  const dataBulanIni = db.data.filter(x=>x.tanggal.startsWith(bulanIni));
  const jmlHari = new Date(bulanAktif.getFullYear(), bulanAktif.getMonth() + 1, 0).getDate();
  const hariKerja = [...new Set(dataBulanIni.map(x=>x.tanggal))].length;
  const hariLibur = jmlHari - hariKerja;
  const b = bahasa[db.bahasa];
  const namaBulan = bulanAktif.toLocaleString(db.bahasa=='jp'?'ja-JP':db.bahasa=='en'?'en-US':'id-ID', {month: 'long', year: 'numeric'});
  let html = `<div class="stat-item"><span>Bulan</span><b>${namaBulan}</b></div>`;
  html += `<div class="stat-item"><span>${b.hariKerja}</span><b>${hariKerja} hari</b></div><div class="stat-item"><span>${b.hariLibur}</span><b>${hariLibur} hari</b></div>`;
  if(db.lokasi.some(l=>dataBulanIni.filter(x=>x.lokasiId == l.id).length > 0)){ html += `<hr style="border-color:#374151; margin:12px 0">`; }
  db.lokasi.forEach(l=>{
    const dataLokasi = dataBulanIni.filter(x=>x.lokasiId == l.id);
    const total = dataLokasi.reduce((a,b)=>a+b.total,0);
    const jumlah = dataLokasi.reduce((a,b)=>a+b.jumlah,0);
    if(jumlah > 0){
      if(l.jenis == 'jam') html += `<div class="stat-item"><span>${l.nama} - ${b.totalJam}</span><b>${jumlah} jam<br>¥${total.toLocaleString()}</b></div>`;
      if(l.jenis == 'kamar') html += `<div class="stat-item"><span>${l.nama} - ${b.totalKamar}</span><b>${jumlah} kamar<br>¥${total.toLocaleString()}</b></div>`;
      if(l.jenis == 'borongan') html += `<div class="stat-item"><span>${l.nama}</span><b>${dataLokasi.length} kali<br>¥${total.toLocaleString()}</b></div>`;
    }
  });
  if(dataBulanIni.length == 0){ html = '<p style="color:#9ca3af; text-align:center">Belum ada data di bulan ini</p>' }
  document.getElementById('isiStatistikPopup').innerHTML = html;
}

function renderPopupRekap(){
  const bulanUnik = [...new Set(db.data.map(d=>d.tanggal.slice(0,7)))].sort().reverse();
  let html = '';
  bulanUnik.forEach(bln=>{
    const total = db.data.filter(d=>d.tanggal.startsWith(bln)).reduce((a,b)=>a+b.total,0);
    html += `<div class="stat-item"><span>${bln}</span><b>¥${total.toLocaleString()}</b></div>`;
  });
  document.getElementById('isiRekap').innerHTML = html || 'Belum ada data';
}

function renderSemua(){
  renderKalender();
  renderSelectInputLokasi();
  const bulanIni = `${bulanAktif.getFullYear()}-${String(bulanAktif.getMonth()+1).padStart(2,'0')}`;
  const dataBulanIni = db.data.filter(x=>x.tanggal.startsWith(bulanIni));
  const totalBulanIni = dataBulanIni.reduce((a,b)=>a+b.total,0);
  const totalSejakAwal = db.data.reduce((a,b)=>a+b.total,0);
  document.getElementById('totalGaji').innerText = '¥' + totalBulanIni.toLocaleString();
  document.getElementById('targetText').innerText = `¥${db.target.toLocaleString()}`;
  const persen = db.target > 0? (totalBulanIni / db.target * 100).toFixed(0) : 0;
  document.getElementById('progressBar').style.width = persen + '%';
  document.getElementById('progressText').innerText = persen + '%';
  document.getElementById('totalSejakAwal').innerHTML = `<div class="stat-item"><span>Total Sejak Awal</span><b style="color:#3b82f6">¥${totalSejakAwal.toLocaleString()}</b></div>`;
}

function ubahTarget(){
  const t = prompt("Masukkan target baru:", db.target);
  if(t){ db.target = parseFloat(t); simpan(); renderSemua(); }
}

function shareLaporan(){
  const bulanIni = `${bulanAktif.getFullYear()}-${String(bulanAktif.getMonth()+1).padStart(2,'0')}`;
  const dataBulanIni = db.data.filter(x=>x.tanggal.startsWith(bulanIni));
  const total = dataBulanIni.reduce((a,b)=>a+b.total,0);
  const teks = `Laporan GajiKu Jepang - ${bulanIni}\nTotal Pendapatan: ¥${total.toLocaleString()}\nJumlah Kerja: ${dataBulanIni.length} kali`;
  if(navigator.share){ navigator.share({ title: 'Laporan GajiKu', text: teks }); }
  else { navigator.clipboard.writeText(teks); alert('Laporan disalin!'); }
}

function exportBackup(){
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db));
  const a = document.createElement('a'); a.href = dataStr; a.download = "gajiku_backup.json"; a.click();
}
function importBackup(){
  const file = document.getElementById('importFile').files[0];
  if(!file) return alert('Pilih file dulu ya');

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const dataImport = JSON.parse(e.target.result);

      // Cek biar ga ketimpa data kosong
      if(!dataImport.data ||!dataImport.lokasi){
        return alert('File backup salah format');
      }

      db = dataImport; // timpa data lama
      simpan(); // INI KUNCI NYA. Simpen ke HP
      renderSemua(); // gambar ulang

      alert('Import berhasil! 🎉 Data 2 bulan kamu sudah kembali');
    } catch(err) {
      alert('Gagal import: File rusak. ' + err.message)
    }
  };
  reader.readAsText(file);
}
