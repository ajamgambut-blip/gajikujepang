let data = JSON.parse(localStorage.getItem('gajiData')) || [];
let lokasi = JSON.parse(localStorage.getItem('lokasiData')) || [];
let pengeluaran = JSON.parse(localStorage.getItem('pengeluaranData')) || [];
let target = localStorage.getItem('targetGaji') || 250000;

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

function tambahLokasi() {
    const nama = document.getElementById('namaLokasi').value;
    const tarif = parseInt(document.getElementById('tarifLokasi').value);
    const jenis = document.getElementById('jenisLokasi').value;
    if(!nama ||!tarif) return alert('Isi semua!');
    lokasi.push({id:Date.now(), nama, tarif, jenis});
    simpanSemua(); renderLokasi(); renderSelectLokasi();
    document.getElementById('namaLokasi').value=''; document.getElementById('tarifLokasi').value='';
}

function renderLokasi() {
    const div = document.getElementById('daftarLokasi');
    div.innerHTML = '';
    lokasi.forEach(l => {
        div.innerHTML += `<div style="display:flex;justify-content:space-between;margin:5px 0">${l.nama} - ¥${l.tarif.toLocaleString()} /${l.jenis} <button onclick="hapusLokasi(${l.id})" style="background:red">Hapus</button></div>`;
    });
}

function hapusLokasi(id){ lokasi = lokasi.filter(l=>l.id!=id); simpanSemua(); renderLokasi(); renderSelectLokasi(); }

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
    const jumlah = parseFloat(document.getElementById('jumlah').value);
    if(!tanggal ||!idLokasi ||!jumlah) return alert('Isi semua!');
    const lok = lokasi.find(l=>l.id==idLokasi);
    const gaji = lok.tarif * jumlah;
    data.push({id:Date.now(), tanggal, lokasi:lok.nama, jumlah, gaji});
    simpanSemua(); render(); alert('Data tersimpan!');
    document.getElementById('jumlah').value='';
}

function render() {
    renderRiwayat();
    renderTotal();
    renderStatistik();
    renderRekap();
    renderKalender();
    renderPengeluaran();
}

