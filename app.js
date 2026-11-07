
/* =========================================================
   GajiKu Jepang - APP.JS
   Versi lengkap dengan fitur Pengeluaran
   Kompatibel dengan backup lama:
   {
     db: [],
     lokasiDb: [],
     pengeluaranDb: [],
     targetBulanan: 250000
   }
   ========================================================= */

let db = {
  data: [],
  lokasi: [],
  pengeluaran: [],
  target: 250000,
  bahasa: 'id'
};

let bulanAktif = new Date();
let idEdit = null;
let tanggalAktifPopup = null;

/* =========================================================
   BAHASA
   ========================================================= */

const bahasa = {
  id: {
    judul: "Pengelola Gaji & Absensi",
    statistik: "📈 Statistik",
    rekap: "📅 Rekap Bulanan",
    daftar: "📋 Daftar Lokasi",
    tambah: "➕ Tambah Lokasi Baru",
    hariKerja: "Hari Kerja",
    hariLibur: "Hari Libur",
    totalJam: "Total Jam",
    totalKamar: "Total Kamar",
    target: "🎯 Target Bulanan",
    kalender: "🗓️ Kalender",
    backup: "💾 Backup & Data",
    pendapatan: "💴 Pendapatan Bulan"
  },

  en: {
    judul: "Salary Manager",
    statistik: "📈 Statistics",
    rekap: "📅 Monthly Recap",
    daftar: "📋 Location List",
    tambah: "➕ Add Location",
    hariKerja: "Work Days",
    hariLibur: "Days Off",
    totalJam: "Total Hours",
    totalKamar: "Total Rooms",
    target: "🎯 Monthly Target",
    kalender: "🗓️ Calendar",
    backup: "💾 Backup & Data",
    pendapatan: "💴 Income for"
  },

  jp: {
    judul: "給与管理",
    statistik: "📈 今月の統計",
    rekap: "📅 月間集計",
    daftar: "📋 場所リスト",
    tambah: "➕ 場所を追加",
    hariKerja: "出勤日数",
    hariLibur: "休日",
    totalJam: "合計時間",
    totalKamar: "合計部屋数",
    target: "🎯 月間目標",
    kalender: "🗓️ カレンダー",
    backup: "💾 バックアップ",
    pendapatan: "💴 の収入"
  }
};

/* =========================================================
   START APP
   ========================================================= */

window.onload = function () {
  loadDatabase();

  const select = document.getElementById('pilihBahasa');

  if (select) {
    select.value = db.bahasa;
  }

  updateBahasaUI();
  renderSemua();
};

/* =========================================================
   LOAD DATABASE
   ========================================================= */

function loadDatabase() {
  try {
    const saved = localStorage.getItem('gajikuDB');

    if (!saved) return;

    const parsed = JSON.parse(saved);
    db = normalizeDatabase(parsed);

  } catch (error) {
    console.error('Database error:', error);

    db = {
      data: [],
      lokasi: [],
      pengeluaran: [],
      target: 250000,
      bahasa: 'id'
    };
  }
}

/* =========================================================
   NORMALIZE DATABASE
   ========================================================= */

function normalizeDatabase(source) {
  if (!source || typeof source !== 'object') {
    return {
      data: [],
      lokasi: [],
      pengeluaran: [],
      target: 250000,
      bahasa: 'id'
    };
  }

  const lokasiSource = Array.isArray(source.lokasi)
    ? source.lokasi
    : [];

  const lokasi = lokasiSource.map((l, index) => ({
    id: Number(l.id) || Date.now() + index,
    nama: String(l.nama || ''),
    tarif: Number(l.tarif) || 0,
    jenis: ['kamar', 'jam', 'borongan'].includes(l.jenis)
      ? l.jenis
      : 'kamar'
  }));

  const dataSource = Array.isArray(source.data)
    ? source.data
    : [];

  const data = dataSource.map((d, index) => ({
    id: Number(d.id) || Date.now() + index,
    tanggal: String(d.tanggal || ''),
    lokasiId: Number(d.lokasiId) || 0,
    lokasiNama: String(d.lokasiNama || ''),
    jumlah: Number(d.jumlah) || 0,
    total: Number(d.total) || 0,
    jenis: ['kamar', 'jam', 'borongan'].includes(d.jenis)
      ? d.jenis
      : 'kamar',
    catatan: String(d.catatan || '')
  }));

  const pengeluaranSource = Array.isArray(source.pengeluaran)
    ? source.pengeluaran
    : [];

  const pengeluaran = pengeluaranSource.map((p, index) => ({
    id: Number(p.id) || Date.now() + 10000 + index,
    tanggal: String(p.tanggal || ''),
    jumlah: Number(
      p.jumlah ?? p.total ?? p.pengeluaran ?? p.nominal
    ) || 0,
    keterangan: String(
      p.keterangan || p.nama || p.catatan || p.deskripsi || 'Pengeluaran'
    )
  })).filter(p => p.tanggal && p.jumlah > 0);

  let target = Number(source.target);

  if (!Number.isFinite(target) || target <= 0) {
    target = 250000;
  }

  const bahasaAktif = ['id', 'en', 'jp'].includes(source.bahasa)
    ? source.bahasa
    : 'id';

  return {
    data,
    lokasi,
    pengeluaran,
    target,
    bahasa: bahasaAktif
  };
}

