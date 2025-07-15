function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // Check whether the URI is missing a file name.
    if (uri.endsWith('/')) {
        console.log('Redirected '+uri+' as end folder')
        request.uri += 'index.html';
    }

    return request;
}
