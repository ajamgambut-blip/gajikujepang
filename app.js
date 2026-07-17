console.log("APP VERSI TERBARU 2026");
console.log("JS aktif");
// ===== PENGATURAN =====

let TARGET_BULANAN =
    Number(
        localStorage.getItem("target_bulanan")
    ) || 250000;

// ===== DATABASE =====

let db = JSON.parse(
    localStorage.getItem("gajiku_data")
) || [];
let editIndex = -1;
let editLokasiIndex = -1;
let lokasiDb;

try{

    lokasiDb = JSON.parse(
        localStorage.getItem(
            "gajiku_lokasi"
        )
    );

}catch(error){

    lokasiDb = null;

}

if(!lokasiDb){

    lokasiDb = [

        {
            nama:"SHIOMI",
            tarif:800,
            jenis:"kamar"
        },

        {
            nama:"DORMY",
            tarif:500,
            jenis:"kamar"
        },

        {
            nama:"ROPPONGGI",
            tarif:1200,
            jenis:"jam"
        }

    ];

    localStorage.setItem(
        "gajiku_lokasi",
        JSON.stringify(lokasiDb)
    );
}
let pengeluaranDb = JSON.parse(
    localStorage.getItem("gajiku_pengeluaran")
) || [];

// ===== HITUNG GAJI =====
function simpanTarget(){

    const nilai =
        Number(
            document.getElementById(
                "targetInput"
            ).value
        );

    if(!nilai || nilai <= 0){

        alert(
            "Masukkan target yang valid"
        );

        return;
    }

    TARGET_BULANAN = nilai;

    localStorage.setItem(
        "target_bulanan",
        nilai
    );

    render();

    alert(
        "Target berhasil disimpan"
    );
}
function tambahPengeluaran(){

    const nama =
        document.getElementById(
            "namaPengeluaran"
        ).value;

    const jumlah =
        Number(
            document.getElementById(
                "jumlahPengeluaran"
            ).value
        );

    if(!nama || !jumlah){

        alert(
            "Isi nama dan jumlah"
        );

        return;
    }

    pengeluaranDb.push({

        nama,
        jumlah

    });

    localStorage.setItem(

        "gajiku_pengeluaran",

        JSON.stringify(
            pengeluaranDb
        )

    );

    document.getElementById(
        "namaPengeluaran"
    ).value = "";

    document.getElementById(
        "jumlahPengeluaran"
    ).value = "";

    render();
}
function hapusPengeluaran(index){

    if(
        !confirm(
            "Hapus pengeluaran ini?"
        )
    ){
        return;
    }

    pengeluaranDb.splice(
        index,
        1
    );

    localStorage.setItem(

        "gajiku_pengeluaran",

        JSON.stringify(
            pengeluaranDb
        )

    );

    render();
}
function hitungGaji(lokasi, jumlah){

    const dataLokasi =
        lokasiDb.find(
            x => x.nama === lokasi
        );

    if(!dataLokasi){
        return 0;
    }

    return jumlah * dataLokasi.tarif;
}
function renderLokasi(){

    const select =
        document.getElementById(
            "lokasi"
        );

    if(!select) return;

    let html = "";

    lokasiDb.forEach(item=>{

        html += `
        <option value="${item.nama}">
            ${item.nama}
            (¥${item.tarif}/${
                item.jenis
            })
        </option>
        `;

    });

    select.innerHTML = html;
}
function tambahLokasi(){

    const nama =
        document.getElementById(
            "namaLokasi"
        ).value.trim();

    const tarif =
        Number(
            document.getElementById(
                "tarifLokasi"
            ).value
        );

    const jenis =
        document.getElementById(
            "jenisLokasi"
        ).value;

    if(!nama){

        alert(
            "Masukkan nama lokasi"
        );

        return;
    }

    if(!tarif){

        alert(
            "Masukkan tarif"
        );

        return;
    }

    const dataBaru = {

        nama,
        tarif,
        jenis

    };

   if(editLokasiIndex >= 0){

    lokasiDb[editLokasiIndex] =
        dataBaru;

    editLokasiIndex = -1;

}else{

    lokasiDb.push(dataBaru);

}

    localStorage.setItem(
        "gajiku_lokasi",
        JSON.stringify(lokasiDb)
    );

    document.getElementById(
        "namaLokasi"
    ).value = "";

    document.getElementById(
        "tarifLokasi"
    ).value = "";

    renderLokasi();
    renderDaftarLokasi();
}
function hapusLokasi(index){

    if(
        !confirm(
            "Hapus lokasi ini?"
        )
    ){
        return;
    }

    lokasiDb.splice(
        index,
        1
    );

    localStorage.setItem(
        "gajiku_lokasi",
        JSON.stringify(lokasiDb)
    );

    renderLokasi();
    renderDaftarLokasi();
}
function editLokasi(index){

    const lokasi =
        lokasiDb[index];

    document.getElementById(
        "namaLokasi"
    ).value =
        lokasi.nama;

    document.getElementById(
        "tarifLokasi"
    ).value =
        lokasi.tarif;

    document.getElementById(
        "jenisLokasi"
    ).value =
        lokasi.jenis;

    editLokasiIndex = index;

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
}