/* =========================================================
   SAVE
   ========================================================= */

function simpan() {
  try {
    localStorage.setItem('gajikuDB', JSON.stringify(db));
  } catch (error) {
    console.error('Gagal menyimpan:', error);
    alert('Gagal menyimpan data.');
  }
}

/* =========================================================
   BAHASA
   ========================================================= */

function gantiBahasa() {
  const select = document.getElementById('pilihBahasa');

  if (!select) return;

  db.bahasa = select.value;

  updateBahasaUI();
  simpan();
  renderSemua();
}

function updateBahasaUI() {
  const b = bahasa[db.bahasa] || bahasa.id;

  const mapping = {
    subJudul: b.judul,
    judulStatistik: b.statistik,
    judulRekap: b.rekap,
    judulDaftarLokasi: b.daftar,
    judulTambahLokasi: b.tambah,
    judulTarget: b.target,
    judulKalender: b.kalender,
    judulBackup: b.backup
  };

  Object.keys(mapping).forEach(id => {
    const el = document.getElementById(id);

    if (el) {
      el.innerText = mapping[id];
    }
  });
}

/* =========================================================
   BULAN
   ========================================================= */

function gantiBulanHeader(dir) {
  bulanAktif.setMonth(bulanAktif.getMonth() + dir);
  renderSemua();
}

function gantiBulan(dir) {
  bulanAktif.setMonth(bulanAktif.getMonth() + dir);
  renderSemua();
}

/* =========================================================
   POPUP
   ========================================================= */

function openPopupLokasi() {
  document.getElementById('popupLokasi').style.display = 'block';
  document.getElementById('popupOverlay2').style.display = 'block';
}

function closePopupLokasi() {
  document.getElementById('popupLokasi').style.display = 'none';
  document.getElementById('popupOverlay2').style.display = 'none';
}

function openPopupDaftarLokasi() {
  renderDaftarLokasiPopup();

  document.getElementById('popupDaftarLokasi').style.display = 'block';
  document.getElementById('popupOverlay2').style.display = 'block';
}

function closePopupDaftarLokasi() {
  document.getElementById('popupDaftarLokasi').style.display = 'none';
  document.getElementById('popupOverlay2').style.display = 'none';
}

function openPopupRekap() {
  renderPopupRekap();

  document.getElementById('popupRekap').style.display = 'block';
  document.getElementById('popupOverlay2').style.display = 'block';
}

function closePopupRekap() {
  document.getElementById('popupRekap').style.display = 'none';
  document.getElementById('popupOverlay2').style.display = 'none';
}

function openPopupDetail(tgl) {
  tanggalAktifPopup = tgl;
  renderPopupDetail(tgl);

  document.getElementById('popupDetail').style.display = 'block';
  document.getElementById('popupOverlay2').style.display = 'block';
}

function closePopupDetail() {
  document.getElementById('popupDetail').style.display = 'none';
  document.getElementById('popupOverlay2').style.display = 'none';
}

function openPopupEdit(id) {
  idEdit = id;

  const data = db.data.find(d => d.id == id);

  if (!data) {
    alert('Data tidak ditemukan.');
    return;
  }

  document.getElementById('editTanggal').value = data.tanggal;

  renderSelectEditLokasi();

  document.getElementById('editLokasi').value = data.lokasiId;
  document.getElementById('editJumlah').value = data.jumlah;

  document.getElementById('popupEdit').style.display = 'block';
  document.getElementById('popupOverlay2').style.display = 'block';
}

function closePopupEdit() {
  document.getElementById('popupEdit').style.display = 'none';
  document.getElementById('popupOverlay2').style.display = 'none';
}

function openPopupStatistik() {
  renderPopupStatistik();

  document.getElementById('popupStatistik').style.display = 'block';
  document.getElementById('popupOverlay2').style.display = 'block';
}

function closePopupStatistik() {
  document.getElementById('popupStatistik').style.display = 'none';
  document.getElementById('popupOverlay2').style.display = 'none';
}

/* =========================================================
   INPUT DATA DARI DETAIL KALENDER
   ========================================================= */

function openPopupInputDariDetail(tgl = null) {
  if (tgl) {
    tanggalAktifPopup = tgl;
  }

  if (!tanggalAktifPopup) {
    tanggalAktifPopup = tanggalHariIni();
  }

  renderSelectInputLokasi();

  const inputTanggal = document.getElementById('inputTanggal');
  const inputTanggalText = document.getElementById('inputTanggalText');
  const inputJumlah = document.getElementById('inputJumlah');
  const inputGaji = document.getElementById('inputGaji');
  const inputCatatan = document.getElementById('inputCatatan');

  if (inputTanggal) {
    inputTanggal.value = tanggalAktifPopup;
  }

  if (inputTanggalText) {
    inputTanggalText.innerText = `Tanggal: ${tanggalAktifPopup}`;
  }

  if (inputJumlah) inputJumlah.value = '';
  if (inputGaji) inputGaji.value = '';
  if (inputCatatan) inputCatatan.value = '';

  document.getElementById('popupInput').style.display = 'block';
  document.getElementById('popupOverlay2').style.display = 'block';
}

