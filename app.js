let data = JSON.parse(localStorage.getItem('gajiData')) || [];
let lokasi = JSON.parse(localStorage.getItem('lokasiData')) || [];
let pengeluaran = JSON.parse(localStorage.getItem('pengeluaranData')) || [];
let target = parseInt(localStorage.getItem('targetGaji')) || 250000;

function getBulanIni() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
}

function simpanSemua() {
    localStorage.setItem('gajiData', JSON.stringify(data));
    localStorage.setItem('lokasiData', JSON.stringify(lokasi));
    localStorage.setItem('pengeluaranData', JSON.stringify(pengeluaran));
    localStorage.setItem('targetGaji', target);
}

function showPopup(text) {
    document.getElementById('popupText').innerText = text;
    document.getElementById('popupOverlay').style.display = 'block';
    document.getElementById('popup').style.display = 'block';
}

function closePopup() {
    document.getElementById('popupOverlay').style.display = 'none';
    document.getElementById('popup').style.display = 'none';
}

function tambahLokasi() {
    const nama = document.getElementById('namaLokasi').value.trim();
    const tarif = parseInt(document.getElementById('tarifLokasi').value) || 0;
    const jenis = document.getElementById('jenisLokasi').value;
    if(!nama ||!tarif) return alert('Isi Nama & Tarif!');
    lokasi.push({id:Date.now(), nama, tarif, jenis});
    simpanSemua(); renderLokasi(); renderSelectLokasi();
    document.getElementById('namaLokasi').value='';
    document.getElementById('tarifLokasi').value='';
    showPopup('Lokasi berhasil ditambah!');
}

function renderLokasi() {
    const div = document.getElementById('daftarLokasi');
    div.innerHTML = '';
    if(lokasi.length === 0) div.innerHTML = '<p style="color:#9ca3af">Belum ada lokasi</p>';
    lokasi.forEach(l => {
        div.innerHTML += `<div style="display:flex;justify-content:space-between;margin:5px 0;padding:8px;background:#1f2937;border-radius:6px">${l.nama} - ¥${l.tarif.toLocaleString()} /${l.jenis} <button onclick="hapusLokasi(${l.id})" style="background:#ef4444;border:none;color:white;padding:2px 8px;border-radius:4px;cursor:pointer">Hapus</button></div>`;
    });
}

function hapusLokasi(id){
    if(!confirm('Hapus lokasi ini?')) return;
    lokasi = lokasi.filter(l=>l.id!=id);
    simpanSemua(); renderLokasi(); renderSelectLokasi();
}

function renderSelectLokasi() {
    const select = document.getElementById('lokasi');
    select.innerHTML = '<option value="">Pilih Lokasi</option>';
    lokasi.forEach(l => {
        select.innerHTML += `<option value="${l.id}">${l.nama}</option>`;
    });
}

function tambahData() {
    const tanggal = document.getElementById('tanggal').value;
    const idLokasi = document.getElementById('lokasi').value;
    const jumlah = parseFloat(document.getElementById('jumlah').value) || 0;
    if(!tanggal ||!idLokasi ||!jumlah) return alert('Isi semua data!');
    const lok = lokasi.find(l=>l.id==idLokasi);
    const gaji = lok.tarif * jumlah;
    data.push({id:Date.now(), tanggal, lokasi:lok.nama, jumlah, gaji});
    simpanSemua(); render();
    showPopup(`Data tersimpan! +¥${gaji.toLocaleString()}`);
    document.getElementById('jumlah').value='';
}

function render() {
    renderRiwayat();
    renderTotal();
    renderStatistik();
    renderRekap();
    renderKalender();
    renderPengeluaran();
    renderRekapBulanan();
}

function renderTotal() {
    const bulanIni = getBulanIni();
    let totalBulanIni = 0;
    data.forEach(item => {
        if(item.tanggal.substring(0,7) === bulanIni){
            totalBulanIni += item.gaji;
        }
    });
    document.getElementById('totalGaji').innerText = `¥${totalBulanIni.toLocaleString()}`;

    let totalSemua = data.reduce((a,b)=>a+b.gaji,0);
    document.getElementById('totalSemua').innerText = `Total Semua: ¥${totalSemua.toLocaleString()}`;

    const persen = target > 0? (totalBulanIni / target * 100).toFixed(0) : 0;
    document.getElementById('progressBar').style.width = `${persen>100?100:persen}%`;
    document.getElementById('progressText').innerText = `${persen}%`;
    document.getElementById('targetText').innerText = `¥${parseInt(target).toLocaleString()}`;
} // INI YANG TADI KURANG

function ubahTarget() {
    const baru = prompt("Masukkan Target Bulanan Baru:", target);
    if(baru &&!isNaN(baru)) {
        target = parseInt(baru);
        simpanSemua(); renderTotal();
        showPopup(`Target diubah ke ¥${target.toLocaleString()}`);
    }
}

function renderRiwayat() {
    const bulan = document.getElementById('filterBulan').value;
    const div = document.getElementById('riwayat');
    div.innerHTML = '';
    let filterData = bulan? data.filter(d=>d.tanggal.substring(0,7)==bulan) : data;
    if(filterData.length === 0) div.innerHTML = '<p style="color:#9ca3af">Belum ada data</p>';
    filterData.sort((a,b)=>b.tanggal.localeCompare(a.tanggal)).forEach(d=>{
        div.innerHTML += `<div style="padding:8px;border-bottom:1px solid #374151;display:flex;justify-content:space-between">${d.tanggal} - ${d.lokasi} - ${d.jumlah} <b>¥${d.gaji.toLocaleString()}</b></div>`;
    });
}