function renderTotal() {
    const bulanIni = getBulanIni();

    // 1. HITUNG BULAN INI
    let totalBulanIni = 0;
    data.forEach(item => {
        if(item.tanggal.substring(0,7) === bulanIni){
            totalBulanIni += item.gaji;
        }
    });
    document.getElementById('totalGaji').innerText = `¥${totalBulanIni.toLocaleString()}`;

    // 2. HITUNG TOTAL SEMUA WAKTU - TAMBAHAN BARU
    let totalSemua = data.reduce((a,b)=>a+b.gaji,0);
    // Kita bikin elemen baru di bawahnya
    if(!document.getElementById('totalSemua')){
        document.getElementById('totalGaji').insertAdjacentHTML('afterend', `<div id="totalSemua" style="font-size:12px;color:#9ca3af;margin-top:5px">Total Semua: ¥${totalSemua.toLocaleString()}</div>`);
    } else {
        document.getElementById('totalSemua').innerText = `Total Semua: ¥${totalSemua.toLocaleString()}`;
    }

    // 3. PROGRESS BAR
    const persen = target > 0? (totalBulanIni / target * 100).toFixed(0) : 0;
    document.getElementById('progressBar').style.width = `${persen>100?100:persen}%`;
    document.getElementById('progressText').innerText = `${persen}%`;
    document.getElementById('targetText').innerText = `¥${parseInt(target).toLocaleString()}`;



function simpanTarget() {
    const val = document.getElementById('targetInput').value;
    if(!val) return;
    target = val;
    simpanSemua(); renderTotal();
}

function renderRiwayat() {
    const bulan = document.getElementById('filterBulan').value;
    const div = document.getElementById('riwayat');
    div.innerHTML = '';
    let filterData = bulan? data.filter(d=>d.tanggal.substring(0,7)==bulan) : data;
    filterData.sort((a,b)=>b.tanggal.localeCompare(a.tanggal)).forEach(d=>{
        div.innerHTML += `<div style="padding:8px;border-bottom:1px solid #374151">${d.tanggal} - ${d.lokasi} - ${d.jumlah} - <b>¥${d.gaji.toLocaleString()}</b></div>`;
    });
}

function renderStatistik() {
    const bulanIni = getBulanIni();
    const dataBulanIni = data.filter(d=>d.tanggal.substring(0,7)===bulanIni);
    const totalHari = new Set(dataBulanIni.map(d=>d.tanggal)).size;
    document.getElementById('statistik').innerHTML = `
        Total Hari Kerja Bulan Ini: ${totalHari} hari<br>
        Total Job Bulan Ini: ${dataBulanIni.length} kali
    `;
}

function renderRekap() {
    const rekap = {};
    data.forEach(d=>{
        rekap[d.lokasi] = (rekap[d.lokasi]||0) + d.gaji;
    });
    let html = '';
    for(let k in rekap) html += `<div style="display:flex;justify-content:space-between">${k}: <b>¥${rekap[k].toLocaleString()}</b></div>`;
    document.getElementById('rekapLokasi').innerHTML = html;
}

function tambahPengeluaran() {
    const nama = document.getElementById('namaPengeluaran').value;
    const jumlah = parseInt(document.getElementById('jumlahPengeluaran').value);
    if(!nama ||!jumlah) return;
    pengeluaran.push({id:Date.now(), nama, jumlah});
    simpanSemua(); renderPengeluaran();
    document.getElementById('namaPengeluaran').value=''; document.getElementById('jumlahPengeluaran').value='';
}

function renderPengeluaran() {
    const div = document.getElementById('daftarPengeluaran');
    div.innerHTML = '';
    let totalKeluar = 0;
    pengeluaran.forEach(p=>{
        totalKeluar += p.jumlah;
        div.innerHTML += `<div style="display:flex;justify-content:space-between">${p.nama}: ¥${p.jumlah.toLocaleString()} <button onclick="hapusPengeluaran(${p.id})" style="background:red">X</button></div>`;
    });
    const bulanIni = getBulanIni();
    const totalMasuk = data.filter(d=>d.tanggal.substring(0,7)===bulanIni).reduce((a,b)=>a+b.gaji,0);
    document.getElementById('ringkasanKeuangan').innerHTML = `
        Pemasukan Bulan Ini: ¥${totalMasuk.toLocaleString()}<br>
        Pengeluaran: ¥${totalKeluar.toLocaleString()}<br>
        <b style="color:#34d399">Sisa: ¥${(totalMasuk-totalKeluar).toLocaleString()}</b>
    `;
}

function hapusPengeluaran(id){ pengeluaran = pengeluaran.filter(p=>p.id!=id); simpanSemua(); renderPengeluaran(); }

function renderKalender() {
    const grid = document.getElementById('kalender');
    grid.innerHTML = '';
    const bulanIni = getBulanIni();
    data.filter(d=>d.tanggal.substring(0,7)===bulanIni).forEach(d=>{
        grid.innerHTML += `<div style="background:#059669;padding:10px;border-radius:8px;text-align:center">${d.tanggal.substring(8,10)}</div>`;
    });
}

function exportBackup() {
    const blob = new Blob([JSON.stringify({data,lokasi,pengeluaran,target})], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'backup-gajiku.json'; a.click();
}

function importBackup() {
    const file = document.getElementById('importFile').files[0];
    const reader = new FileReader();
    reader.onload = e => {
        const backup = JSON.parse(e.target.result);
        data=backup.data||[]; lokasi=backup.lokasi||[]; pengeluaran=backup.pengeluaran||[]; target=backup.target||250000;
        simpanSemua(); render(); alert('Restore berhasil!');
    }
    reader.readAsText(file);
}

// INIT
document.getElementById('targetText').innerText = `¥${parseInt(target).toLocaleString()}`;
document.getElementById('tanggal').valueAsDate = new Date();
document.getElementById('filterBulan').value = getBulanIni();
renderLokasi(); renderSelectLokasi(); render();