function closePopupInput() {
  document.getElementById('popupInput').style.display = 'none';

  const detail = document.getElementById('popupDetail');

  if (!detail || detail.style.display !== 'block') {
    document.getElementById('popupOverlay2').style.display = 'none';
  }
}

function closeSemuaPopup() {
  const popupIds = [
    'popupLokasi',
    'popupDaftarLokasi',
    'popupRekap',
    'popupDetail',
    'popupEdit',
    'popupInput',
    'popupStatistik',
    'popupPengeluaran'
  ];

  popupIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const overlay = document.getElementById('popupOverlay2');
  if (overlay) overlay.style.display = 'none';
}

/* =========================================================
   LOKASI
   ========================================================= */

function simpanLokasiBaru() {
  const nama = document.getElementById('namaLokasi').value.trim();

  const tarif = parseFloat(
    document.getElementById('tarifLokasi').value
  );

  const jenis = document.getElementById('jenisLokasi').value;

  if (!nama || !Number.isFinite(tarif) || tarif <= 0) {
    alert('Isi nama dan tarif dengan benar.');
    return;
  }

  db.lokasi.push({
    id: Date.now(),
    nama,
    tarif,
    jenis
  });

  simpan();

  renderSelectInputLokasi();
  renderSelectEditLokasi();
  renderDaftarLokasiPopup();

  document.getElementById('namaLokasi').value = '';
  document.getElementById('tarifLokasi').value = '';

  closePopupLokasi();
}

function renderSelectInputLokasi() {
  const sel = document.getElementById('inputLokasi');

  if (!sel) return;

  sel.innerHTML =
    '<option value="">Pilih Lokasi</option>' +
    db.lokasi.map(l => `
      <option value="${l.id}">
        ${escapeHTML(l.nama)}
      </option>
    `).join('');
}

function renderSelectEditLokasi() {
  const sel = document.getElementById('editLokasi');

  if (!sel) return;

  sel.innerHTML = db.lokasi.map(l => `
    <option value="${l.id}">
      ${escapeHTML(l.nama)}
    </option>
  `).join('');
}

function renderDaftarLokasiPopup() {
  const div = document.getElementById('isiDaftarLokasi');

  if (!div) return;

  if (db.lokasi.length === 0) {
    div.innerHTML = '<p>Belum ada lokasi</p>';
    return;
  }

  div.innerHTML = db.lokasi.map(l => `
    <div class="stat-item">
      <div>
        <b>${escapeHTML(l.nama)}</b>
        <br>
        <small>
          ¥${Number(l.tarif).toLocaleString()}/${l.jenis}
        </small>
      </div>

      <button
        onclick="hapusLokasi(${l.id})"
        class="btn-danger btn-kecil">
        Hapus
      </button>
    </div>
  `).join('');
}

function hapusLokasi(id) {
  if (!confirm('Yakin hapus lokasi ini?')) return;

  db.lokasi = db.lokasi.filter(l => l.id != id);

  simpan();

  renderSelectInputLokasi();
  renderSelectEditLokasi();
  renderDaftarLokasiPopup();
}

/* =========================================================
   KALENDER
   ========================================================= */

function renderKalender() {
  const grid = document.getElementById('kalender');

  if (!grid) return;

  grid.innerHTML = '';

  const y = bulanAktif.getFullYear();
  const m = bulanAktif.getMonth();

  const locale = db.bahasa === 'jp'
    ? 'ja-JP'
    : db.bahasa === 'en'
      ? 'en-US'
      : 'id-ID';

  const bulanTahun = document.getElementById('bulanTahun');

  if (bulanTahun) {
    bulanTahun.innerText = bulanAktif.toLocaleString(locale, {
      month: 'long',
      year: 'numeric'
    });
  }

  const judulHeader = document.getElementById('judulHeaderBulan');

  if (judulHeader) {
    judulHeader.innerText =
      `${bahasa[db.bahasa].pendapatan} ${
        bulanAktif.toLocaleString(locale, {
          month: 'long',
          year: 'numeric'
        })
      }`;
  }

  const jmlHari = new Date(y, m + 1, 0).getDate();
  const mulai = new Date(y, m, 1).getDay();

  const hari = db.bahasa === 'id'
    ? ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
    : db.bahasa === 'en'
      ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      : ['日', '月', '火', '水', '木', '金', '土'];

  hari.forEach(h => {
    grid.innerHTML += `
      <div style="
        font-size:11px;
        color:#9ca3af;
        font-weight:bold;
        text-align:center
      ">${h}</div>
    `;
  });

  for (let i = 0; i < mulai; i++) {
    grid.innerHTML += '<div class="tanggal-kosong"></div>';
  }

  for (let t = 1; t <= jmlHari; t++) {
    const key =
      `${y}-${String(m + 1).padStart(2, '0')}-${String(t).padStart(2, '0')}`;

    const dataHari = db.data.filter(d => d.tanggal === key);

    const total = dataHari.reduce(
      (a, b) => a + Number(b.total || 0),
      0
    );

    const adaKerja = total > 0 ? 'ada-kerja' : '';

    grid.innerHTML += `
      <div
        class="kalender-item ${adaKerja}"
        onclick="openPopupDetail('${key}')">
        <b>${t}</b>
        <small>${total ? '¥' + total.toLocaleString() : '-'}</small>
      </div>
    `;
  }
}

