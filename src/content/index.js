import React from 'react';
import {render} from 'react-dom';
import Container from './components/container';
import $ from 'jquery';

const anchor = document.createElement('div');
anchor.id = 'container-anchor';

document.body.insertBefore(anchor, document.body.childNodes[0]);

render(<Container />, document.getElementById('container-anchor'));

if (module.hot) {
    module.hot.accept();
}

const hyperlinks = document.getElementsByTagName('a');

function parse(link) {
    const arr = link.split('/');
    const pageTitle = arr[arr.length - 1];
    console.log(pageTitle);

    const url = "https://en.wikipedia.org/w/api.php?action=parse&page=" + pageTitle + "&prop=text&format=json";
    let request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let response = JSON.parse(this.responseText);
            getElements(response);
        }
    };

    request.open("GET", url, true);
    request.send();
    $('h1').click(alert('yes'));

    let getElements = function (response) {
        console.log(response.parse.text);
        return parse.text;
    }
}

function showCard(link) {
    parse(link);
}

let i = 0, l = hyperlinks.length;
for (; i < l; i++) {
    const link = hyperlinks[i].href;
    hyperlinks[i].addEventListener('click', function () {
        showCard(link)
    });
    hyperlinks[i].href = '#';
}

