# Panduan Pengguna Perolehan

**SISTEM KEWANGAN SPMMPs (KERISI SAGA)**  
**VERSION 1.0**

*Disediakan oleh: Millennium Radius Sdn Bhd (517392-A)*

---

## Kandungan

- [Kandungan](#kandungan)
- [Pengenalan](#pengenalan)
- [1. Item Main](#1-item-main)
  - [1.1 Deskripsi Umum](#11-deskripsi-umum)
  - [1.2 Kaedah/Procedure](#12-kaedahprocedure)
- [2. Purchase Request](#2-purchase-request)
  - [2.1 Deskripsi Umum](#21-deskripsi-umum)
  - [2.2 Kaedah/Prosedur](#22-kaedahprosedur)
- [3. Advertisement / Pengiklanan](#3-advertisement--pengiklanan)
  - [3.1 Deskripsi Umum](#31-deskripsi-umum)
  - [3.2 Kaedah/Prosedur](#32-kaedahprosedur)
- [4. Jawab Tender/Quotation melalui Vendor Portal](#4-jawab-tenderquotation-melalui-vendor-portal)
  - [4.1 Deskripsi Umum](#41-deskripsi-umum)
  - [4.2 Kaedah/Prosedur](#42-kaedahprosedur)
- [5. Tender/Quotation](#5-tenderquotation)
  - [5.1 Deskripsi Umum](#51-deskripsi-umum)
  - [5.2 Kaedah/Prosedur](#52-kaedahprosedur)
- [6. Purchase Order](#6-purchase-order)
  - [6.1 Deskripsi Umum](#61-deskripsi-umum)
  - [6.2 Kaedah/Prosedur](#62-kaedahprosedur)
- [7. Surat Setuju Terima](#7-surat-setuju-terima)
  - [7.1 Deskripsi Umum](#71-deskripsi-umum)
  - [7.2 Kaedah/Prosedur](#72-kaedahprosedur)
- [8. Perjanjian / Agreement](#8-perjanjian--agreement)
  - [8.1 Deskripsi Umum](#81-deskripsi-umum)
  - [8.2 Kaedah/Prosedur](#82-kaedahprosedur)
- [9. Good Receive Note (GRN)](#9-good-receive-note-grn)
  - [9.1 Deskripsi Umum](#91-deskripsi-umum)
  - [9.2 Kaedah/Prosedur](#92-kaedahprosedur)
- [10. Catatan Kerja Dijalankan / Work Progress Note (WPN)](#10-catatan-kerja-dijalankan--work-progress-note-wpn)
  - [10.1 Deskripsi Umum](#101-deskripsi-umum)
  - [10.2 Kaedah/Prosedur](#102-kaedahprosedur)
- [11. Vendor Assessment](#11-vendor-assessment)
  - [11.1 Deskripsi Umum](#111-deskripsi-umum)
  - [11.2 Kaedah/Prosedur](#112-kaedahprosedur)
- [12. PO Closing](#12-po-closing)
  - [12.1 Deskripsi Umum](#121-deskripsi-umum)
  - [12.2 Kaedah/Prosedur](#122-kaedahprosedur)

---

## Pengenalan

Panduan pengguna ini mengandungi maklumat penting tentang cara menggunakan modul **Perolehan** untuk membuat pembelian melalui Sistem Kewangan SPMMPs (KERISI SAGA).

Modul ini melibatkan beberapa submodul iaitu:

1. Setup: Item Main
2. Purchase Request (PR)
3. Advertisement
4. Tender/Quotation
5. Surat Setuju Terima
6. Agreement
7. Purchase Order (PO)
8. Good Receive Note
9. Work Progress Note
10. Vendor Assessment
11. PO Closing

### Perhubungan antara submodule

Perhubungan antara submodule seperti yang akan digunakan dalam panduan pengguna ini adalah seperti berikut:

```
Perolehan
Mula
Tamat
2.Purchase Requisition (PR)
6.Purchase Order (PO)
9.Good Receive Note (GRN)
10.Work Progress Note (WPN)
AP
11. Vendor Assessment
Budget
Request Budget
Commit Budget
1.Item Main
3. Advertisement
5. Quotation/Tender
8. Agreement
7. SST
4. Jawab tender/quotation
```

---

## 1. Item Main

### 1.1 Deskripsi Umum

Dokumen ini memberi tumpuan secara menyeluruh kepada keperluan aplikasi untuk pengurusan dan Menyusun atur Item Utama (Item Main) didalam Sistem Kewangan SPMMPs (KERISI SAGA). Hanya pegawai/pengguna yang diberi kuasa boleh mengurus dan Menyusun atur Item Utama ini.

### 1.2 Kaedah/Procedure

#### 1.2.1 Log Masuk

- **URL:** https://kewangan.maips.gov.my
- **Skrin Log Masuk**
  1. Masukkan ID Pengguna pada Username.
  2. Masukkan Kata Laluan pada Password.
  3. Klik untuk masuk sistem.

#### 1.2.2 Papan Utama / Main Dashboard

Sistem akan memaparkan Skrin Papan Utama (Main Dashboard) setelah Pengguna Berjaya untuk log masuk.

1. Di skrin Papan Utama (Main Dashboard) sistem akan memaparkan Rumusan Tugasan (Task Summary) berdasarkan pengguna yang log masuk ke dalam sistem.
2. Pergi kepada menu di sebelah kiri skrin.
3. Klik menu **Purchasing / Setup**:
   - Skrin 2.2 2.2 Menu

#### 1.2.3 Kemaskini/Tambah Item Level 1 - Main Category

1. Pilih menu Purchasing / Setup dan klik **Item Main**. Semua Main Category akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari. Boleh gunakan wildcard '%' antara keyword: Contoh: `promosi%2023`
5. Boleh search menggunakan Smartfilter untuk carian lebih tepat. Pilih parameter carian dan kemudian tekan butang OK. Setelah selesai carian smartFilter, perlu reset dan klik OK untuk kembali ke skrin asal.
6. Klik pada ikon edit untuk mengemaskini data.
7. Kemaskini dan tekan bila selesai.
8. Klik pada butang add untuk memasukan data baru.
9. Lengkapkan dan tekan bila selesai. Medan yang bertanda * adalah wajib diisi.

#### 1.2.4 Kemaskini/Tambah Item Level 2 - Item Subcategory

1. Klik View pada Main Category. Semua Item Subcategory akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari. Boleh gunakan wildcard '%' antara keyword: Contoh: `bahan%buku`
5. Klik pada ikon edit untuk mengemaskini data.
6. Kemaskini dan tekan bila selesai.
7. Klik pada butang add untuk memasukan data baru.
8. Lengkapkan dan tekan bila selesai. Medan yang bertanda * adalah wajib diisi.

#### 1.2.5 Kemaskini/Tambah Item Level 3 - Item Subsiri

1. Klik View pada Item Subcategory. Semua Item Subsiri akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari. Boleh gunakan wildcard '%' antara keyword.
5. Klik pada ikon edit untuk mengemaskini data.
6. Kemaskini dan tekan bila selesai.
7. Klik pada butang add untuk memasukan data baru.
8. Lengkapkan dan tekan bila selesai. Medan yang bertanda * adalah wajib diisi. Dalam masa yang sama Item Code level 4 akan dimasukan secara automatic.

#### 1.2.6 Kemaskini Item Level 4 - Item Main

1. Klik View pada Item Subsiri. Semua Item Main akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari. Boleh gunakan wildcard '%' antara keyword: Contoh: `geran%khas`
5. Klik pada ikon edit untuk mengemaskini data.
6. Kemaskini dan tekan bila selesai.

#### 1.2.7 Senarai Item Main

1. Pilih menu Purchasing / Setup dan klik **Item Main Listing**. Semua Item akan dipaparkan.
2. Masukan Top Filter dan tekan search. Item main yang telah difilter akan dipaparkan pada skrin.
3. Untuk memaparkan semua Item main, biarkan Top Filter kosong dan tekan search. Semua Item Main akan dipaparkan pada skrin.
4. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
5. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
6. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari. Boleh gunakan wildcard '%' antara keyword.
7. Boleh search menggunakan Smartfilter untuk carian lebih tepat. Pilih parameter carian dan kemudian tekan butang OK. Setelah selesai carian smartFilter, perlu reset dan klik OK untuk kembali ke skrin asal.
8. Boleh cetak dalam format csv. Click pada butang 'Download CSV' untuk mencetak senarai dalam format excel (.csv).
9. Senarai Item Main yang dipaparkan pada listing di skrin akan didownload ke dalam format csv.
10. Buka file .csv yang telah dimuatturun untuk melihat senarai.

---

## 2. Purchase Request

### 2.1 Deskripsi Umum

Dokumen ini memberi tumpuan secara menyeluruh kepada keperluan aplikasi untuk pengurusan permintaan pembelian (purchase requisition) di Sistem Kewangan SPMMPs (KERISI SAGA). Hanya pegawai/pengguna yang bertanggungjawab menguruskan purchase requisition dibenarkan untuk menggunakan modul ini.

### 2.2 Kaedah/Prosedur

#### 2.2.1 Log Masuk

1. Masukkan ID Pengguna pada Username.
2. Masukkan Kata Laluan pada Password.
3. Klik untuk masuk sistem.

#### 2.2.2 Paparan Utama / Main Dashboard

Sistem akan memaparkan Skrin Papan Utama (Main Dashboard) setelah Pengguna Berjaya untuk log masuk.

1. Di skrin Papan Utama (Main Dashboard) sistem akan memaparkan Rumusan Tugasan (Task Summary) berdasarkan pengguna yang log masuk ke dalam sistem.
2. Pergi kepada menu di sebelah kiri skrin.
3. Klik menu **Purchasing / Purchase Requisition**:
   - Skrin 3.2 1.1 Papan Utama/Main Dashboard

#### 2.2.3 Hantar/kemaskini Purchase Request

1. Pilih menu Purchasing / Purchase Requisition dan klik **Purchase Requisition List**. Semua Purchase Requisition akan dipaparkan pada skrin.

   *Senarai Purchase Request (PR) adalah berdasarkan ketatapan berikut:*
   - Semua PR dari PTJ yang sama dengan pengguna yang log masuk.
   - Jika pengguna dari Role Purchasing Admin (Unit Perolehan) akan dapat melihat semua PR.

2. Klik pada butang **New** untuk memasukan data baru. Skrin untuk memasukan Purchase Requisition akan dipaparkan.
3. Sekiranya pengguna ingin memaparkan terus Skrin untuk memasukan Purchase Requisition tanpa menyenaraikan data terlebih dahulu boleh ambil terus dari menu **Purchasing / Purchase Requisition / New Purchase Requisition**. Skrin untuk memasukan Purchase Requisition akan dipaparkan.
4. Lengkapkan dan tekan save bila selesai. Medan yang bertanda * adalah wajib diisi.
5. Klik butang new untuk memasukan item.
6. Masukan Items Details dan tekan save. Medan yang bertanda * adalah wajib diisi. Hanya dibenarkan untuk pilih item yang ada budget yang mencukupi sahaja.
7. Ulang Langkah 7 dan 8 di atas untuk menambah item lain.
8. Kemudian pilih penerima tugasan seterusnya (Pelulus).
9. Seterusnya untuk simpan purchase Requisition sebagai draft tekan butang save. Maklumat Purchase Requisition akan disimpan sebagai draft. Kemudian boleh kemaskini dan submit.
10. Sekiranya ingin terus submit kepada pelulus yang dipilih tekan butang **save & submit**.
11. Tekan butang ok dan skrin akan refresh ke skrin Purchase Requisition List. Budget amount akan dipindah dari budget balance ke budget request.

#### 2.2.4 Hantar/kemaskini Purchase Request menggunakan fungsi salin (duplicate)

1. Pilih menu Purchasing / Purchase Requisition dan klik Purchase Requisition List. Semua Purchase Requisition akan dipaparkan pada skrin.

   *Senarai Purchase Request (PR) adalah berdasarkan ketatapan berikut:*
   - Semua PR dari PTJ yang sama dengan pengguna yang log masuk.
   - Jika pengguna dari Role Purchasing Admin (Unit Perolehan) akan dapat melihat semua PR.

2. Hanya purchase requisition yang berstatus REJECT atau CANCEL sahaja boleh disalin/copy. Klik pada ikon duplicate untuk salin. Skrin memaparkan Purchase Requisition yang berstatus draft dan maklumat adalah sama seperti dari PR yang disalin.
3. Semak, lengkapkan dan tekan save bila selesai. Medan yang bertanda * adalah wajib diisi.
4. Kemudian pilih penerima tugasan seterusnya (Pelulus).
5. Seterusnya untuk simpan purchase Requisition sebagai draft tekan butang save. Maklumat Purchase Requisition akan disimpan sebagai draft. Kemudian boleh kemaskini dan submit.
6. Sekiranya ingin terus submit kepada pelulus yang dipilih tekan butang **save & submit**.

#### 2.2.5 Semak (Check) Purchase Request

1. Pegawai (Checker) di PTJ akan login masuk menggunakan Login ID masing-masing. Untuk login masuk ke MyFIS2.0 rujuk bahagian 3.2.1 di atas.
2. Pada Papan Utama (Main Dashboard) akan dipaparkan Senarai Tugasan/Task Summary setiap pengguna yang Login masuk.
3. Pilih kumpulan Tugasan Purchasing – Purchase Requisition. Tugasan akan disenaraikan.
4. Gerakkan mouse ke Title dan klik untuk lihat paparan skrin. Maklumat Purchase Request akan dipaparkan.
5. Masukkan keputusan semakan sama ada Semak (Check) atau ditolak (Rejected). Masukan Next Receiver. Jika sekiranya ditolak (Rejected) perlu isi catatan pada ruangan Remarks.
6. Dan klik simpan dan submit. Jika keputusan adalah Check akan dihantar untuk pengesahan. Jika keputusan Rejected maka budget request akan dimasukan semula ke balance.
7. Skrin akan refresh ke skrin Papan Utama/Main Dashboard.

#### 2.2.6 Pengesahan (Verification) Purchase Request

1. Pegawai (Verifier) di PTJ akan login masuk menggunakan Login ID masing-masing. Untuk login masuk ke MyFIS2.0 rujuk bahagian 3.2.1 di atas.
2. Pada Papan Utama (Main Dashboard) akan dipaparkan Senarai Tugasan/Task Summary setiap pengguna yang Login masuk.
3. Pilih kumpulan Tugasan Purchasing – Purchase Requisition. Tugasan akan disenaraikan.
4. Gerakkan mouse ke Title dan klik untuk lihat paparan skrin. Maklumat Purchase Request akan dipaparkan.
5. Masukkan keputusan pengesahan sama ada Sah (Verify) atau ditolak (Rejected). Jika sekiranya ditolak (Rejected) perlu isi catatan pada ruangan Remarks.
6. Dan klik. Jika keputusan adalah Verify akan dihantar untuk Kelulusan. Jika keputusan Rejected maka budget request akan dimasukan semula ke balance.
7. Skrin akan refresh ke skrin Papan Utama/Main Dashboard.

#### 2.2.7 Kelulusan (Approval) Purchase Request

1. Pegawai (Pelulus) akan login masuk menggunakan Login ID masing-masing. Untuk login masuk ke MyFIS2.0 rujuk bahagian 3.2.1 di atas.
2. Pada Papan Utama (Main Dashboard) akan dipaparkan Senarai Tugasan/Task Summary setiap pengguna yang Login masuk.
3. Pilih kumpulan Tugasan yang berkenaan. Tugasan akan disenaraikan.
4. Gerakkan mouse ke Title dan klik untuk lihat paparan skrin. Maklumat Purchase Request akan dipaparkan.
5. Masukkan keputusan kelulusan sama ada Lulus (Approved) atau ditolak (Rejected). Jika sekiranya ditolak (Rejected) perlu isi catatan pada ruangan Remarks.
6. Dan klik. Jika keputusan adalah Approve, PR sudah boleh diguna untuk buat PO atau bill. Jika keputusan Rejected maka budget request akan dimasukan semula ke balance.
7. Skrin akan refresh ke skrin Papan Utama/Main Dashboard.

#### 2.2.8 Cetak/Download Purchase Request

1. Pilih menu Purchasing / Purchase Requisition dan klik Purchase Requisition List. Semua Purchase Requisition akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari. Boleh gunakan wildcard '%' antara keyword: Contoh: `promosi%usa`
5. Boleh search menggunakan Smartfilter untuk carian lebih tepat. Pilih parameter carian dan kemudian tekan butang OK. Setelah selesai carian smartFilter, perlu reset dan klik OK untuk kembali ke skrin asal.
6. Klik ikon **Download A4 Format** pada Purchase Requisition tersebut untuk download dan cetak A4 format.
7. Klik ikon **Download Borang RL – For dot Matric Printer** pada Purchase Requisition tersebut untuk download dan cetak untuk format dot matric Printer.
8. Boleh cetak dalam format csv. Click pada butang 'Download CSV' untuk mencetak senarai dalam format excel (.csv).
9. Senarai data yang dipaparkan pada listing di skrin akan didownload ke dalam format csv.
10. Buka file .csv yang telah dimuatturun dan akan dipaparkan seperti berikut.
11. Boleh juga cetak dalam format pdf. Click pada butang 'Download PDF' untuk mencetak senarai dalam format pdf.

#### 2.2.9 Senarai/download Purchase Request yang boleh dibatal

1. Pilih menu Purchasing / Purchase Requisition dan klik **List of Purchase Requisition Cancellation**. Semua Purchase Requisition yang telah dibatal akan dipaparkan pada skrin (jika ada).
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari. Boleh gunakan wildcard '%' antara keyword.
5. Boleh search menggunakan Smartfilter untuk carian lebih tepat. Pilih parameter carian dan kemudian tekan butang OK. Setelah selesai carian smartFilter, perlu reset dan klik OK untuk kembali ke skrin asal.
6. Boleh cetak dalam format csv. Click pada butang 'Download CSV' untuk mencetak senarai dalam format excel (.csv).
7. Senarai data yang dipaparkan pada listing di skrin akan didownload ke dalam format csv.
8. Buka file .csv yang telah dimuatturun dan akan dipaparkan seperti berikut.
9. Boleh juga cetak dalam format pdf. Click pada butang 'Download PDF' untuk mencetak senarai dalam format pdf.

#### 2.2.10 Pembatalan Purchase Requisition (PRL)

1. Pilih menu Purchasing / Purchase Requisition dan klik **List of PR to be Cancel**. Semua Purchase Requisition yang boleh dibatal keseluruhan akan dipaparkan pada skrin.

   Skrin ini memaparkan semua PR yang layak untuk dibatalkan keseluruhan iaitu:
   - Tiada PO, WPN, GRN atau BILL yang telah dibuat yang berstatus selain dari REJECT atau CANCEL. Jika sekiranya ada PO, WPN, GRN atau BILL yang berstatus DRAFT ianya perlu di delete terlebih dahulu untuk membolehkannya tersenarai untuk dibatalkan di sini.

2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari. Boleh gunakan wildcard '%' antara keyword.
5. Boleh search menggunakan Smartfilter untuk carian lebih tepat. Pilih parameter carian dan kemudian tekan butang OK. Setelah selesai carian smartFilter, perlu reset dan klik OK untuk kembali ke skrin asal.
6. Kemudian klik pada ikon cancel pada PRL yang ingin di cancel.
7. Masukan Cancel Reason dan kemudian klik butang submit.
8. Purchase Requisition akan dibatalkan dengan sertamerta dan budget akan dipulangkan.

#### 2.2.11 Senarai/download Purchase Requisition yang boleh dibatal sebahagian

1. Pilih menu Purchasing / Purchase Requisition dan klik **List of PR To Be Cancel Partial**. Semua Purchase Requisition yang boleh dibatal sebahagian akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari. Boleh gunakan wildcard '%' antara keyword: Contoh: `geran%khas`
5. Boleh search menggunakan Smartfilter untuk carian lebih tepat. Pilih parameter carian dan kemudian tekan butang OK. Setelah selesai carian smartFilter, perlu reset dan klik OK untuk kembali ke skrin asal.
6. Boleh cetak dalam format csv. Click pada butang 'Download CSV' untuk mencetak senarai dalam format excel (.csv).
7. Senarai data yang dipaparkan pada listing di skrin akan didownload ke dalam format csv.
8. Buka file .csv yang telah dimuatturun dan akan dipaparkan seperti berikut.
9. Boleh juga cetak dalam format pdf. Click pada butang 'Download PDF' untuk mencetak senarai dalam format pdf.

#### 2.2.12 Pembatalan sebahagian Purchase Requisition

1. Pilih menu Purchasing / Purchase Requisition dan klik List of PR To Be Cancel Partial. Semua Purchase Requisition yang boleh dibatal sebahagian akan dipaparkan pada skrin.

   Skrin ini memaparkan semua PR yang layak untuk dibatalkan sebahagian iaitu:
   - PO yang telah dibuat yang berstatus APPROVE.
   - Jika sekiranya PR untuk Direct Bill – Bill yang didaftarkan mestilah berstatus sekurang-kurangnya CHECK.

2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari. Boleh gunakan wildcard '%' antara keyword.
5. Boleh search menggunakan Smartfilter untuk carian lebih tepat. Pilih parameter carian dan kemudian tekan butang OK. Setelah selesai carian smartFilter, perlu reset dan klik OK untuk kembali ke skrin asal.
6. Kemudian klik pada ikon cancel pada PRL yang ingin di cancel. Maklumat PRL tersebut akan dipaparkan.
7. Masukan alasan pembatalan (Reason) dan tekan butang Submit. Purchase Requisition akan dibatalkan sebahagian dengan serta merta. Budget yang tidak digunakan itu akan dimasukan semula ke baki budget.

---

## 3. Advertisement / Pengiklanan

### 3.1 Deskripsi Umum

Dokumen ini memberi tumpuan secara menyeluruh kepada keperluan aplikasi untuk pengurusan pengiklanan tender/quotation/belian terus di MAIPs. Hanya pegawai/pengguna yang bertanggungjawab menguruskan pengiklanan dibenarkan untuk menggunakan aplikasi ini.

### 3.2 Kaedah/Prosedur

#### 3.2.1 Log Masuk

- Skrin 3.2 2 Log Masuk
1. Masukkan ID Pengguna pada Username.
2. Masukkan Kata Laluan pada Password.
3. Klik untuk masuk sistem.

#### 3.2.2 Paparan Utama / Main Dashboard

Sistem akan memaparkan Skrin Papan Utama (Main Dashboard) setelah Pengguna Berjaya untuk log masuk.

1. Di skrin Papan Utama (Main Dashboard) sistem akan memaparkan Rumusan Tugasan (Task Summary) berdasarkan pengguna yang log masuk ke dalam sistem.
2. Pergi kepada menu di sebelah kiri skrin.
3. Klik menu **Purchasing / Advertisement**:
   - Skrin 3.2 3.1 Papan Utama/Main Dashboard

#### 3.2.3 Hantar/kemaskini Permohonan Pengiklanan

1. Pilih menu Purchasing / Advertisement dan klik **Advertisement Request List**. Semua Advertisement Request akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari.
5. Klik butang **New** untuk memasukan data baru. Skrin untuk memasukan Advertisement Request akan dipaparkan.
6. Lengkapkan bahagian Information. Untuk medan **Tender/Quotation Document Only** perlu upload template berikut:
   - templat_lampiran.docx (wajib dan tidak boleh ubah nama file)
   - anydocument.any (tidak wajib dan boleh letak apa-apa nama fail)
7. Selain dari dokumen yang dinyatakan di atas, dokumen lain juga boleh dimuat naik seperti Borang Tawaran Harga dan Senarai Semak untuk diisi oleh pembida secara manual.
8. Untuk medan **Advertisement Document** boleh muat naik document yang menyatakan maklumat umum berkenaan tender/quotation/dp berkenaan seperti Tarikh buka, Tarikh tutup, kod jobscope yang layak memohon dan kelayakan lain yang diperlukan. Dokumen ini boleh dimuat turun secara percuma.
9. Masukan Jobscope yang terlibat pada bahagian Jobscope. Hanya vendor yang padan dengan jobscope ini sahaja yang akan menerima notifikasi melalui dashboard dan email.
10. Masukan soalan-soalan untuk bahagian Attachment A: Technical Info. Untuk mula mengisi soalan Technical Info boleh tekan sama ada butang Sample Data atau Copy From. Kemudian dari senarai soalan yang dipaparkan boleh kemaskini, hapus atau tambah.
11. Masukan soalan-soalan untuk bahagian Attachment A: Financial Info. Untuk mula mengisi soalan Financial Info boleh tekan sama ada butang Sample Data atau Copy From. Kemudian dari senarai soalan yang dipaparkan boleh kemaskini, hapus atau tambah.
12. Lengkapkan borang. Medan yang bertanda * adalah wajib diisi.
13. Seterusnya untuk simpan Advertisement Request sebagai draft tekan butang save. Maklumat Advertisement Request akan disimpan sebagai draft. Kemudian boleh kemaskini dan submit.
14. Setelah maklumat disemak dan lengkap boleh submit kepada pengesah yang dipilih dengan menekan butang **save & submit**.
15. Skrin akan refresh ke skrin Advertisement Request List.

#### 3.2.4 Pengesahan (Verification) Permohonan Pengiklanan

1. Pegawai (Verifier) di PTJ akan login masuk menggunakan Login ID masing-masing.
2. Pada Papan Utama (Main Dashboard) akan dipaparkan Senarai Tugasan/Task Summary setiap pengguna yang Login masuk.
3. Pilih kumpulan tugasan Purchasing – Advertisement Request. Tugasan akan disenaraikan.
4. Gerakkan mouse ke Title dan klik untuk lihat paparan skrin. Maklumat Advertisement Request akan dipaparkan.
5. Masukkan keputusan pengesahan sama ada Sah (Verify) atau ditolak (Rejected). Jika sekiranya ditolak (Rejected) perlu isi catatan pada ruangan Remarks.
6. Dan klik. Jika keputusan adalah Verify akan dihantar untuk Kelulusan. Jika keputusan Rejected maka budget request akan dimasukan semula ke balance.
7. Skrin akan refresh ke skrin Papan Utama/Main Dashboard.

#### 3.2.5 Kelulusan (Approval) Permohonan Pengiklanan

1. Pegawai (Pelulus) akan login masuk menggunakan Login ID masing-masing.
2. Pada Papan Utama (Main Dashboard) akan dipaparkan Senarai Tugasan/Task Summary setiap pengguna yang Login masuk.
3. Pilih kumpulan tugasan Purchasing – Advertisement Request. Tugasan akan disenaraikan.
4. Gerakkan mouse ke Title dan klik untuk lihat paparan skrin. Maklumat Advertisement Request akan dipaparkan.
5. Masukkan keputusan kelulusan sama ada Lulus (Approved) atau ditolak (Rejected). Jika sekiranya ditolak (Rejected) perlu isi catatan pada ruangan Remarks.
6. Dan klik. Jika keputusan adalah Approve, PR sudah boleh diguna untuk buat PO atau bill. Jika keputusan Rejected maka budget request akan dimasukan semula ke balance.
7. Skrin akan refresh ke skrin Papan Utama/Main Dashboard.

#### 3.2.6 Kemaskini Tarikh dan masa Pengiklanan

1. Pilih menu Purchasing / Advertisement Request dan klik **Duration Tender/Quotation**. Semua Advertisement Request yang telah diluluskan akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari. Boleh gunakan wildcard '%' antara keyword: Contoh: `promosi%usa`
5. Klik ikon **Buka Peti** pada Advertisement Request tersebut untuk paparkan skrin untuk memasukan Tarikh dan masa pengiklanan.
6. Click pada butang 'Save & Submit' untuk menyimpan data. Iklan akan dipaparkan di Vendor Portal pada "Tarikh Document Dijual" sehingga "Tarikh Tutup Peti".

---

## 4. Jawab Tender/Quotation melalui Vendor Portal

### 4.1 Deskripsi Umum

Dokumen ini memberi panduan cara-cara vendor untuk menjawab tender/Quotation/Direct Purchasing melalui vendor portal. Hanya vendor yang aktif dibenarkan untuk menggunakan aplikasi ini.

### 4.2 Kaedah/Prosedur

#### 4.2.1 Log Masuk

- Skrin 4.2 4 Log Masuk
1. Masukkan ID Pengguna pada Username.
2. Masukkan Kata Laluan pada Password.
3. Klik pada checkbox 'I'm not a robot'.
4. Klik untuk masuk sistem.
5. Sekiranya lupa password tekan butang Forget username/password. Masukan username (iaitu vendor code) dan password akan diemail ke email yang didaftarkan.

#### 4.2.2 Papan Utama / Main Dashboard

- Skrin 3.2 5.1 Papan Utama/Main Dashboard

Sistem akan memaparkan Skrin Papan Utama (Main Dashboard) setelah Pengguna Berjaya untuk log masuk.

1. Di skrin Papan Utama (Main Dashboard) sistem akan memaparkan Notifikasi (Notification) berdasarkan pengguna yang log masuk ke dalam sistem.
2. Pergi kepada menu di sebelah kiri skrin.
3. Klik menu Vendor Portal.

#### 4.2.3 Pay for Tender/Quotation/Direct Purchasing Document

1. Pilih menu Vendor Portal. Klik pada submenu **Tender/Quotation List**. Tender/Quotation/Direct Purchasing yang masih belum tutup peti akan dipaparkan.
2. Klik pada ikon **Buy/Download Document**.
3. Klik butang **Proceed to Payment**.
4. Pilih cara bayaran sama ada FPX atau Debit/Credit kad (MasterCard/Visa).
5. Seterusnya jika pilih bayaran menggunakan FPX pilih bank. Log masuk ke bank yang dipilih dan buat bayaran.
6. Jika pilihan bayaran adalah Debit/Credit, Langkah seterusnya adalah memilih sama ada Visa atau mastercard. Masukan perincian kad dan buat bayaran.
7. Setelah bayaran Berjaya dibuat skrin berikut akan dipaparkan.
8. Klik Ok dan kemudian klik butang Back untuk kembali ke maklumat tender/quotation.

#### 4.2.4 Jawab Tender/Quotation/Direct Purchase dan muat turun dokumen

1. Pilih menu Vendor Portal. Klik pada submenu Tender/Quotation List. Tender/Quotation/Direct Purchasing yang masih belum tutup peti akan dipaparkan.
2. Klik pada ikon Buy/Download Document.
3. Lengkapkan Attachment A: Technical Info dan Attachment B: Financial Info. Semua medan wajib diisi.
4. Lampirkan document yang diperlukan.
5. Jika sekiranya ingin memuat turun dokumen sebelum menjawab soalan, perlu tekan butang Save dahulu dan kemudian butang Download Document.
6. Setelah lengkap tekan butang Save. Masih boleh dikemaskini selagi belum tekan Submit.
7. Semak jawapan dan buat pembetulan jika perlu.
8. Kemudian tekan butang Submit. Selepas tekan butang Submit jawapan tidak boleh lagi dikemaskini.
9. Seterusnya tekan butang Download Document untuk muat turun dokumen. Dokumen akan dimuat turun berserta dengan jawapan yang telah diisi.

---

## 5. Tender/Quotation

### 5.1 Deskripsi Umum

Dokumen ini memberi tumpuan secara menyeluruh kepada keperluan aplikasi untuk membuka, menilai dan memilih pembida yang Berjaya untuk tender/quotation/belian terus yang diiklankan di MAIPs. Hanya pegawai/pengguna yang diberi bertanggungjawab dibenarkan untuk menggunakan aplikasi ini.

### 5.2 Kaedah/Prosedur

#### 5.2.1 Log Masuk

- Skrin 3.2 6 Log Masuk
1. Masukkan ID Pengguna pada Username.
2. Masukkan Kata Laluan pada Password.
3. Klik untuk masuk sistem.

#### 5.2.2 Paparan Utama / Main Dashboard

- Skrin 3.2 7.1 Papan Utama/Main Dashboard

Sistem akan memaparkan Skrin Papan Utama (Main Dashboard) setelah Pengguna Berjaya untuk log masuk.

1. Di skrin Papan Utama (Main Dashboard) sistem akan memaparkan Rumusan Tugasan (Task Summary) berdasarkan pengguna yang log masuk ke dalam sistem.
2. Pergi kepada menu di sebelah kiri skrin.
3. Klik menu **Purchasing / Tender/Quotation**.

#### 5.2.3 Memasukan Ahli Jawatan Kuasa Buka Peti

1. Pilih menu Purchasing / Tender/Quotation dan klik **Committee & Participant**. Semua Advertisement Request yang telah lulus akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari.
5. Klik ikon **Add Opening Committee** untuk memasukan AJK Buka Peti. Skrin untuk memasukan AJK Buka Peti akan dipaparkan.
6. Lengkapkan AJK Buka Peti dan kemudian tekan butang Save.
7. Tekan butang **Download Appointment Letter** untuk muat turun surat lantikan.
8. Tekan butang **Download Declaration Letter Word** untuk muat turun surat akuan.

#### 5.2.4 Paparkan Pembida yang membida dan kemaskini (lengkapkan) maklumat

1. Pilih menu Purchasing / Tender/Quotation dan klik Committee & Participant. Semua Advertisement Request yang telah lulus akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari.
5. Klik ikon **Add Participant** untuk memaparkan senarai pembida.
6. Klik ikon edit dan kemaskini maklumat.

#### 5.2.5 Muat Turun Jawapan Pembida

1. Pilih menu Purchasing / Advertisement dan klik **Committee Report**.
2. Pilih Reference No pada medan "Tender No". Senarai vendor yang membida akan dipaparkan.
3. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
4. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
5. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari.
6. Klik butang **Committee Report** untuk muat turun report ke dalam format excel.

#### 5.2.6 Masukan Ahli Kawatankuasa Penilai

1. Pilih menu Purchasing / Tender/Quotation dan klik **Evaluation**. Semua Advertisement Request yang telah lulus dan telah ada pembida akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari.
5. Klik ikon **Evaluation Tender**. Skrin untuk memasukan AJK Penilai akan dipaparkan.

   *Catatan berkenaan 'Evaluation Committee Type':*
   - **COMBINE COMMITTEE** – Jawatan Kuasa untuk Teknikal dan Harga adalah sekali dalam satu jawatan kuasa
   - **SEPARATE COMMITTEE** - Jawatan Kuasa untuk Teknikal dan Harga adalah jawatan kuasa berlainan

6. Lengkapkan AJK Penilai dan kemudian tekan butang Save.
7. Tekan butang Download Appointment Letter untuk muat turun surat lantikan.
8. Tekan butang Download Declaration Letter Word untuk muat turun surat akuan.

#### 5.2.7 Masukan kriteria penilaian

1. Pilih menu Purchasing / Tender/Quotation dan klik Evaluation. Semua Advertisement Request yang telah lulus dan telah ada pembida akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari.
5. Klik ikon **Evaluation Criteria**. Skrin akan dipaparkan.
6. Untuk mula mengisi kriteria penilaian boleh tekan sama ada butang Sample Data atau Copy From. Kemudian dari senarai soalan yang dipaparkan boleh kemaskini, hapus atau tambah.
7. Tekan butang save untuk simpan.

#### 5.2.8 Masukan markah penilaian dan dokumen sokongan

1. Pilih menu Purchasing / Tender/Quotation dan klik Evaluation. Semua Advertisement Request yang telah lulus dan telah ada pembida akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari.
5. Klik ikon Evaluation Tender. Skrin akan dipaparkan.
6. Klik ikon **Vendor Mark** untuk memasukan markah penilaian. Dan setelah markah dimasukan perlu tekan butang save.
7. Klik ikon edit untuk memasukan Supporting document (jika ada).
8. Tekan butang save untuk simpan.

#### 5.2.9 Masukan Ahli Kawatankuasa Pemilih dan Muat Turun Surat Akuan

1. Pilih menu Purchasing / Tender/Quotation dan klik **Selection**. Semua Advertisement Request yang telah lulus dan telah ada pembida akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari.
5. Klik ikon **Selection Tender**. Skrin untuk memasukan AJK Pemilih akan dipaparkan.
6. Klik butang **Add Selection Committee** masukan AJK Pemilih dan kemudian tekan butang Add.
7. Setelah maklumat AJK Pemilih lengkap, boleh muat turun surat akuan dengan menekan butang **Download Surat Akuan Word**.
8. Tekan butang Download Appointment Letter untuk muat turun surat lantikan untuk Quotation dan Belian Terus.

#### 5.2.10 Masukan keputusan AJK Pemilih dan muat turun Kertas Keputusan

1. Pilih menu Purchasing / Tender/Quotation dan klik Selection. Semua Advertisement Request yang telah lulus dan telah ada pembida akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari.
5. Klik ikon Selection Tender. Skrin akan dipaparkan.
6. Klik pada ikon edit untuk memasukan keputusan.
7. Setelah keputusan dimasukan, boleh muat turun Kertas Keputusan dengan menekan ikon **Kertas Keputusan**.

#### 5.2.11 Pembatalan (CANCEL)

1. Pilih menu Purchasing / Tender/Quotation dan klik **Tender/Quotation Cancellation**. Semua Tender/Quotation/DP yang telah lulus, tidak diiklankan dan belum ada pembida akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari.
5. Klik pada checkbox untuk memilih tender/quotation yang akan dibatalkan.
6. Kemudian Klik pada butang **Tender Cancel** untuk pembatalan. Seterusnya masukan alasan (Reason) pembatalan.
7. Setelah Berjaya dibatalkan, tender/quotation tersebut akan disenaraikan pada section List of Cancel Tender/Quotation.

---

## 6. Purchase Order

### 6.1 Deskripsi Umum

Dokumen ini memberi tumpuan secara menyeluruh kepada keperluan aplikasi untuk pengurusan permintaan pembelian/purchase Order di MAIPs. Hanya pegawai/pengguna yang bertanggungjawab menguruskan purchase Order dibenarkan untuk menggunakan aplikasi ini.

### 6.2 Kaedah/Prosedur

#### 6.2.1 Log Masuk

- Skrin 4.2 8 Log Masuk
1. Masukkan ID Pengguna pada Username.
2. Masukkan Kata Laluan pada Password.
3. Klik untuk masuk sistem.

#### 6.2.2 Paparan Utama / Main Dashboard

- Skrin 3.2 9.1 Papan Utama/Main Dashboard

Sistem akan memaparkan Skrin Papan Utama (Main Dashboard) setelah Pengguna Berjaya untuk log masuk.

1. Di skrin Papan Utama (Main Dashboard) sistem akan memaparkan Rumusan Tugasan (Task Summary) berdasarkan pengguna yang log masuk ke dalam sistem.
2. Pergi kepada menu di sebelah kiri skrin.
3. Klik menu **Purchasing / Purchase Order**.

#### 6.2.3 Daftar/Submit Purchase Order dengan memindah (transfer) dari Purchase Requisition

1. Pilih menu Purchasing / Purchase Requisition dan klik Purchase Requisition List. Semua Purchase Requisition akan dipaparkan pada skrin.

   *Ikon transfer hanya akan aktif jika belum ada PO atau bukan Direct Bill.*

2. Klik pada ikon **transfer to PO**.
3. Klik Yes. Maklumat asas PR akan disalin ke skrin PO.
4. Semak dan lengkapkan. Medan yang bertanda (*) adalah medan wajib diisi.
5. PR Item akan secara automatic akan dimasukan ke dalam PO Item.
6. Masukan Next Receiver (Pelulus).
7. Seterusnya untuk simpan purchase Order sebagai draft tekan butang save. Maklumat Purchase Order akan disimpan sebagai draft. Kemudian boleh kemaskini dan submit.
8. Sekiranya ingin terus submit kepada pelulus yang dipilih tekan butang **save & submit**. Selepas submit Berjaya No PO akan dijana.

#### 6.2.4 Kelulusan (Approval) Purchase Order

1. Pegawai (Pelulus) akan login masuk menggunakan Login ID masing-masing. Untuk login masuk ke MyFIS2.0 rujuk bahagian 6.2.1 di atas.
2. Pada Papan Utama (Main Dashboard) akan dipaparkan Senarai Tugasan/Task Summary setiap pengguna yang Login masuk.
3. Pilih kumpulan Tugasan Purchasing – Purchase order. Tugasan akan disenaraikan.
4. Gerakkan mouse ke Title dan klik untuk lihat paparan skrin. Maklumat Purchase Order akan dipaparkan.
5. Masukkan keputusan kelulusan sama ada Lulus (Approved) atau ditolak (Rejected). Jika sekiranya ditolak (Rejected) perlu isi catatan pada ruangan Remarks.
6. Dan klik. Jika lulus Budget request akan dipindah ke Budget Commit.
7. Skrin akan refresh ke skrin Papan Utama/Main Dashboard.

#### 6.2.5 Cetak/Download Purchase Order

1. Pilih menu Purchasing / Purchase Order dan klik Purchase Order List. Semua Purchase Order akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari. Boleh gunakan wildcard '%' antara keyword: Contoh: `geran%khas`
5. Boleh search menggunakan Smartfilter untuk carian lebih tepat. Pilih parameter carian dan kemudian tekan butang OK. Setelah selesai carian smartFilter, perlu reset dan klik OK untuk kembali ke skrin asal.
6. Klik ikon **Download - Borang Pesanan (A4 Format)** pada Purchase Order tersebut untuk download dan cetak format A4. Borang pesanan perkhidmatan dalam format A4 akan dipaparkan.
7. Klik ikon **Download - Download Borang Pesanan (For dot Matric Printer)** pada Purchase Order tersebut untuk download dan cetak format dot matric printer.
8. Boleh cetak senarai PO dalam format csv. Click pada butang 'Download CSV' untuk mencetak senarai dalam format excel (.csv).
9. Senarai data yang dipaparkan pada listing di skrin akan didownload ke dalam format csv.
10. Buka file .csv yang telah dimuatturun dan akan dipaparkan seperti berikut.
11. Boleh juga cetak dalam format pdf. Click pada butang 'Download PDF' untuk mencetak senarai dalam format pdf.

#### 6.2.6 Cetak/Download Salinan Purchase Order

1. Pilih menu Purchasing / Report PO dan klik **Bendahari**. Semua Purchase Order yang telah LULUS akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari. Boleh gunakan wildcard '%' antara keyword: Contoh: `/2302`
5. Klik ikon **Cetak Salinan Asal** pada Purchase Order tersebut untuk download Salinan asal. Salinan Asal PO akan dipaparkan.
6. Klik ikon **Cetak Salinan Perolehan** pada Purchase Order tersebut untuk download Salinan Perolehan. Salinan Perolehan PO akan dipaparkan.
7. Klik ikon **Cetak Salinan Bendahari** pada Purchase Order tersebut untuk download Salinan Bendahari. Salinan Bendahari PO akan dipaparkan.

#### 6.2.7 Senarai/download Purchase Order yang telah dibatal

1. Pilih menu Purchasing / Purchase Order dan klik **Purchase Order Cancellation**. Semua Purchase Order yang boleh dibatal akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari. Boleh gunakan wildcard '%' antara keyword: Contoh: `geran%khas`
5. Boleh search menggunakan Smartfilter untuk carian lebih tepat. Pilih parameter carian dan kemudian tekan butang OK. Setelah selesai carian smartFilter, perlu reset dan klik OK untuk kembali ke skrin asal.
6. Boleh cetak dalam format csv. Click pada butang 'Download CSV' untuk mencetak senarai dalam format excel (.csv).
7. Senarai data yang dipaparkan pada listing di skrin akan didownload ke dalam format csv.
8. Buka file .csv yang telah dimuatturun dan akan dipaparkan seperti berikut.
9. Boleh juga cetak dalam format pdf. Click pada butang 'Download PDF' untuk mencetak senarai dalam format pdf.

#### 6.2.8 Pembatalan Purchase Order (POR)

1. Pilih menu Purchasing / Purchase Order dan klik **List of Purchase Order Cancellation**. Semua Purchase Order yang telah dibatal akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari. Boleh gunakan wildcard '%' antara keyword.
5. Boleh search menggunakan Smartfilter untuk carian lebih tepat. Pilih parameter carian dan kemudian tekan butang OK. Setelah selesai carian smartFilter, perlu reset dan klik OK untuk kembali ke skrin asal.
6. Click pada butang 'Download CSV' untuk mencetak senarai dalam format excel (.csv).
7. Boleh juga cetak dalam format pdf. Click pada butang 'Download PDF' untuk mencetak senarai dalam format pdf.
8. Klik pada butang **New** untuk cancel. Senarai PO yang boleh dibatalkan akan dipaparkan.
9. Kemudian klik pada ikon cancel pada POR yang ingin di cancel. Maklumat PO tersebut akan dipaparkan.
10. Masukan sebab pembatalan (Reason) dan tekan butang Save & Submit. Purchase Order akan dibatalkan sertamerta dan budget akan dipulangkan.

#### 6.2.9 Senarai/download Purchase Order yang boleh dibatal sebahagian

1. Pilih menu Purchasing / Purchase Order dan klik **Cancel PO Partial Listing**. Semua Purchase Order yang boleh dibatal sebahagian akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari. Boleh gunakan wildcard '%' antara keyword: Contoh: `geran%khas`
5. Boleh search menggunakan Smartfilter untuk carian lebih tepat. Pilih parameter carian dan kemudian tekan butang OK. Setelah selesai carian smartFilter, perlu reset dan klik OK untuk kembali ke skrin asal.
6. Boleh cetak dalam format csv. Click pada butang 'Download CSV' untuk mencetak senarai dalam format excel (.csv).
7. Senarai data yang dipaparkan pada listing di skrin akan didownload ke dalam format csv.
8. Buka file .csv yang telah dimuatturun dan akan dipaparkan seperti berikut.
9. Boleh juga cetak dalam format pdf. Click pada butang 'Download PDF' untuk mencetak senarai dalam format pdf.

#### 6.2.10 Pembatalan sebahagian Purchase Order (POR)

1. Pilih menu Purchasing / Purchase Order dan klik Cancel PO Partial Listing. Semua Purchase Order yang boleh dibatal sebahagian akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari. Boleh gunakan wildcard '%' antara keyword.
5. Boleh search menggunakan Smartfilter untuk carian lebih tepat. Pilih parameter carian dan kemudian tekan butang OK. Setelah selesai carian smartFilter, perlu reset dan klik OK untuk kembali ke skrin asal.
6. Click pada butang 'Download CSV' untuk mencetak senarai dalam format excel (.csv).
7. Boleh juga cetak dalam format pdf. Click pada butang 'Download PDF' untuk mencetak senarai dalam format pdf.
8. Klik pada butang New untuk cancel.
9. Kemudian klik pada ikon cancel pada POR yang ingin di cancel.
10. Sebahagian Purchase Order itu akan dibatalkan dengan sertamerta dan budget akan dipulangkan.

---

## 7. Surat Setuju Terima

### 7.1 Deskripsi Umum

Dokumen ini memberi tumpuan secara menyeluruh kepada keperluan aplikasi untuk menjana Surat Setuju Terima di MAIPs. Hanya pegawai/pengguna yang bertanggungjawab menguruskan Tender/Quotation dibenarkan untuk menggunakan aplikasi ini.

### 7.2 Kaedah/Prosedur

#### 7.2.1 Log Masuk

- Skrin 3.2 10 Log Masuk
1. Masukkan ID Pengguna pada Username.
2. Masukkan Kata Laluan pada Password.
3. Klik untuk masuk sistem.

#### 7.2.2 Paparan Utama / Main Dashboard

- Skrin 3.2 11.1 Papan Utama/Main Dashboard

Sistem akan memaparkan Skrin Papan Utama (Main Dashboard) setelah Pengguna Berjaya untuk log masuk.

1. Di skrin Papan Utama (Main Dashboard) sistem akan memaparkan Rumusan Tugasan (Task Summary) berdasarkan pengguna yang log masuk ke dalam sistem.
2. Pergi kepada menu di sebelah kiri skrin.
3. Klik menu **Purchasing / Tender Quotation**.

#### 7.2.3 Kemaskini No Rujukan Surat Setuju Terima

1. Pilih menu Purchasing / Tender/Quotation dan klik **Generate Offer Letter**. Semua Tender/Quotation yang telah ada pembida yang berjaya akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari.
5. Klik ikon **Generate No Offer Letter** untuk memasukan No Rujukan Surat Setuju Terima. Skrin untuk memasukan No Rujukan akan dipaparkan.
6. Lengkapkan dan tekan butang ok.

#### 7.2.4 Jana Surat Setuju Terima

1. Pilih menu Purchasing / Tender/Quotation dan klik Generate Offer Letter. Semua Tender/Quotation yang telah ada pembida yang berjaya akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari.
5. Klik ikon **Offer Letter** untuk muat turun Surat Setuju Terima (SST). Popup akan dipaparkan untuk masukan maklumat Tempoh Perkhidmatan dan maklumat Bond.
6. Click Save, SST akan dimuat turun.

---

## 8. Perjanjian / Agreement

### 8.1 Deskripsi Umum

Dokumen ini memberi tumpuan secara menyeluruh kepada keperluan aplikasi untuk menyimpan maklumat perjanjian di MAIPs. Hanya pegawai/pengguna yang bertanggungjawab menguruskan Tender/Quotation dibenarkan untuk menggunakan aplikasi ini.

### 8.2 Kaedah/Prosedur

#### 8.2.1 Log Masuk

- Skrin 3.2 12 Log Masuk
1. Masukkan ID Pengguna pada Username.
2. Masukkan Kata Laluan pada Password.
3. Klik untuk masuk sistem.

#### 8.2.2 Paparan Utama / Main Dashboard

- Skrin 3.2 13.1 Papan Utama/Main Dashboard

Sistem akan memaparkan Skrin Papan Utama (Main Dashboard) setelah Pengguna Berjaya untuk log masuk.

1. Di skrin Papan Utama (Main Dashboard) sistem akan memaparkan Rumusan Tugasan (Task Summary) berdasarkan pengguna yang log masuk ke dalam sistem.
2. Pergi kepada menu di sebelah kiri skrin.
3. Klik menu **Purchasing / Tender Quotation**.

#### 8.2.3 Masukan Maklumat Perjanjian (Agreement) dari Tender/Quotation

1. Pilih menu Purchasing / Tender/Quotation dan klik **Advertisement Complete**. Semua Tender/Quotation yang telah ada pembida yang berjaya akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search. Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari.
5. Klik ikon **Create Agreement** untuk memasukan maklumat perjanjian. Skrin untuk memasukan perjanjian akan dipaparkan.
6. Lengkapkan dan tekan butang save and submit.

#### 8.2.4 Masukan Maklumat Perjanjian (Agreement) secara manual

1. Pilih menu Purchasing / Agreement dan klik **List of Agreement**. Semua perjanjian akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search. Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari.
5. Boleh search menggunakan Smartfilter untuk carian lebih tepat. Pilih parameter carian dan kemudian tekan butang OK. Setelah selesai carian smartFilter, perlu reset dan klik OK untuk kembali ke skrin asal.
6. Klik butang **Add** untuk memasukan maklumat perjanjian. Skrin untuk memasukan perjanjian akan dipaparkan.
7. Lengkapkan dan tekan butang save and submit.

#### 8.2.5 Pembatalan (CANCEL) Maklumat Perjanjian (Agreement)

1. Pilih menu Purchasing / Agreement dan klik List of Agreement. Semua perjanjian akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search. Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari.
5. Boleh search menggunakan Smartfilter untuk carian lebih tepat. Pilih parameter carian dan kemudian tekan butang OK. Setelah selesai carian smartFilter, perlu reset dan klik OK untuk kembali ke skrin asal.
6. Klik ikon **Cancel** untuk membatalkan maklumat perjanjian. Perjanjian hanya boleh dibatalkan sekiranya belum ada PR.
7. Status Perjanjian akan bertukar kepada 'CANCEL'.

---

## 9. Good Receive Note (GRN)

### 9.1 Deskripsi Umum

Dokumen ini memberi tumpuan secara menyeluruh kepada keperluan aplikasi untuk catatan barang yang diterima/Good Receive Note (GRN) di MAIPs. Hanya pegawai/pengguna yang bertanggungjawab menguruskan catatan barang yang diterima/Good Receive Note (GRN) dibenarkan untuk menggunakan aplikasi ini.

### 9.2 Kaedah/Prosedur

#### 9.2.1 Log Masuk

- Skrin 5.2 14 Log Masuk
1. Masukkan ID Pengguna pada Username.
2. Masukkan Kata Laluan pada Password.
3. Klik untuk masuk sistem.

#### 9.2.2 Paparan Utama / Main Dashboard

- Skrin 3.2 15.1 Papan Utama/Main Dashboard

Sistem akan memaparkan Skrin Papan Utama (Main Dashboard) setelah Pengguna Berjaya untuk log masuk.

1. Di skrin Papan Utama (Main Dashboard) sistem akan memaparkan Rumusan Tugasan (Task Summary) berdasarkan pengguna yang log masuk ke dalam sistem.
2. Pergi kepada menu di sebelah kiri skrin.
3. Klik menu **Purchasing / Good Receive Note**:
   - Skrin 5.2 2.2 Menu

#### 9.2.3 Rekodkan catatan barang yang diterima / Good Receive Note (GRN)

1. Pilih menu Purchasing / Good Receive Note dan klik **Good Receive Note List**. Semua Good Receive Note akan dipaparkan pada skrin (jika ada).
2. Klik pada butang **New** untuk memasukan data baru. Skrin untuk memasukan Good Receive Note akan dipaparkan.
3. Lengkapkan, masukan jumlah barang diterima (Quantity Receive). Medan yang bertanda * adalah wajib diisi.
4. Tekan save bila selesai.
5. Penerima tugasan seterusnya (Next Receiver) tidak perlu diisi.
6. Seterusnya untuk simpan Good Receive Note sebagai draft tekan butang save. Maklumat Good Receive Note akan disimpan sebagai draft. Kemudian boleh kemaskini dan submit.
7. Sekiranya ingin terus submit boleh tekan butang **save & submit**.
8. GRN akan disahkan dengan sertamerta.

#### 9.2.4 Cetak/Download catatan barang yang diterima / Good Receive Note (GRN)

1. Pilih menu Purchasing / Good Receive Note dan klik Good Receive Note List. Semua Good Receive Note akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari. Boleh gunakan wildcard '%' antara keyword: Contoh: `geran%khas`
5. Boleh search menggunakan Smartfilter untuk carian lebih tepat. Pilih parameter carian dan kemudian tekan butang OK. Setelah selesai carian smartFilter, perlu reset dan klik OK untuk kembali ke skrin asal.
6. Klik pada ikon **print** untuk download GRN yang dipilih.
7. Boleh cetak dalam format csv. Click pada butang 'Download CSV' untuk mencetak senarai dalam format excel (.csv).
8. Senarai data yang dipaparkan pada listing di skrin akan didownload ke dalam format csv.
9. Buka file .csv yang telah dimuatturun dan akan dipaparkan seperti berikut.
10. Boleh juga cetak dalam format pdf. Click pada butang 'Download PDF' untuk mencetak senarai dalam format pdf.

#### 9.2.5 Pembatalan catatan barang yang diterima / Good Receive Note (GRN)

1. Pilih menu Purchasing / Good Receive Note dan klik **Good Receive Note Cancel**. Semua Good Receive Note yang boleh dibatal akan dipaparkan pada skrin.
2. Thick pada checkbox untuk memilih GRN yang ingin di cancel. Boleh pilih lebih dari satu.
3. Kemudian klik butang **GRN Cancel**. GRN tersebut akan ditukar status kepada CANCEL.

---

## 10. Catatan Kerja Dijalankan / Work Progress Note (WPN)

### 10.1 Deskripsi Umum

Dokumen ini memberi tumpuan secara menyeluruh kepada keperluan aplikasi untuk catatan kerja dijalankan/Work Progress Note (WPN) di MAIPs. Hanya pegawai/pengguna yang bertanggungjawab menguruskan catatan kerja dijalankan/Work Progress Note (WPN) dibenarkan untuk menggunakan aplikasi ini.

### 10.2 Kaedah/Prosedur

#### 10.2.1 Log Masuk

- Skrin 5.2 16 Log Masuk
1. Masukkan ID Pengguna pada Username.
2. Masukkan Kata Laluan pada Password.
3. Klik untuk masuk sistem.

#### 10.2.2 Papan Utama / Main Dashboard

- Skrin 3.2 17.1 Papan Utama/Main Dashboard

Sistem akan memaparkan Skrin Papan Utama (Main Dashboard) setelah Pengguna Berjaya untuk log masuk.

1. Di skrin Papan Utama (Main Dashboard) sistem akan memaparkan Rumusan Tugasan (Task Summary) berdasarkan pengguna yang log masuk ke dalam sistem.
2. Pergi kepada menu di sebelah kiri skrin.
3. Klik menu **Purchasing / Work Progress Note**:
   - Skrin 6.2 2.2 Menu

#### 10.2.3 Rekodkan catatan kerja dijalankan / Work Progress Note (WPN)

1. Pilih menu Purchasing / Work Progress Note dan klik **Work Progress Note List**. Semua Work Progress Note akan dipaparkan pada skrin (Jika ada).
2. Klik pada butang **New** untuk memasukan data baru. Skrin untuk memasukan Work Progress Note akan dipaparkan.
3. Lengkapkan dan masukan Amount Receive jika kurang dari jumlah asal. Medan yang bertanda * adalah wajib diisi.
4. Tekan save bila selesai.
5. Penerima tugasan seterusnya (Next Receiver) tidak perlu diisi.
6. Seterusnya untuk submit Work Progress Note boleh tekan butang save. Maklumat Work Progress Note akan disahkan dengan sertamerta.

#### 10.2.4 Cetak/download catatan kerja dijalankan / Work Progress Note (WPN)

1. Pilih menu Purchasing / Work Progress Note dan klik Work Progress Note List. Semua Work Progress Note akan dipaparkan pada skrin.
2. Paparan senarai boleh di sisih (sort) mengikut column. Klik pada ikon pada sebelah kiri nama column untuk sisih.
3. Data akan dipaparkan by paging jika terdapat lebih dari 5 data.
4. Boleh search menggunakan keyword. Klik search - Masukkan sekurang-kurangnya 3 huruf/digit dari keyword yang ingin dicari. Boleh gunakan wildcard '%' antara keyword.
5. Boleh search menggunakan Smartfilter untuk carian lebih tepat. Pilih parameter carian dan kemudian tekan butang OK. Setelah selesai carian smartFilter, perlu reset dan klik OK untuk kembali ke skrin asal.
6. Klik pada ikon **print** untuk download WPN yang dipilih.
7. Boleh cetak dalam format csv. Click pada butang 'Download CSV' untuk mencetak senarai dalam format excel (.csv).
8. Senarai data yang dipaparkan pada listing di skrin akan didownload ke dalam format csv.
9. Buka file .csv yang telah dimuatturun dan akan dipaparkan seperti berikut.
10. Boleh juga cetak dalam format pdf. Click pada butang 'Download PDF' untuk mencetak senarai dalam format pdf.

#### 10.2.5 Pembatalan catatan kerja dijalankan / Work Progress Note (WPN)

1. Pilih menu Purchasing / Work Progress Note dan klik **Work Progress Note Cancel**. Semua Work Progress Note yang boleh dibatal akan dipaparkan pada skrin.
2. Thick pada checkbox untuk memilih WPN yang ingin di cancel. Boleh pilih lebih dari satu.
3. Kemudian klik butang **WPN Cancel**. WPN tersebut akan ditukar status kepada CANCEL.

---

## 11. Vendor Assessment

### 11.1 Deskripsi Umum

Dokumen ini memberi tumpuan secara menyeluruh kepada keperluan aplikasi dalam menguruskan Sistem Kewangan MyFIS2.0 di MAIPs bagi penilaian vendor.

### 11.2 Kaedah/Prosedur

#### 11.2.1 Log Masuk

- Skrin 3.0 1 Log Masuk
1. Masukkan ID Pengguna pada Username.
2. Masukkan Kata Laluan pada Password.
3. Klik untuk masuk sistem.

#### 11.2.2 Papan Utama / Main Dashboard

- Skrin 3.0 2 Papan Utama/Main Dashboard

Sistem akan memaparkan Skrin Papan Utama (Main Dashboard) setelah Pengguna Berjaya untuk log masuk.

1. Di skrin Papan Utama (Main Dashboard) sistem akan memaparkan Senarai Tugasan Khusus (To Do Task) berdasarkan pengguna yang log masuk ke dalam sistem.
2. Pergi ke menu pada sebelah kiri skrin.
3. Klik Purchasing dan klik **Vendor Assessment**:
   - Skrin 3.0 3 Menu

#### 11.2.3 Hantar Penilaian Pembekal/submit Vendor Assessment dari catatan barang yang diterima / Good Receive Note (GRN)

1. Pilih menu Purchasing / Vendor Assessment dan klik **Good Receive Note**. Semua GRN yang masih belum dibuat assessment akan dipaparkan pada skrin bahagian atas manakala dibahagian bawah akan disenaraikan GRN yang telah ada assessment.
2. Klik pada ikon tambah untuk memasukan assessment/penilaian. Skrin untuk memasukan Penilaian akan dipaparkan.
3. Lengkapkan dan tekan save bila selesai.
4. Penilaian akan dihantar kepada To Do Task pelulus untuk kelulusan.

#### 11.2.4 Hantar Penilaian Pembekal/submit Vendor Assessment dari catatan kerja dijalankan / Work Progress Note (WPN)

1. Pilih menu Purchasing / Vendor Assessment dan klik **Work Progress Note**. Semua WPN yang masih belum dibuat assessment akan dipaparkan pada skrin bahagian atas manakala dibahagian bawah akan disenaraikan WPN yang telah ada assessment.
2. Klik pada ikon tambah untuk memasukan assessment/penilaian. Skrin untuk memasukan Penilaian akan dipaparkan.
3. Lengkapkan penilaian dan tekan save bila selesai.
4. Penilaian akan dihantar kepada To Do Task pelulus untuk kelulusan.

#### 11.2.5 Pengesahan Penilaian Pembekal/Vendor Assessment

1. Pegawai (Pelulus) akan login masuk menggunakan Login ID masing-masing. Untuk login masuk ke MyFIS2.0 rujuk bahagian 8.2.1 di atas.
2. Pada Papan Utama (Main Dashboard) akan dipaparkan Senarai Tugasan/Task Summary setiap pengguna yang Login masuk.
3. Pilih kumpulan Tugasan Vendor. Tugasan akan disenaraikan.
4. Gerakkan mouse ke Title dan klik untuk lihat paparan skrin. Maklumat Vendor Assessment akan dipaparkan.
5. Masukan markah Penilaian dan catatan (Evaluation Note).
6. Kemudian Masukkan keputusan kelulusan sama ada Lulus (Approved) atau ditolak (Rejected). Jika sekiranya ditolak (Rejected) perlu isi catatan pada ruangan Remarks.
7. Dan klik.
8. Skrin akan refresh ke skrin Papan Utama/Main Dashboard.

#### 11.2.6 Cetak Penilaian Pembekal/Vendor Assessment dari GRN

1. Pilih menu Purchasing / Vendor Assessment dan klik Good Receive Note. Semua GRN yang masih belum dibuat assessment akan dipaparkan pada skrin bahagian atas manakala dibahagian bawah akan disenaraikan GRN yang telah ada assessment.
2. Klik pada ikon **print** pada assessment/penilaian yang ingin dicetak. Penilaian akan dipaparkan dalam format pdf.

#### 11.2.7 Cetak Penilaian Pembekal/Vendor Assessment dari WPN

1. Pilih menu Purchasing / Vendor Assessment dan klik Work Progress Note. Semua WPN yang masih belum dibuat assessment akan dipaparkan pada skrin bahagian atas manakala dibahagian bawah akan disenaraikan WPN yang telah ada assessment.
2. Klik pada ikon **print** pada assessment/penilaian yang ingin dicetak. Penilaian akan dipaparkan dalam format pdf.

#### 11.2.8 Laporan Penilaian Pembekal/Vendor Assessment dari GRN

1. Pilih menu Purchasing / Report dan klik **Report Vendor Assessment (GRN)**.
2. Masukan parameter.
3. Click pada butang 'Download EXCEL' untuk mencetak senarai dalam format excel (.csv).
4. Senarai data yang dipaparkan pada listing di skrin akan didownload ke dalam format csv.
5. Buka file .csv yang telah dimuatturun dan akan dipaparkan seperti berikut.
6. Boleh juga cetak dalam format pdf. Click pada butang 'Download PDF' untuk mencetak senarai dalam format pdf.

#### 11.2.9 Laporan Penilaian Pembekal/Vendor Assessment dari WPN

1. Pilih menu Purchasing / Report dan klik **Report Vendor Assessment (WPN)**.
2. Masukan parameter.
3. Click pada butang 'Download EXCEL' untuk mencetak senarai dalam format excel (.csv).
4. Senarai data yang dipaparkan pada listing di skrin akan didownload ke dalam format csv.
5. Buka file .csv yang telah dimuatturun dan akan dipaparkan seperti berikut.
6. Boleh juga cetak dalam format pdf. Click pada butang 'Download PDF' untuk mencetak senarai dalam format pdf.

---

## 12. PO Closing

### 12.1 Deskripsi Umum

Dokumen ini memberi tumpuan secara menyeluruh kepada keperluan aplikasi dalam menguruskan Sistem Kewangan MyFIS2.0 di MAIPs bagi PO Closing.

### 12.2 Kaedah/Prosedur

#### 12.2.1 Log Masuk

- Skrin 3.0 4 Log Masuk
1. Masukkan ID Pengguna pada Username.
2. Masukkan Kata Laluan pada Password.
3. Klik untuk masuk sistem.

#### 12.2.2 Papan Utama / Main Dashboard

- Skrin 3.0 5 Papan Utama/Main Dashboard

Sistem akan memaparkan Skrin Papan Utama (Main Dashboard) setelah Pengguna Berjaya untuk log masuk.

1. Di skrin Papan Utama (Main Dashboard) sistem akan memaparkan Senarai Tugasan Khusus (To Do Task) berdasarkan pengguna yang log masuk ke dalam sistem.
2. Pergi ke menu pada sebelah kiri skrin.
3. Klik **Purchasing / Purchase Order** dan klik **Closing**.

#### 12.2.3 Initiate PO Closing

1. Pilih menu Purchasing / Purchase Order / Closing dan klik **Process Closing**.
2. Initiate PO Closing by clicking button PO Closing on the screen.
3. Klik pada butang **Download CSV** untuk muat turun senarai PO dari tahun lepas yang telah dikenalpasti untuk ditutup.

#### 12.2.4 Semak dan sahkan penutupan PO

1. Pilih menu Purchasing / Purchase Order / Closing dan klik **PO Confirmation Process**.
2. Select the fund and click Search.
3. Review the list of PO to be closed list on the screen. Klik pada icon edit untuk menukar budget code.
4. Klik pada butang **Download CSV** untuk muat turun senarai ke dalam format csv.
5. Semak dan jika semua boleh dibawa ke tahun semasa tekan butang **Confirm Process** untuk pengesahan.

#### 12.2.5 Paparkan senarai PO yang telah ditutup

1. Pilih menu Purchasing / Purchase Order / Closing dan klik **PO Confirmation Process List**.
2. Senarai PO yang telah ditutup akan disenaraikan.
3. Dan butang Download CSV untuk memuat turun senarai.

---

*Dokumen ini merupakan panduan pengguna untuk modul Perolehan dalam Sistem Kewangan SPMMPs (KERISI SAGA) Version 1.0.*