/* =========================================================
   DETAIL KERJA PER TANGGAL
   ========================================================= */

function renderPopupDetail(tgl) {
  const dataHari = db.data.filter(d => d.tanggal === tgl);

  const judul = document.getElementById('judulDetail');

  if (judul) {
    judul.innerText = `Detail ${tgl}`;
  }

  const isi = document.getElementById('isiDetail');

  if (!isi) return;

  let html = `
    <div class="popup-content">

      <button
        type="button"
        class="primary-button"
        onclick="openPopupInputDariDetail('${tgl}')">
        ＋ Tambah Hasil Kerja
      </button>
  `;

  if (dataHari.length === 0) {
    html += `
      <p style="color:#9ca3af;margin-top:15px">
        Belum ada data kerja pada tanggal ini.
      </p>
    `;

  } else {
    const totalHari = dataHari.reduce(
      (a, b) => a + Number(b.total || 0),
      0
    );

    html += `
      <div class="stat-item">
        <span>Total Gaji</span>
        <b>¥${totalHari.toLocaleString()}</b>
      </div>
    `;

    dataHari.forEach(d => {
      html += `
        <div class="stat-item">
          <span>
            ${escapeHTML(d.lokasiNama)}
            <br>
            <small>${d.jumlah} ${escapeHTML(d.jenis)}</small>
          </span>

          <div>
            <b>¥${Number(d.total).toLocaleString()}</b>
            <br>

            <button
              type="button"
              onclick="openPopupEdit(${d.id})"
              class="btn-kecil"
              style="background:#3b82f6">
              Edit
            </button>

            <button
              type="button"
              onclick="hapusData(${d.id})"
              class="btn-kecil btn-danger">
              Hapus
            </button>
          </div>
        </div>
      `;
    });
  }

  html += '</div>';

  isi.innerHTML = html;
}

/* =========================================================
   INPUT DATA KERJA
   ========================================================= */

function simpanDataDariPopup() {
  const tanggal = document.getElementById('inputTanggal').value;

  const lokasiIdRaw = document.getElementById('inputLokasi').value;

  const jumlah = parseFloat(
    document.getElementById('inputJumlah').value
  );

  const catatanEl = document.getElementById('inputCatatan');
  const catatan = catatanEl ? catatanEl.value.trim() : '';

  const lokasi = db.lokasi.find(
    l => String(l.id) === String(lokasiIdRaw)
  );

  if (!tanggal || !lokasi || !Number.isFinite(jumlah) || jumlah <= 0) {
    alert('Isi semua data dengan benar.');
    return;
  }

  let total;

  if (lokasi.jenis === 'kamar' || lokasi.jenis === 'jam') {
    total = jumlah * Number(lokasi.tarif);
  } else {
    total = Number(lokasi.tarif);
  }

  db.data.push({
    id: Date.now(),
    tanggal,
    lokasiId: Number(lokasi.id),
    lokasiNama: lokasi.nama,
    jumlah,
    total,
    jenis: lokasi.jenis,
    catatan
  });

  tanggalAktifPopup = tanggal;

  simpan();
  renderSemua();

  closePopupInput();
  renderPopupDetail(tanggal);

  alert('Tersimpan!');
}

/* =========================================================
   DELETE DATA KERJA
   ========================================================= */

function hapusData(id) {
  if (!confirm('Yakin hapus data ini?')) return;

  db.data = db.data.filter(d => d.id != id);

  simpan();
  renderSemua();

  if (tanggalAktifPopup) {
    renderPopupDetail(tanggalAktifPopup);
  }
}

/* =========================================================
   EDIT DATA KERJA
   ========================================================= */

function simpanEdit() {
  const data = db.data.find(d => d.id == idEdit);

  if (!data) {
    alert('Data tidak ditemukan.');
    return;
  }

  const tanggal = document.getElementById('editTanggal').value;
  const lokasiId = document.getElementById('editLokasi').value;

  const jumlah = parseFloat(
    document.getElementById('editJumlah').value
  );

  const lokasi = db.lokasi.find(
    l => String(l.id) === String(lokasiId)
  );

  if (!tanggal || !lokasi || !Number.isFinite(jumlah) || jumlah <= 0) {
    alert('Isi semua data dengan benar.');
    return;
  }

  data.tanggal = tanggal;
  data.lokasiId = Number(lokasi.id);
  data.lokasiNama = lokasi.nama;
  data.jumlah = jumlah;
  data.jenis = lokasi.jenis;

  data.total = (
    lokasi.jenis === 'kamar' ||
    lokasi.jenis === 'jam'
  )
    ? jumlah * Number(lokasi.tarif)
    : Number(lokasi.tarif);

  tanggalAktifPopup = tanggal;

  simpan();
  renderSemua();
  closePopupEdit();
  renderPopupDetail(tanggal);
}

/* =========================================================
   STATISTIK
   ========================================================= */

