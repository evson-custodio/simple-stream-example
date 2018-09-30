function StreamService(uri) {
    this.uri = uri;
    this.post = (filename, data) => {
        return fetch(this.uri, {
            headers: {
                'Content-type': 'application/octet-stream',
                'filename': filename
            },
            method: 'post',
            body: data
        })
        .then(res => res.json());
    }
    this.get = (param) => {
        return fetch(this.uri + (param ? (this.uri.endsWith('/') ? param : '/' + param): ''));
    }
    this.delete = () => {
        return fetch(this.uri, {
            method: 'delete'
        });
    }
}