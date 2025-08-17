// =================================
//  Referensi Elemen DOM
// =================================
const layarAwal = document.getElementById('layar-awal');
const inputNama = document.getElementById('input-nama');
const tombolMulai = document.getElementById('tombol-mulai');
const gameContainer = document.getElementById('game-container');
const namaPemainDisplay = document.getElementById('nama-pemain-display');
const skorTotalDisplay = document.getElementById('skor-total-display');
const skorPuzzleIniDisplay = document.getElementById('skor-puzzle-ini-display');
const waktuDisplay = document.getElementById('waktu-display');
const gameOutput = document.getElementById('game-output');
const commandForm = document.getElementById('command-form');
const commandInput = document.getElementById('command-input');
const backgroundMusic = document.getElementById('background-music')
const characterImage = document.getElementById('character-image');

// =================================
//  Data & State Game
// =================================
const puzzles = [
    { id: 1, zona: "Zona 1: Gerbang I/O", deskripsi: "AURA: 'Simpul pertama tidak stabil. Untuk menstabilkannya, tampilkan teks 'System Online' di terminal sistem.'", placeholder: "print(...)", solusi: "print('System Online')", penjelasan_solusi: "Fungsi print() digunakan untuk menampilkan teks ke layar." },
    { id: 2, zona: "Zona 1: Gerbang I/O", deskripsi: "AURA: 'Anomali energi terdeteksi. Buat variabel bernama `energy_level` dengan nilai integer `100` untuk menstabilkannya.'", placeholder: "energy_level = ...", solusi: "energy_level = 100", penjelasan_solusi: "Di Python, kita membuat variabel dan memberinya nilai secara langsung." },
    { id: 3, zona: "Zona 2: Gerbang Keputusan", deskripsi: "AURA: 'Gerbang logika ini hanya akan terbuka jika `power_level` lebih besar dari 50. Buat variabel `power_level = 75` dan tulis kondisi if untuk memeriksanya.'", placeholder: "power_level = 75 if ...:", solusi: "power_level = 75 if power_level > 50:", penjelasan_solusi: "Operator > digunakan untuk perbandingan 'lebih besar dari'." },
    { id: 4, zona: "Zona 2: Gerbang Keputusan", deskripsi: "AURA: 'Protokol keamanan memerlukan kata sandi. Buat variabel `password = 'alpha'` dan periksa apakah nilainya sama dengan `'alpha'`.'", placeholder: "password = 'alpha'\nif ...:", solusi: "password = 'alpha'\nif password == 'alpha':", penjelasan_solusi: "Operator == digunakan untuk perbandingan kesetaraan pada string." },
    { id: 5, zona: "Zona 3: Validasi Data", deskripsi: "AURA: 'Data protokol terpecah. Kumpulkan kembali ke dalam sebuah list bernama `protocols` yang berisi tiga string: 'HTTP', 'FTP', dan 'SSH'.'", placeholder: "protocols = [...]", solusi: "protocols = ['HTTP', 'FTP', 'SSH']", penjelasan_solusi: "List di Python dibuat menggunakan kurung siku [] dan setiap elemen dipisahkan oleh koma." },
    { id: 6, zona: "Zona 3: Validasi Data", deskripsi: "AURA: 'Dari sebuah list `node_status = ['OK', 'OK', 'ERROR']`, tampilkan status terakhir untuk menemukan sumber masalah.'", placeholder: "print(node_status[...])", solusi: "print(node_status[-1])", penjelasan_solusi: "Indeks -1 di Python selalu merujuk pada elemen terakhir dari sebuah list." },
    { id: 7, zona: "Zona 4: Otomatisasi Proses", deskripsi: "AURA: 'Beberapa sub-sistem perlu diaktifkan. Tulis `for loop` untuk menampilkan setiap item dari list `subsystems = ['Core', 'Memory', 'Firewall']`.'", placeholder: "for item in subsystems:", solusi: "subsystems = ['Core', 'Memory', 'Firewall']\nfor item in subsystems:\n  print(item)", penjelasan_solusi: "For loop di Python sangat ideal untuk melakukan iterasi pada setiap elemen dalam sebuah list." },
    { id: 8, zona: "Zona 4: Otomatisasi Proses", deskripsi: "AURA: 'Buat alat diagnostik. Definisikan sebuah fungsi bernama `diagnose` yang menerima satu parameter `system_name` dan menampilkan 'Mendiagnosis `system_name`...'.'", placeholder: "def diagnose(system_name):", solusi: "def diagnose(system_name):\n  print(f'Mendiagnosis {system_name}...')", penjelasan_solusi: "Kita mendefinisikan fungsi dengan `def` dan menggunakan f-string untuk memasukkan variabel ke dalam teks." },
    { id: 9, zona: "Zona 5: Gerbang Pra-Inti", deskripsi: "AURA: 'Gerbang terakhir memerlukan validasi. Buat fungsi bernama `validate_key` yang menerima parameter `key`. Jika `key` sama dengan `999`, fungsi harus mengembalikan string 'Valid'.'", placeholder: "def validate_key(key):", solusi: "def validate_key(key):\n  if key == 999:\n    return 'Valid'", penjelasan_solusi: "Fungsi bisa mengembalikan sebuah nilai menggunakan kata kunci `return`." },
    { id: 10, zona: "Zona 5: Paradoks Inti", deskripsi: "AURA: 'Paradoks Inti terungkap! Data stream rusak: `data = [10, 25, 8, 15, 30, 5]`. Buat fungsi `resolve_paradox` yang menerima list ini dan mengembalikan jumlah dari semua angka yang habis dibagi 5.'", placeholder: "def resolve_paradox(data_list):", solusi: "def resolve_paradox(data_list):\n  total = 0\n  for num in data_list:\n    if num % 5 == 0:\n      total += num\n  return total", penjelasan_solusi: "Fungsi ini melakukan iterasi, memeriksa kondisi dengan modulus (%), dan mengakumulasi hasilnya." }
];