function renderPopupStatistik() {
  const bulanIni =
    `${bulanAktif.getFullYear()}-${String(
      bulanAktif.getMonth() + 1
    ).padStart(2, '0')}`;

  const dataBulanIni = db.data.filter(
    x => x.tanggal.startsWith(bulanIni)
  );

  const jmlHari = new Date(
    bulanAktif.getFullYear(),
    bulanAktif.getMonth() + 1,
    0
  ).getDate();

  const hariKerja = [
    ...new Set(
      dataBulanIni
        .filter(x => x.tanggal)
        .map(x => x.tanggal)
    )
  ].length;

  const hariLibur = jmlHari - hariKerja;
  const b = bahasa[db.bahasa] || bahasa.id;

  const locale = db.bahasa === 'jp'
    ? 'ja-JP'
    : db.bahasa === 'en'
      ? 'en-US'
      : 'id-ID';

  const namaBulan = bulanAktif.toLocaleString(locale, {
    month: 'long',
    year: 'numeric'
  });

  let html = `
    <div class="stat-item">
      <span>Bulan</span>
      <b>${namaBulan}</b>
    </div>

    <div class="stat-item">
      <span>${b.hariKerja}</span>
      <b>${hariKerja} hari</b>
    </div>

    <div class="stat-item">
      <span>${b.hariLibur}</span>
      <b>${hariLibur} hari</b>
    </div>
  `;

  if (dataBulanIni.length > 0) {
    html += '<hr style="border-color:#374151;margin:12px 0">';
  }

  db.lokasi.forEach(l => {
    const dataLokasi = dataBulanIni.filter(
      x => Number(x.lokasiId) === Number(l.id)
    );

    if (dataLokasi.length === 0) return;

    const hariLokasi = [
      ...new Set(
        dataLokasi
          .filter(x => x.tanggal)
          .map(x => x.tanggal)
      )
    ].length;

    const total = dataLokasi.reduce(
      (a, x) => a + Number(x.total || 0),
      0
    );

    const jumlah = dataLokasi.reduce(
      (a, x) => a + Number(x.jumlah || 0),
      0
    );

    let rincian = '';

    if (l.jenis === 'jam') {
      rincian = `${jumlah.toLocaleString()} jam`;
    } else if (l.jenis === 'kamar') {
      rincian = `${jumlah.toLocaleString()} kamar`;
    } else {
      rincian = `${dataLokasi.length} kali`;
    }

    html += `
      <div class="stat-item">
        <span>
          <b>${escapeHTML(l.nama)}</b>
          <br>
          <small>${hariLokasi} hari kerja</small>
          <br>
          <small>${rincian}</small>
        </span>

        <b style="text-align:right">
          ¥${total.toLocaleString()}
        </b>
      </div>
    `;
  });

  if (dataBulanIni.length === 0) {
    html = `
      <p style="color:#9ca3af;text-align:center">
        Belum ada data di bulan ini
      </p>
    `;
  }

  const isi = document.getElementById('isiStatistikPopup');

  if (isi) {
    isi.innerHTML = html;
  }
}

/* =========================================================
   REKAP BULANAN
   ========================================================= */

function renderPopupRekap() {
  const bulanUnik = [
    ...new Set(
      db.data.map(d => String(d.tanggal).slice(0, 7))
    )
  ].filter(Boolean).sort().reverse();

  let html = '';

  bulanUnik.forEach(bln => {
    const total = db.data
      .filter(d => d.tanggal.startsWith(bln))
      .reduce((a, b) => a + Number(b.total || 0), 0);

    html += `
      <div class="stat-item">
        <span>${bln}</span>
        <b>¥${total.toLocaleString()}</b>
      </div>
    `;
  });

  const isi = document.getElementById('isiRekap');

  if (isi) {
    isi.innerHTML = html || 'Belum ada data';
  }
}

/* =========================================================
   RENDER SEMUA
   ========================================================= */

function renderSemua() {
  renderKalender();
  renderSelectInputLokasi();
  renderSelectEditLokasi();

  const bulanIni =
    `${bulanAktif.getFullYear()}-${String(
      bulanAktif.getMonth() + 1
    ).padStart(2, '0')}`;

  const dataBulanIni = db.data.filter(
    x => x.tanggal.startsWith(bulanIni)
  );

  const totalBulanIni = dataBulanIni.reduce(
    (a, b) => a + Number(b.total || 0),
    0
  );

  const totalSejakAwal = db.data.reduce(
    (a, b) => a + Number(b.total || 0),
    0
  );

  const totalGaji = document.getElementById('totalGaji');

  if (totalGaji) {
    totalGaji.innerText = '¥' + totalBulanIni.toLocaleString();
  }

  const targetText = document.getElementById('targetText');

  if (targetText) {
    targetText.innerText = `¥${Number(db.target).toLocaleString()}`;
  }

  const persen = db.target > 0
    ? Math.min(100, totalBulanIni / db.target * 100)
    : 0;

  const progressBar = document.getElementById('progressBar');

  if (progressBar) {
    progressBar.style.width = persen + '%';
  }

  const progressText = document.getElementById('progressText');

  if (progressText) {
    progressText.innerText = Math.round(persen) + '%';
  }

  const totalAwal = document.getElementById('totalSejakAwal');

  if (totalAwal) {
    totalAwal.innerHTML = `
      <div class="stat-item">
        <span>Total Sejak Awal</span>
        <b style="color:#3b82f6">
          ¥${totalSejakAwal.toLocaleString()}
        </b>
      </div>
    `;
  }

  renderPengeluaran();
}

/* =========================================================
   TARGET
   ========================================================= */

