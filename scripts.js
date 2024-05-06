function getCurrentDateTimeString() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    };
    return now.toLocaleString('id-ID', options);
}

document.getElementById('creationDate').querySelector('strong').textContent = getCurrentDateTimeString();

let dataBarang = [];

function findProduct() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = ''; 

    if (searchInput.trim() === '') {
        return; 
    }

    const filteredItems = dataBarang.filter(item => item['Nama Barang'].toLowerCase().includes(searchInput));

    filteredItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.textContent = item['Nama Barang'];
        itemDiv.classList.add('searchResultItem');
        itemDiv.addEventListener('click', () => {
            addProductToTable(item); 
            document.getElementById('searchInput').value = ''; 
            resultContainer.innerHTML = ''; 
        });

        resultContainer.appendChild(itemDiv);
    });
}

document.getElementById('searchInput').addEventListener('input', findProduct);

function deleteProduct(kodeBarang) {
    const entryTable = document.getElementById('entryTable').getElementsByTagName('tbody')[0];
    const rows = entryTable.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const kodeBarangCell = rows[i].getElementsByTagName('td')[1]; // Kolom Kode Barang
        if (kodeBarangCell && kodeBarangCell.textContent.trim() === kodeBarang) {
            entryTable.deleteRow(i);
            break; 
        }
    }
}

function addProductToTable(barang) {
    const entryTable = document.getElementById('entryTable').getElementsByTagName('tbody')[0];
    const kodeBarang = barang['Kode Barang'];

    if (isBarangAlreadyAdded(kodeBarang)) {
        alert('Barang sudah ditambahkan!');
        return; 
    }

    const newRow = entryTable.insertRow();

    newRow.innerHTML = `
        <td>${barang['Nama Barang']}</td>
        <td>${kodeBarang}</td>
        <td><input type="number" class="form-control" id="stokSekarang_${kodeBarang}" value="${barang['Stok']}"></td>
        <td>
            <select class="form-control">
                <option value="RTG">RTG</option>
                <option value="BKS">BKS</option>
                <option value="PAK">PAK</option>
                <option value="PCS">PCS</option>
                <option value="KLG">KLG</option>
                <option value="KG">KG</option>
                <option value="LMBR">LMBR</option>
                <option value="BOX">BOX</option>
                <option value="DUS">DUS</option>
                <option value="BTL">BTL</option>
                <option value="TPLS">TPLS</option>
                <option value="LSN">LSN</option>
                <option value="BTO">BTO</option>
                <option value="BAL">BAL</option>
                <option value="IKT">IKT</option>
                <option value="KTK">KTK</option>
                <option value="GROS">GROS</option>
                <option value="BOS">BOS</option>
                <option value="SAK">SAK</option>
                <option value="GALON">GALON</option>
                <option value="SLOP">SLOP</option>
            </select>
        </td>
        <td><input type="number" class="form-control" id="permintaanStok_${kodeBarang}" value="0"></td>
        <td>
            <button class="btn btn-danger" onclick="deleteProduct('${kodeBarang}')">
                <i class="fas fa-trash-alt"></i> Delete
            </button>
        </td>
    `;

    const inputStok = newRow.querySelector(`#stokSekarang_${kodeBarang}`);
    inputStok.removeAttribute('readonly');
}

function isBarangAlreadyAdded(kodeBarang) {
    const entryTable = document.getElementById('entryTable').getElementsByTagName('tbody')[0];
    const rows = entryTable.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const kodeBarangCell = rows[i].getElementsByTagName('td')[1]; // Kolom Kode Barang
        if (kodeBarangCell && kodeBarangCell.textContent.trim() === kodeBarang) {
            return true;
        }
    }

    return false;
}

window.onload = function() {
    fetch('barang.json')
        .then(response => response.json())
        .then(data => {
            dataBarang = data; 
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
};

function sendToWhatsApp() {
    const entryTable = document.getElementById('entryTable').getElementsByTagName('tbody')[0];
    const rows = entryTable.getElementsByTagName('tr');
    let message = `Permintaan Stok Barang Barokah 2 (Tanggal Pembuatan: ${document.querySelector('#creationDate strong').textContent}):\n`;

    for (let i = 0; i < rows.length; i++) {
        const columns = rows[i].getElementsByTagName('td');
        const namaBarang = columns[0].textContent;
        const kodeBarang = columns[1].textContent;
        const stokBarang = columns[2].querySelector('input').value;
        const satuan = columns[3].querySelector('select').value;
        const permintaanStok = columns[4].querySelector('input').value;

        message += `
Nama Barang: ${namaBarang}
Kode Barang: ${kodeBarang}
Stok Barang Sekaarang: ${stokBarang} ${satuan}
Permintaan Stok: ${permintaanStok}
`;
    }

    const whatsappMessage = encodeURIComponent(message);

    window.open(`https://wa.me/?text=${whatsappMessage}`);
}

document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.querySelector('.btn-save');
    if (saveButton) {
        saveButton.addEventListener('click', sendToWhatsApp);
    }
});