let namaPemain = "";
let skorTotal = 0;
let puzzleSaatIniIndex = 0;
let waktuMulaiPuzzle;
let intervalWaktu;
let kesempatanTerakhir = 5; // PERUBAHAN: Menambah variabel kesempatan

const AURA_OPENING_TEXT = "Inisialisasi koneksi... Sinkronisasi dengan Kodeks berhasil. Selamat datang, ";

// =================================
//  Fungsi-Fungsi Game
// =================================

function setCharacter(namaKarakter) {
    characterImage.src = `img/gb_${namaKarakter}.png`;
}

function tampilkanTeks(teks, kelasCSS) {
    const p = document.createElement('p');
    p.textContent = teks;
    if (kelasCSS) {
        p.classList.add(kelasCSS);
    }
    gameOutput.appendChild(p);
    gameOutput.scrollTop = gameOutput.scrollHeight;
}

function tampilkanPuzzle(index) {
    if (index >= puzzles.length) {
        selesaikanGame();
        return;
    }
    const puzzle = puzzles[index];
    gameOutput.innerHTML = '';
    setCharacter('aura');
    tampilkanTeks(`Simpul Keamanan #${puzzle.id}/10`, 'system-text');
    tampilkanTeks(puzzle.deskripsi, 'aura-text');

    // PERUBAHAN: Menampilkan peringatan di puzzle terakhir
    if (index === puzzles.length - 1) {
        setCharacter('static');
        tampilkanTeks(`PERINGATAN: 'Static' sangat kuat di sini. Anda hanya punya ${kesempatanTerakhir} kesempatan!`, 'error-text');
    }

    commandInput.placeholder = puzzle.placeholder;
    commandInput.value = '';
    commandInput.focus();
    waktuMulaiPuzzle = Date.now();
    startTimerDisplay();
    const zonaIndex = Math.floor(index / 2) + 1;
    document.body.style.backgroundImage = `url('img/gb_zona_${zonaIndex}.png')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
}

function startTimerDisplay() {
    clearInterval(intervalWaktu);
    intervalWaktu = setInterval(() => {
        const detik = Math.floor((Date.now() - waktuMulaiPuzzle) / 1000);
        waktuDisplay.textContent = `${detik}s`;
        const skorPuzzle = Math.max(10, 1500 - (detik * 10));
        skorPuzzleIniDisplay.textContent = skorPuzzle;
    }, 1000);
}

function cekJawaban(jawabanPemain) {
    clearInterval(intervalWaktu);
    const puzzle = puzzles[puzzleSaatIniIndex];
    const jawabanNormalisasi = jawabanPemain.trim().replace(/\s+/g, ' ');
    const solusiNormalisasi = puzzle.solusi.trim().replace(/\s+/g, ' ');
    tampilkanTeks(`> ${jawabanPemain}`, 'command-echo');
    if (jawabanNormalisasi === solusiNormalisasi) {
        const waktuPenyelesaian = Math.floor((Date.now() - waktuMulaiPuzzle) / 1000);
        const skorPuzzle = Math.max(10, 1500 - (waktuPenyelesaian * 10));
        skorTotal += skorPuzzle;
        skorTotalDisplay.textContent = skorTotal;
        setCharacter('kodeks');
        tampilkanTeks('Akses Diizinkan. Simpul diamankan.', 'system-text');
        tampilkanTeks(puzzle.penjelasan_solusi, 'aura-text');
        puzzleSaatIniIndex++;
        setTimeout(() => tampilkanPuzzle(puzzleSaatIniIndex), 2000);
    } else {
        // PERUBAHAN: Logika untuk mengurangi kesempatan di puzzle terakhir
        if (puzzleSaatIniIndex === puzzles.length - 1) {
            setCharacter('static');
            kesempatanTerakhir--;
            if (kesempatanTerakhir > 0) {
                tampilkanTeks(`Akses Ditolak. Sisa kesempatan: ${kesempatanTerakhir}`, 'error-text');
                startTimerDisplay();
            } else {
                tampilkanTeks('KESEMPATAN HABIS. KONEKSI TERPUTUS.', 'error-text');
                setTimeout(gameOver, 2000);
            }
        } else {
            setCharacter('aura');
            tampilkanTeks('Akses Ditolak. Coba lagi.', 'error-text');
            startTimerDisplay();
        }
    }
}

function selesaikanGame() {
    gameOutput.innerHTML = '';
    commandForm.style.display = 'none';
    setCharacter('kodeks');
    tampilkanTeks('Sistem AURA berhasil dipulihkan!', 'system-text');
    tampilkanTeks(`Selamat, Kodeks ${namaPemain}! Skor akhir Anda: ${skorTotal}`, 'aura-text');
    document.body.style.backgroundImage = `url('img/gb_victory.png')`;
}

function gameOver() {
    gameOutput.innerHTML = '';
    commandForm.style.display = 'none';
    tampilkanTeks('Sistem gagal dipulihkan...', 'error-text');
    // PERUBAHAN: Menampilkan skor total saat game over
    setCharacter('static')
    tampilkanTeks(`Maaf, Kodeks. 'Static' telah mengambil alih. Skor akhir Anda: ${skorTotal}`, 'aura-text');
    document.body.style.backgroundImage = `url('img/gb_gameover.png')`;
}

function mulaiGame() {
    namaPemain = inputNama.value.trim();
    if (!namaPemain) {
        alert('Nama tidak boleh kosong.');
        return;
    }
    backgroundMusic.play();
    layarAwal.style.display = 'none';
    gameContainer.style.display = 'block';
    namaPemainDisplay.textContent = namaPemain;
    skorTotalDisplay.textContent = skorTotal;
    setCharacter('kodeks')
    tampilkanTeks(AURA_OPENING_TEXT + namaPemain + ".", 'aura-text');
    setTimeout(() => tampilkanPuzzle(puzzleSaatIniIndex), 1500);
    document.body.style.backgroundImage = `url('img/gb_zona_1.png')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
}

// =================================
//  Event Listeners & Inisialisasi
// =================================
tombolMulai.addEventListener('click', mulaiGame);

commandForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const jawabanPemain = commandInput.value.trim();
    if (jawabanPemain) {
        cekJawaban(jawabanPemain);
        commandInput.value = '';
    }
});

// Atur background layar awal (opsional)
// Anda bisa memilih gambar karakter atau gambar zona awal
document.body.style.backgroundImage = `url('img/gb_kodeks.png')`;
document.body.style.backgroundSize = 'cover';
document.body.style.backgroundRepeat = 'no-repeat';