function ubahTarget() {
  const t = prompt('Masukkan target baru:', db.target);

  if (t === null || t.trim() === '') return;

  const nilai = parseFloat(t);

  if (!Number.isFinite(nilai) || nilai <= 0) {
    alert('Target tidak valid.');
    return;
  }

  db.target = nilai;

  simpan();
  renderSemua();
}

/* =========================================================
   SHARE LAPORAN
   ========================================================= */

function shareLaporan() {
  const tahun = bulanAktif.getFullYear();
  const bulan = bulanAktif.getMonth();

  const bulanKey =
    `${tahun}-${String(bulan + 1).padStart(2, '0')}`;

  const dataBulanIni = db.data.filter(
    d => String(d.tanggal).startsWith(bulanKey)
  );

  const pengeluaranBulanIni = db.pengeluaran.filter(
    p => String(p.tanggal).startsWith(bulanKey)
  );

  const totalPendapatan = dataBulanIni.reduce(
    (total, d) => total + Number(d.total || 0),
    0
  );

  const totalPengeluaran = pengeluaranBulanIni.reduce(
    (total, p) => total + Number(p.jumlah || 0),
    0
  );

  const gajiBersih = totalPendapatan - totalPengeluaran;

  const tanggalKerja = [
    ...new Set(dataBulanIni.map(d => d.tanggal).filter(Boolean))
  ];

  const totalHariKerja = tanggalKerja.length;

  const jumlahHariDalamBulan = new Date(
    tahun,
    bulan + 1,
    0
  ).getDate();

  const totalHariLibur =
    jumlahHariDalamBulan - totalHariKerja;

  const dataKamar = dataBulanIni.filter(
    d => d.jenis === 'kamar'
  );

  const totalKamar = dataKamar.reduce(
    (total, d) => total + Number(d.jumlah || 0),
    0
  );

  const kamarPerLokasi = {};

  dataKamar.forEach(d => {
    const nama = d.lokasiNama || 'Lokasi Tidak Diketahui';

    if (!kamarPerLokasi[nama]) {
      kamarPerLokasi[nama] = 0;
    }

    kamarPerLokasi[nama] += Number(d.jumlah || 0);
  });

  let rincianKamar = '';

  Object.keys(kamarPerLokasi).forEach(nama => {
    rincianKamar +=
      `   ${nama}: ${kamarPerLokasi[nama].toLocaleString()} kamar\n`;
  });

  const totalJam = dataBulanIni
    .filter(d => d.jenis === 'jam')
    .reduce((total, d) => total + Number(d.jumlah || 0), 0);

  let rincianPengeluaran = '';

  pengeluaranBulanIni.forEach(p => {
    rincianPengeluaran +=
      `   ${p.tanggal} - ${p.keterangan}: ¥${Number(p.jumlah).toLocaleString()}\n`;
  });

  const locale = db.bahasa === 'jp'
    ? 'ja-JP'
    : db.bahasa === 'en'
      ? 'en-US'
      : 'id-ID';

  const namaBulan = bulanAktif.toLocaleString(locale, {
    month: 'long',
    year: 'numeric'
  });

  const teks =
`📊 LAPORAN GAJIKU JEPANG

📅 Periode: ${namaBulan}

💰 Total Pendapatan:
¥${totalPendapatan.toLocaleString()}

💸 Total Pengeluaran:
¥${totalPengeluaran.toLocaleString()}

📋 Rincian Pengeluaran:
${rincianPengeluaran || '   Tidak ada pengeluaran\n'}
💵 GAJI BERSIH:
¥${gajiBersih.toLocaleString()}

📅 Total Hari Kerja:
${totalHariKerja} hari

🏖️ Total Hari Libur:
${totalHariLibur} hari

🛏️ Total Kamar:
${totalKamar.toLocaleString()} kamar
${rincianKamar}
⏱️ Total Jam:
${totalJam.toLocaleString()} jam`;

  if (navigator.share) {
    navigator.share({
      title: `Laporan GajiKu - ${namaBulan}`,
      text: teks
    }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(teks)
      .then(() => alert('✅ Laporan berhasil disalin!'))
      .catch(() => alert(teks));
  } else {
    alert(teks);
  }
}

/* =========================================================
   EXPORT BACKUP
   ========================================================= */

function exportBackup() {
  try {
    const backup = {
      version: 3,
      exportedAt: new Date().toISOString(),
      data: db.data,
      lokasi: db.lokasi,
      pengeluaran: db.pengeluaran,
      target: db.target,
      bahasa: db.bahasa
    };

    const json = JSON.stringify(backup, null, 2);

    const blob = new Blob([json], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;
    a.download = `gajiku_backup_${formatTanggalFile()}.json`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);

  } catch (error) {
    console.error('Export error:', error);
    alert('Gagal membuat backup.');
  }
}

/* =========================================================
   IMPORT BACKUP
   ========================================================= */

function importBackup() {
  const input = document.getElementById('importFile');

  if (!input) {
    alert('Input file tidak ditemukan.');
    return;
  }

  const file = input.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    try {
      const text = e.target.result;

      if (!text || !text.trim()) {
        throw new Error('File JSON kosong.');
      }

      let imported;

      try {
        imported = JSON.parse(text);
      } catch (err) {
        throw new Error('File bukan JSON yang valid.');
      }

      console.log('Isi backup:', imported);

      if (
        Array.isArray(imported.data) &&
        Array.isArray(imported.lokasi)
      ) {
        db = normalizeDatabase(imported);

      } else if (Array.isArray(imported.db)) {
        db = convertBackupLama(imported);

      } else {
        throw new Error('Format backup tidak dikenali.');
      }

      simpan();

      const select = document.getElementById('pilihBahasa');

      if (select) {
        select.value = db.bahasa;
      }

      updateBahasaUI();
      renderSemua();

      alert(
        '✅ IMPORT BERHASIL!\n\n' +
        `📋 Data kerja: ${db.data.length}\n` +
        `📍 Lokasi: ${db.lokasi.length}\n` +
        `💸 Pengeluaran: ${db.pengeluaran.length}\n` +
        `🎯 Target: ¥${Number(db.target).toLocaleString()}`
      );

      input.value = '';

    } catch (error) {
      console.error('IMPORT ERROR:', error);

      alert('❌ IMPORT GAGAL\n\n' + error.message);

      input.value = '';
    }
  };

  reader.onerror = function() {
    alert('❌ File tidak dapat dibaca.');
    input.value = '';
  };

  reader.readAsText(file);
}