function renderDaftarLokasi(){

    const container =
        document.getElementById(
            "daftarLokasi"
        );

    if(!container){
        console.log(
            "daftarLokasi tidak ditemukan"
        );
        return;
    }

    let html = "";

    lokasiDb.forEach((item,index)=>{

        html += `

        <div class="item">

            <div class="item-title">
                ${item.nama}
            </div>

            <div>
                ¥${item.tarif}/${item.jenis}
            </div>

            <div
            style="
            display:flex;
            gap:8px;
            margin-top:10px;
            ">

                <button
                style="
                background:#2563eb;
                flex:1;
                "
                onclick="editLokasi(${index})">

                Edit

                </button>

                <button
                style="
                background:#dc2626;
                flex:1;
                "
                onclick="hapusLokasi(${index})">

                Hapus

                </button>

            </div>

        </div>

        `;

    });

    container.innerHTML = html;
}
// ===== SIMPAN DATA =====

function tambahData(){

    const tanggal =
        document.getElementById("tanggal").value;

    const lokasi =
        document.getElementById("lokasi").value;

    const jumlah =
        parseFloat(
            document.getElementById("jumlah").value
        );

    if(!tanggal){
        alert("Masukkan tanggal");
        return;
    }

    if(!jumlah || jumlah <= 0){
        alert("Masukkan jumlah yang benar");
        return;
    }

    
    const gaji =
        hitungGaji(lokasi, jumlah);

    const dataBaru = {
        tanggal,
        lokasi,
        jumlah,
        gaji
    };

    if(editIndex >= 0){

        db[editIndex] = dataBaru;

        editIndex = -1;

    } else {

        db.push(dataBaru);

    }

    localStorage.setItem(
        "gajiku_data",
        JSON.stringify(db)
    );

    document.getElementById("jumlah").value = "";

    render();
}

// ===== HAPUS DATA =====
function editData(index){

    const data = db[index];

    document.getElementById(
        "tanggal"
    ).value =
        data.tanggal;

    document.getElementById(
        "lokasi"
    ).value =
        data.lokasi;

    document.getElementById(
        "jumlah"
    ).value =
        data.jumlah;

    editIndex = index;

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
}
function hapusData(index){

    if(!confirm("Hapus data ini?")){
        return;
    }

    db.splice(index,1);

    localStorage.setItem(
        "gajiku_data",
        JSON.stringify(db)
    );

    render();
}

