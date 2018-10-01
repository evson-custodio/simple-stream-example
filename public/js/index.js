const message = document.querySelector('#message');
const input = document.querySelector('#file');
const send = document.querySelector('#send');
const filenameOrId = document.querySelector('#filenameOrId');
const search = document.querySelector('#search');
const tbody = document.querySelector('#tbody');
const image = document.querySelector('#image');

let file = null;
let blob = null;
let stream = new StreamService('/api/file');

input.addEventListener('change', chooseFile);
send.addEventListener('click', sendFile);
search.addEventListener('click', searchFile);

function chooseFile(event) {
    file = event.target.files[0];

    let reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadstart = () => {
        send.setAttribute('disabled', 'disabled');
    }

    reader.error = () => {
        message.textContent = 'Error reading file!'
    }

    reader.onload = () => {
        blob = new Blob([reader.result], {type: 'application/octet-stream'});
        send.removeAttribute('disabled');
    }
}

function sendFile() {
    // The file.name must respect the following RegEx: [\\wáéíóúâêîôûãõàèìòùüç%_.]+.(png|jpg|jpeg)
    stream.post(file.name, blob)
    .then(() => {
        listFiles();
    })
    .catch(() => {
        message.textContent = 'Error sending file!'
    });
}

function searchFile() {
    stream.get(filenameOrId.value)
    .then(res => res.blob())
    .then(blob => {
        image.innerHTML = '<img src="' + URL.createObjectURL(blob) + '" alt="' + filenameOrId.value + '" />';
        // image.src = URL.createObjectURL(blob);
    })
    .catch(() => {
        message.textContent = 'File ' + filenameOrId.textContent + ' not found!';
    });
}

function listFiles() {
    stream.get()
    .then(res => res.json())
    .then(files => {
        tbody.innerHTML = '';
        files.forEach(f => {
            let row = document.createElement('tr');
            let id = document.createElement('td');
            let filename = document.createElement('td');
            let length = document.createElement('td');

            id.textContent = f._id;
            filename.textContent = f.filename;
            length.textContent = f.length;

            row.appendChild(id);
            row.appendChild(filename);
            row.appendChild(length);

            tbody.appendChild(row);
        });
    })
    .catch(() => {
        message.textContent = 'Error listing files!';
    });
}

listFiles();