/* =========================================================
   CONVERTER BACKUP LAMA
   ========================================================= */

function convertBackupLama(oldBackup) {
  const lokasiLama = Array.isArray(oldBackup.lokasiDb)
    ? oldBackup.lokasiDb
    : [];

  const dataLama = Array.isArray(oldBackup.db)
    ? oldBackup.db
    : [];

  const lokasi = [];

  lokasiLama.forEach((l, index) => {
    lokasi.push({
      id: Date.now() + index,
      nama: String(l.nama || ''),
      tarif: Number(l.tarif) || 0,
      jenis: ['kamar', 'jam', 'borongan'].includes(l.jenis)
        ? l.jenis
        : 'kamar'
    });
  });

  dataLama.forEach(oldData => {
    const nama = String(oldData.lokasi || '');

    const sudahAda = lokasi.some(l => l.nama === nama);

    if (nama && !sudahAda) {
      lokasi.push({
        id: Date.now() + lokasi.length,
        nama,
        tarif: Number(oldData.gaji) || 0,
        jenis: 'kamar'
      });
    }
  });

  const getLokasi = nama => {
    return lokasi.find(l => l.nama === String(nama));
  };

  const data = [];

  dataLama.forEach((oldData, index) => {
    const lokasiData = getLokasi(oldData.lokasi);

    if (!lokasiData) return;

    const total = Number(oldData.gaji) || 0;

    data.push({
      id: Date.now() + index,
      tanggal: String(oldData.tanggal || ''),
      lokasiId: Number(lokasiData.id),
      lokasiNama: lokasiData.nama,
      jumlah: Number(oldData.jumlah) || 0,
      total,
      jenis: lokasiData.jenis,
      catatan: String(oldData.catatan || '')
    });
  });

  const pengeluaranLama = Array.isArray(oldBackup.pengeluaranDb)
    ? oldBackup.pengeluaranDb
    : [];

  const pengeluaran = pengeluaranLama.map((p, index) => ({
    id: Number(p.id) || Date.now() + 20000 + index,
    tanggal: String(p.tanggal || ''),
    jumlah: Number(
      p.jumlah ?? p.total ?? p.pengeluaran ?? p.nominal
    ) || 0,
    keterangan: String(
      p.keterangan || p.nama || p.catatan || p.deskripsi || 'Pengeluaran'
    )
  })).filter(p => p.tanggal && p.jumlah > 0);

  return {
    data,
    lokasi,
    pengeluaran,
    target: Number(oldBackup.targetBulanan) || 250000,
    bahasa: 'id'
  };
}

/* =========================================================
   FITUR PENGELUARAN
   ========================================================= */