function renderStatistik() {
    const bulanIni = getBulanIni();
    const dataBulanIni = data.filter(d=>d.tanggal.substring(0,7)===bulanIni);
    const totalHari = new Set(dataBulanIni.map(d=>d.tanggal)).size;
    const rata2 = dataBulanIni.length > 0? (dataBulanIni.reduce((a,b)=>a+b.gaji,0)/dataBulanIni.length).toFixed(0) : 0;
    document.getElementById('statistik').innerHTML = `
        Total Hari Kerja: <b>${totalHari} hari</b><br>
        Total Job: <b>${dataBulanIni.length} kali</b><br>
        Rata-rata/job: <b>¥${parseInt(rata2).toLocaleString()}</b>
    `;
}

function renderRekap() {
    const rekap = {};
    data.forEach(d=>{
        rekap[d.lokasi] = (rekap[d.lokasi]||0) + d.gaji;
    });
    let html = '';
    if(Object.keys(rekap).length === 0) html = '<p style="color:#9ca3af">Belum ada data</p>';
    for(let k in rekap) html += `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dashed #374151">${k}: <b>¥${rekap[k].toLocaleString()}</b></div>`;
    document.getElementById('rekapLokasi').innerHTML = html;
}

function renderRekapBulanan() {
    const rekapBulan = {};
    data.forEach(d=>{
        const bln = d.tanggal.substring(0,7);
        rekapBulan[bln] = (rekapBulan[bln]||0) + d.gaji;
    });
    let html = '';
    if(Object.keys(rekapBulan).length === 0) html = '<p style="color:#9ca3af">Belum ada data</p>';
    Object.keys(rekapBulan).sort().reverse().forEach(bln => {
        html += `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dashed #374151">${bln}: <b>¥${rekapBulan[bln].toLocaleString()}</b></div>`;
    });
    document.getElementById('rekapBulanan').innerHTML = html;
}

function tambahPengeluaran() {
    const nama = document.getElementById('namaPengeluaran').value.trim();
    const jumlah = parseInt(document.getElementById('jumlahPengeluaran').value) || 0;
    if(!nama ||!jumlah) return alert('Isi Nama & Jumlah!');
    pengeluaran.push({id:Date.now(), nama, jumlah});
    simpanSemua(); renderPengeluaran();
    document.getElementById('namaPengeluaran').value='';
    document.getElementById('jumlahPengeluaran').value='';
    showPopup('Pengeluaran ditambah!');
}

function renderPengeluaran() {
    const div = document.getElementById('daftarPengeluaran');
    div.innerHTML = '';
    let totalKeluar = 0;
    if(pengeluaran.length === 0) div.innerHTML = '<p style="color:#9ca3af">Belum ada pengeluaran</p>';
    pengeluaran.forEach(p=>{
        totalKeluar += p.jumlah;
        div.innerHTML += `<div style="display:flex;justify-content:space-between;padding:6px 0">${p.nama}: ¥${p.jumlah.toLocaleString()} <button onclick="hapusPengeluaran(${p.id})" style="background:#ef4444;border:none;color:white;padding:2px 6px;border-radius:4px;cursor:pointer">X</button></div>`;
    });
    const bulanIni = getBulanIni();
    const totalMasuk = data.filter(d=>d.tanggal.substring(0,7)===bulanIni).reduce((a,b)=>a+b.gaji,0);
    document.getElementById('ringkasanKeuangan').innerHTML = `
        Pemasukan: ¥${totalMasuk.toLocaleString()}<br>
        Pengeluaran: ¥${totalKeluar.toLocaleString()}<br>
        <b style="color:#34d399;font-size:18px">Sisa: ¥${(totalMasuk-totalKeluar).toLocaleString()}</b>
    `;
}

function hapusPengeluaran(id){
    if(!confirm('Hapus pengeluaran ini?')) return;
    pengeluaran = pengeluaran.filter(p=>p.id!=id);
    simpanSemua(); renderPengeluaran();
}

function renderKalender() {
    const grid = document.getElementById('kalender');
    grid.innerHTML = '';
    const bulanIni = getBulanIni();
    const hariKerja = [...new Set(data.filter(d=>d.tanggal.substring(0,7)===bulanIni).map(d=>d.tanggal.substring(8,10)))];
    if(hariKerja.length === 0) grid.innerHTML = '<p style="color:#9ca3af">Belum ada data bulan ini</p>';
    hariKerja.forEach(tgl=>{
        grid.innerHTML += `<div style="background:#059669;padding:10px;border-radius:8px;text-align:center;font-weight:bold">${tgl}</div>`;
    });
}

function exportBackup() {
    const blob = new Blob([JSON.stringify({data,lokasi,pengeluaran,target})], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `backup-gajiku-${getBulanIni()}.json`;
    a.click();
    showPopup('Backup berhasil diunduh!');
}

function importBackup() {
    const file = document.getElementById('importFile').files[0];
    if(!file) return alert('Pilih file dulu!');
    const reader = new FileReader();
    reader.onload = e => {
        try {
            const backup = JSON.parse(e.target.result);
            data=backup.data||[];
            lokasi=backup.lokasi||[];
            pengeluaran=backup.pengeluaran||[];
            target=backup.target||250000;
            simpanSemua(); render();
            renderLokasi(); renderSelectLokasi();
            showPopup('Restore berhasil!');
        } catch(err) {
            alert('File backup tidak valid!');
        }
    }
    reader.readAsText(file);
}

// INIT
document.getElementById('targetText').innerText = `¥${parseInt(target).toLocaleString()}`;
document.getElementById('tanggal').valueAsDate = new Date();
document.getElementById('filterBulan').value = getBulanIni();
renderLokasi();
renderSelectLokasi();
render();
