import React from 'react';
import {render} from 'react-dom';
import Container from './components/container';
import parser from './components/parser';

const anchor = document.createElement('div');
anchor.id = 'container-anchor';

document.body.insertBefore(anchor, document.body.childNodes[0]);

render(<Container />, document.getElementById('container-anchor'));

if (module.hot) {
    module.hot.accept();
}

const hyperlinks = document.getElementsByTagName('a');
//
// function parse(link) {
//     const arr = link.split('/');
//     const pageTitle = arr[arr.length - 1];
//     console.log(pageTitle);
//
//     const url = "https://en.wikipedia.org/w/api.php?action=query&titles=" +
//         pageTitle + "&prop=revisions&rvprop=content&format=json";
//
//     let result;
//     fetch(url)
//         .then(response => {
//             if (response.ok) {
//                 return response.json();
//             } else {
//                 throw new Error('Something went wrong ...');
//             }
//         })
//         .then(data => this.setState({ data, isLoading: false }))
//         .catch(error => this.setState({ error, isLoading: false }));
//     alert(result);
//     return "parsed items: " + items;
// }

function showCard(link) {
    parser.parse(link);
}

let i = 0, l = hyperlinks.length;
for (; i < l; i++) {
    const link = hyperlinks[i].href;
    hyperlinks[i].addEventListener('click', function () {
        showCard(link)
    });
    hyperlinks[i].href = '#';
}