function tanggalHariIni() {
  const d = new Date();

  return (
    d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

function openPopupPengeluaran(id = null) {
  const popup = document.getElementById('popupPengeluaran');

  if (!popup) {
    alert('Popup pengeluaran belum tersedia. Periksa index.html.');
    return;
  }

  document.getElementById('pengeluaranId').value = id || '';

  if (id !== null) {
    const item = db.pengeluaran.find(p => p.id == id);

    if (!item) {
      alert('Data pengeluaran tidak ditemukan.');
      return;
    }

    document.getElementById('judulPopupPengeluaran').innerText =
      '✏️ Edit Pengeluaran';

    document.getElementById('pengeluaranTanggal').value =
      item.tanggal;

    document.getElementById('pengeluaranJumlah').value =
      item.jumlah;

    document.getElementById('pengeluaranKeterangan').value =
      item.keterangan;

  } else {
    document.getElementById('judulPopupPengeluaran').innerText =
      '💸 Tambah Pengeluaran';

    document.getElementById('pengeluaranTanggal').value =
      tanggalAktifPopup || tanggalHariIni();

    document.getElementById('pengeluaranJumlah').value = '';
    document.getElementById('pengeluaranKeterangan').value = '';
  }

  popup.style.display = 'block';
  document.getElementById('popupOverlay2').style.display = 'block';
}

function closePopupPengeluaran() {
  const popup = document.getElementById('popupPengeluaran');

  if (popup) {
    popup.style.display = 'none';
  }

  const overlay = document.getElementById('popupOverlay2');

  if (overlay) {
    overlay.style.display = 'none';
  }
}

function simpanPengeluaran() {
  const id = document.getElementById('pengeluaranId').value;

  const tanggal = document.getElementById('pengeluaranTanggal').value;

  const jumlah = Number(
    document.getElementById('pengeluaranJumlah').value
  );

  const keterangan = document.getElementById(
    'pengeluaranKeterangan'
  ).value.trim();

  if (
    !tanggal ||
    !Number.isFinite(jumlah) ||
    jumlah <= 0 ||
    !keterangan
  ) {
    alert('Isi tanggal, jumlah, dan keterangan dengan benar.');
    return;
  }

  if (id) {
    const item = db.pengeluaran.find(p => p.id == id);

    if (!item) {
      alert('Data pengeluaran tidak ditemukan.');
      return;
    }

    item.tanggal = tanggal;
    item.jumlah = jumlah;
    item.keterangan = keterangan;

  } else {
    db.pengeluaran.push({
      id: Date.now(),
      tanggal,
      jumlah,
      keterangan
    });
  }

  simpan();
  renderSemua();
  closePopupPengeluaran();

  alert('Pengeluaran berhasil disimpan!');
}

function hapusPengeluaran(id) {
  if (!confirm('Yakin ingin menghapus pengeluaran ini?')) {
    return;
  }

  db.pengeluaran = db.pengeluaran.filter(p => p.id != id);

  simpan();
  renderSemua();
}

/* =========================================================
   RENDER RINGKASAN DAN DAFTAR PENGELUARAN
   ========================================================= */

function renderPengeluaran() {
  const bulanIni =
    `${bulanAktif.getFullYear()}-${String(
      bulanAktif.getMonth() + 1
    ).padStart(2, '0')}`;

  const dataBulan = db.pengeluaran.filter(
    p => p.tanggal.startsWith(bulanIni)
  );

  const totalGaji = db.data
    .filter(d => d.tanggal.startsWith(bulanIni))
    .reduce((total, d) => total + Number(d.total || 0), 0);

  const totalPengeluaran = dataBulan.reduce(
    (total, p) => total + Number(p.jumlah || 0),
    0
  );

  const bersih = totalGaji - totalPengeluaran;

  const ringkasanGaji = document.getElementById('ringkasanGaji');
  const ringkasanPengeluaran = document.getElementById('ringkasanPengeluaran');
  const gajiBersih = document.getElementById('gajiBersih');

  if (ringkasanGaji) {
    ringkasanGaji.innerText = `¥${totalGaji.toLocaleString()}`;
  }

  if (ringkasanPengeluaran) {
    ringkasanPengeluaran.innerText =
      `¥${totalPengeluaran.toLocaleString()}`;
  }

  if (gajiBersih) {
    gajiBersih.innerText = `¥${bersih.toLocaleString()}`;
  }

  const daftar = document.getElementById('daftarPengeluaran');

  if (!daftar) return;

  if (dataBulan.length === 0) {
    daftar.innerHTML =
      '<div class="expense-empty">Belum ada pengeluaran bulan ini.</div>';
    return;
  }

  daftar.innerHTML = [...dataBulan]
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
    .map(p => `
      <div class="expense-item">
        <div class="expense-item-info">
          <b>${escapeHTML(p.keterangan)}</b>
          <small>${escapeHTML(p.tanggal)}</small>
          <div class="expense-amount">
            -¥${Number(p.jumlah).toLocaleString()}
          </div>
        </div>

        <div class="expense-item-actions">
          <button
            class="btn-kecil"
            style="background:#3b82f6"
            onclick="openPopupPengeluaran(${p.id})">
            Edit
          </button>

          <button
            class="btn-kecil btn-danger"
            onclick="hapusPengeluaran(${p.id})">
            Hapus
          </button>
        </div>
      </div>
    `).join('');
}

/* =========================================================
   TOGGLE RINCIAN PENGELUARAN
   ========================================================= */

function toggleRincianKeuangan() {
  const rincian = document.getElementById('rincianKeuangan');
  const tombol = document.getElementById('btnToggleRincianKeuangan');

  if (!rincian || !tombol) {
    console.warn('Elemen rincian pengeluaran tidak ditemukan.');
    return;
  }

  const sedangTertutup =
    window.getComputedStyle(rincian).display === 'none';

  if (sedangTertutup) {
    rincian.style.display = 'block';
    tombol.innerText = 'Tutup rincian pengeluaran ▲';
  } else {
    rincian.style.display = 'none';
    tombol.innerText = 'Lihat rincian pengeluaran ▼';
  }
}

/* =========================================================
   UTILITAS
   ========================================================= */

function formatTanggalFile() {
  const d = new Date();

  return (
    d.getFullYear() +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0') +
    '_' +
    String(d.getHours()).padStart(2, '0') +
    String(d.getMinutes()).padStart(2, '0')
  );
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* =========================================================
   DEBUG
   ========================================================= */

window.GajiKuDB = {
  lihat: function() {
    console.log(JSON.parse(JSON.stringify(db)));
  },

  reset: function() {
    if (!confirm('Hapus SEMUA data GajiKu?')) return;

    localStorage.removeItem('gajikuDB');
    location.reload();
  }
};