// ===== FORMAT YEN =====
function toggleTanggal(tanggal){

    tanggalTerbuka[tanggal] =
        !tanggalTerbuka[tanggal];

    render();

}
function yen(nilai){

    return "¥" +
        Number(nilai).toLocaleString("ja-JP");
}
let tanggalTerbuka = {};
function render(){

    let totalGaji = 0;
    let rekapLokasi = {};
    let totalKamar = 0;
    let totalJam = 0;

    let pendapatanTertinggi = 0;
    let pendapatanTerendah = Infinity;

    let dataPerTanggal = {};
    let dataPerBulan = {};

    // ===== HITUNG DATA =====

    db.forEach((item,index)=>{

        totalGaji += item.gaji;

        const bulan = item.tanggal.substring(0,7);

        if(!dataPerBulan[bulan]){
            dataPerBulan[bulan] = {
                pemasukan:0
            };
        }

        dataPerBulan[bulan].pemasukan += item.gaji;

        if(!rekapLokasi[item.lokasi]){
            rekapLokasi[item.lokasi] = 0;
        }

        rekapLokasi[item.lokasi] += item.gaji;

        const dataLokasi =
            lokasiDb.find(
                x => x.nama === item.lokasi
            );

        if(dataLokasi){

            if(dataLokasi.jenis === "jam"){
                totalJam += Number(item.jumlah);
            }else{
                totalKamar += Number(item.jumlah);
            }

        }

        if(item.gaji > pendapatanTertinggi){
            pendapatanTertinggi = item.gaji;
        }

        if(item.gaji < pendapatanTerendah){
            pendapatanTerendah = item.gaji;
        }

        if(!dataPerTanggal[item.tanggal]){
            dataPerTanggal[item.tanggal] = [];
        }

        dataPerTanggal[item.tanggal].push({
            ...item,
            index
        });

    });

    // ===== RIWAYAT =====

    let htmlRiwayat = "";

    const bulanFilter =
        document.getElementById("filterBulan")?.value || "";

    Object.keys(dataPerTanggal)
    .reverse()
    .forEach(tanggal=>{

        if(
            bulanFilter &&
            !tanggal.startsWith(bulanFilter)
        ){
            return;
        }

        let totalHari = 0;
        let detailHari = "";

        dataPerTanggal[tanggal]
        .forEach(item=>{

            totalHari += item.gaji;

            const jenis =
                lokasiDb.find(
                    x => x.nama === item.lokasi
                )?.jenis || "kamar";

            detailHari += `

            <div class="item">

                <div
                class="item-title"
                style="cursor:pointer;"
                onclick="detailGaji(${item.index})">

                    ${item.lokasi}

                </div>

                <div>

                    ${item.jumlah}

                    ${
                        jenis === "jam"
                        ? " Jam"
                        : jenis === "borongan"
                        ? " Borongan"
                        : " Kamar"
                    }

                </div>

                <div class="item-money">
                    ${yen(item.gaji)}
                </div>

                <div
                style="
                display:flex;
                gap:8px;
                margin-top:10px;
                ">

                    <button
                    style="
                    background:#2563eb;
                    flex:1;
                    "
                    onclick="editData(${item.index})">

                        Edit

                    </button>

                    <button
                    style="
                    background:#dc2626;
                    flex:1;
                    "
                    onclick="hapusData(${item.index})">

                        Hapus

                    </button>

                </div>

            </div>

            `;

        });

        const terbuka =
            tanggalTerbuka[tanggal];

        htmlRiwayat += `

        <div
        class="card"
        style="margin-bottom:16px;">

            <div
            onclick="toggleTanggal('${tanggal}')"
            style="
            cursor:pointer;
            display:flex;
            justify-content:space-between;
            align-items:center;
            ">

                <h3>📅 ${tanggal}</h3>

                <span>
                    ${terbuka ? "▲" : "▼"}
                </span>

            </div>

            ${
                terbuka
                ? `
                ${detailHari}

                <hr
                style="
                margin:12px 0;
                border-color:#333;
                ">

                <div
                style="
                display:flex;
                justify-content:space-between;
                font-weight:bold;
                color:#34d399;
                ">

                    <span>Total Hari Ini</span>

                    <span>${yen(totalHari)}</span>

                </div>
                `
                : `
                <div
                style="
                color:#34d399;
                font-weight:bold;
                margin-top:10px;
                ">

                    ${yen(totalHari)}

                </div>
                `
            }

        </div>

        `;

    });

    document.getElementById("riwayat").innerHTML =
        htmlRiwayat;

    // ===== TOTAL =====

    document.getElementById("totalGaji").innerText =
        yen(totalGaji);

    document.getElementById("targetText").innerText =
        yen(TARGET_BULANAN);

    // ===== REKAP LOKASI =====

    let htmlRekap = "";

    Object.keys(rekapLokasi)
    .forEach(namaLokasi=>{

        htmlRekap += `

        <div class="rekap-row">

            <span>${namaLokasi}</span>

            <span>
                ${yen(rekapLokasi[namaLokasi])}
            </span>

        </div>

        `;

    });

    document.getElementById(
        "rekapLokasi"
    ).innerHTML = htmlRekap;

    // ===== STATISTIK =====

    const hariKerja =
        Object.keys(dataPerTanggal).length;

    const rataRataHarian =
        hariKerja
        ? totalGaji / hariKerja
        : 0;

    document.getElementById(
        "statistik"
    ).innerHTML = `

    <div class="rekap-row">
        <span>Hari Kerja</span>
        <span>${hariKerja}</span>
    </div>

    <div class="rekap-row">
        <span>Pendapatan Tertinggi</span>
        <span>${yen(pendapatanTertinggi)}</span>
    </div>

    <div class="rekap-row">
        <span>Pendapatan Terendah</span>
        <span>${
            pendapatanTerendah === Infinity
            ? "-"
            : yen(pendapatanTerendah)
        }</span>
    </div>

    <div class="rekap-row">
        <span>Rata-rata Harian</span>
        <span>${yen(Math.round(rataRataHarian))}</span>
    </div>

    <div class="rekap-row">
        <span>Total Kamar</span>
        <span>${totalKamar}</span>
    </div>

    <div class="rekap-row">
        <span>Total Jam</span>
        <span>${totalJam.toFixed(1)}</span>
    </div>

    `;

    // ===== REKAP BULANAN =====

    let htmlBulanan = "";

    Object.keys(dataPerBulan)
    .reverse()
    .forEach(bulan=>{

        htmlBulanan += `

        <div class="rekap-row">

            <span>${bulan}</span>

            <span>
                ${yen(dataPerBulan[bulan].pemasukan)}
            </span>

        </div>

        `;

    });

    document.getElementById(
        "rekapBulanan"
    ).innerHTML = htmlBulanan;

    // ===== TARGET =====

    const progress =
        Math.min(
            (totalGaji / TARGET_BULANAN) * 100,
            100
        );

    document.getElementById(
        "progressBar"
    ).style.width =
        progress + "%";

    document.getElementById(
        "progressText"
    ).innerText =
        progress.toFixed(1) + "%";

    // ===== PREDIKSI =====

    const jumlahHariKerja =
        new Set(
            db.map(x => x.tanggal)
        ).size;

    const rataRata =
        jumlahHariKerja
        ? totalGaji / jumlahHariKerja
        : 0;

    const sekarang =
        new Date();

    const jumlahHariBulan =
        new Date(
            sekarang.getFullYear(),
            sekarang.getMonth() + 1,
            0
        ).getDate();

    const prediksi =
        rataRata * jumlahHariBulan;

    document.getElementById(
        "prediksiText"
    ).innerText =
        yen(Math.round(prediksi));

    renderKalender(dataPerTanggal);
}
// ===== TANGGAL HARI INI =====
function renderKalender(dataPerTanggal){

    const kalender =
        document.getElementById(
            "kalender"
        );

    if(!kalender) return;

    const sekarang =
        new Date();

    const tahun =
        sekarang.getFullYear();

    const bulan =
        sekarang.getMonth();

    const jumlahHari =
        new Date(
            tahun,
            bulan + 1,
            0
        ).getDate();

    const hariPertama =
        new Date(
            tahun,
            bulan,
            1
        ).getDay();

    let html = "";

    const namaHari = [
        "Min",
        "Sen",
        "Sel",
        "Rab",
        "Kam",
        "Jum",
        "Sab"
    ];

    namaHari.forEach(h=>{
        html += `
        <div class="kalender-hari">
            ${h}
        </div>
        `;
    });

    for(
        let i=0;
        i<hariPertama;
        i++
    ){
        html += `
        <div class="kalender-kosong"></div>
        `;
    }

    for(
        let tanggal=1;
        tanggal<=jumlahHari;
        tanggal++
    ){

        const dd =
            String(tanggal)
            .padStart(2,"0");

        const mm =
            String(bulan+1)
            .padStart(2,"0");

        const yyyy =
            tahun;

        const key =
            `${yyyy}-${mm}-${dd}`;

        let total = 0;

        db.forEach(item=>{

            if(item.tanggal === key){

                total += item.gaji;

            }

        });

        html += `
<div
class="kalender-item"
onclick="lihatTanggal('${key}')">
            <div class="kalender-tanggal">
                ${tanggal}
            </div>

            <div class="kalender-uang">

                ${
                    total
                    ? yen(total)
                    : ""
                }

            </div>

        </div>
        `;
    }

    kalender.innerHTML = html;
}
function lihatTanggal(tanggal){

    let html = `
    <h3>
    📅 ${tanggal}
    </h3>
    `;

    let total = 0;

    db.forEach(item=>{

        if(item.tanggal === tanggal){

            total += item.gaji;

            html += `

            <div
            style="
            margin-top:10px;
            padding:10px;
            background:#111827;
            border-radius:10px;
            ">

                <div>
                    ${item.lokasi}
                </div>

                <div>
                   ${item.jumlah}
${
    (
        lokasiDb.find(
            x => x.nama === item.lokasi
        )?.jenis || "kamar"
    ) === "jam"

    ? " Jam"

    : (
        lokasiDb.find(
            x => x.nama === item.lokasi
        )?.jenis || "kamar"
    ) === "borongan"

    ? " Borongan"

    : " Kamar"
}
                </div>

                <div
                style="
                color:#34d399;
                font-weight:bold;
                ">

                    ${yen(item.gaji)}

                </div>

            </div>

            `;
        }

    });

    html += `

    <hr
    style="
    margin:15px 0;
    border-color:#374151;
    ">

    <div
    style="
    display:flex;
    justify-content:space-between;
    font-weight:bold;
    font-size:18px;
    ">

        <span>Total</span>

        <span>
            ${yen(total)}
        </span>

    </div>

    `;

    const panel =
        document.getElementById(
            "detailTanggal"
        );

    panel.innerHTML = html;

    panel.style.display =
        "block";

    panel.scrollIntoView({
        behavior:"smooth"
    });
}
function exportBackup(){

    const backupData = {

        db,
        lokasiDb,
        pengeluaranDb,
        targetBulanan:
            TARGET_BULANAN

    };

    const blob = new Blob(

        [
            JSON.stringify(
                backupData,
                null,
                2
            )
        ],

        {
            type:
            "application/json"
        }

    );

    const link =
        document.createElement(
            "a"
        );

    link.href =
        URL.createObjectURL(
            blob
        );

    link.download =
        "gajiku-backup.json";

    link.click();
}
function importBackup(){

    const file =
        document.getElementById(
            "importFile"
        ).files[0];

    if(!file){

        alert(
            "Pilih file backup terlebih dahulu"
        );

        return;
    }

    const reader =
        new FileReader();

    reader.onload =
        function(event){

        try{

            const data =
                JSON.parse(
                    event.target.result
                );

            db =
                data.db || [];

            lokasiDb =
                data.lokasiDb || [];

            pengeluaranDb =
                data.pengeluaranDb || [];

            TARGET_BULANAN =
                data.targetBulanan
                || 250000;

            localStorage.setItem(
                "gajiku_data",
                JSON.stringify(db)
            );

            localStorage.setItem(
                "gajiku_lokasi",
                JSON.stringify(lokasiDb)
            );

            localStorage.setItem(
                "gajiku_pengeluaran",
                JSON.stringify(
                    pengeluaranDb
                )
            );

            localStorage.setItem(
                "target_bulanan",
                TARGET_BULANAN
            );

            renderLokasi();
            renderDaftarLokasi();
            render();

            alert(
                "Backup berhasil dipulihkan"
            );

        }catch(error){

            alert(
                "File backup tidak valid"
            );

            console.error(
                error
            );

        }

    };

    reader.readAsText(file);
}
window.onload = function(){

    const today = new Date();

    const yyyy =
        today.getFullYear();

    const mm =
        String(
            today.getMonth()+1
        ).padStart(2,"0");

    const dd =
        String(
            today.getDate()
        ).padStart(2,"0");

    const filter =
        document.getElementById(
            "filterBulan"
        );

    if(filter){
        filter.value =
            `${yyyy}-${mm}`;
    }

    document.getElementById(
        "tanggal"
    ).value =
        `${yyyy}-${mm}-${dd}`;

    

    renderLokasi();
    renderDaftarLokasi();
    render();
};
function showDetail(text){

    document.getElementById(
        "popupText"
    ).innerText = text;

    document.getElementById(
        "popup"
    ).style.display = "block";

    document.getElementById(
        "popupOverlay"
    ).style.display = "block";
}

function closePopup(){

    document.getElementById(
        "popup"
    ).style.display = "none";

    document.getElementById(
        "popupOverlay"
    ).style.display = "none";
}

function detailGaji(index){

    const item = db[index];

    showDetail(
        `Tanggal : ${item.tanggal}
Lokasi : ${item.lokasi}
Jumlah : ${item.jumlah}
Gaji : ${yen(item.gaji)}`
    );

}

console.log(lokasiDb);
console.log("APP JS BERHASIL DIMUAT");
