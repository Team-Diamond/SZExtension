import React from 'react';
import {render} from 'react-dom';
import {root} from './models/root'
import Container from './components/container';
import $ from 'jquery';

process.env.NODE_ENV === 'production'
const anchor = document.createElement('div');
anchor.id = 'container-anchor';

document.body.insertBefore(anchor, document.body.childNodes[0]);
root.mainJson = parsePageJson(document.body, null);

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

    let getElements = function (response) {
        let pageJson = response.parse;
        let htmlEl = getHTMLFromJson(pageJson);
        pageJson = parsePageJson(htmlEl, pageJson.title);
        console.log("pageJson", pageJson);
    }
}

function showCard(link) {
    let pageJson = parse(link);
}

let i = 0, l = hyperlinks.length;
for (; i < l; i++) {
    const link = hyperlinks[i].href;
    hyperlinks[i].addEventListener('click', function () {
        showCard(link)
    });
    hyperlinks[i].href = '#';
}


/**
 * Create Dummy HTML element for parsing purpose
 * @param  {[JSON]} wikiJson      [JSON data get from mediaWiki API]
 * @return {[DOM element]}        [DOM ]
 */
function getHTMLFromJson(wikiJson) {
  let wikiHTML = document.createElement('html');
  wikiHTML.innerHTML = wikiJson.text["*"];

  return wikiHTML
}

/**
 * get section elements json by type of the elements
 * note: this function need to import jquery to work
 * 
 * @param  {[type]} startEl [description]
 * @param  {[type]} endEl   [description]
 * @param  {[type]} type    [description]
 * @return {[type]}         [description]
 */
function getSectionElementsByType(startEl, endEl, type) {
  return $(startEl).nextUntil(endEl, type).toArray();
}

function getLastSectionElementsByType(el, type) {
  return $(el).nextAll(type).toArray();
}


/**
 * Break down the Dom elements into sections
 * @param  {[type]} htmlEl [description]
 * @param  {[type]} level  [description]
 * @return {[type]}        [description]
 */
function getSectionHTMLElement(htmlEl, level) {
  let hLevel = "H" + level;
  let sections = htmlEl.getElementsByClassName("mw-headline");
  sections = Array.prototype.slice.call(sections, 0);

  return sections.map(e => e.parentNode)
                 .filter(e => e.tagName === hLevel);
}

function parsePageJson(htmlEl, title) {
  let pageJson = {};

  //FIXIT
  pageJson["title"] = title ? title : document.getElementById("firstHeading").innerText;
  pageJson["content_HTML"] = [];
  pageJson["subsections"] = [];

  let sections = getSectionHTMLElement(htmlEl, 2);

  let paraList = getSectionElementsByType(document.getElementsByClassName("mw-parser-output")[0].firstChild
                                          , sections[0], "p");
  paraList.map(p => {
      pageJson["content_HTML"].push(parseParagraph(p));
    });

  if (sections.length > 0) {
    for (let i = 0; i < sections.length - 1; i++) {
      pageJson["subsections"].push(parseSections(sections[i], sections[i+1], 2, null, i+1));
    }

    pageJson["subsections"].push(parseLastSection(sections[sections.length - 1], 2, null, sections.length));
  }

  return pageJson;
}

function parseMainContent(startEl, endEl) {
  let paraList = getSectionElementsByType(startEl, endEl, "p");

}

function parseSections(startEl, endEl, level, numPrefix, num) {
  let sectionJson = {};
  level++;
  let subSections = getSectionElementsByType(startEl, endEl, "h"+level);

  sectionJson["title"] = startEl.firstChild.innerText;
  sectionJson["content_HTML"] = [];
  sectionJson["subsections"] = [];
  sectionJson["outline_number"] = numPrefix ? (numPrefix + '.' + num) : num;

  if (subSections.length > 0) {
    let paraList = getSectionElementsByType(startEl, subSections[0], "p");
    let imageList = getSectionElementsByType(startEl, subSections[0], "div.thumb");

    imageList.map(t => {
      sectionJson["content_HTML"].push(parseImage(t));
    })

    paraList.map(p => {
      sectionJson["content_HTML"].push(parseParagraph(p));
    });

    for (let i = 0; i < subSections.length - 1; i++) {
      sectionJson["subsections"].push(
        parseSections(subSections[i], subSections[i+1], level, sectionJson["outline_number"], i + 1)
      );
    }

    sectionJson["subsections"].push(
      parseSections(subSections[subSections.length - 1], endEl, level, sectionJson["outline_number"], subSections.length)
    );
  }
  else {
    let paraList = getSectionElementsByType(startEl, endEl, "p");
    let imageList = getSectionElementsByType(startEl, endEl, "div.thumb");

    imageList.map(t => {
      sectionJson["content_HTML"].push(parseImage(t));
    });
    
    paraList.map(p => {
      sectionJson["content_HTML"].push(parseParagraph(p));
    });
  }

  return sectionJson;
}

function parseImage(thumb) {
  let imgJson = {};

  imgJson["tagName"] = "img";
  imgJson["className"] = "image";

  imgJson["attributes"] = {"src": "https:" + thumb.getElementsByTagName("img")[0].getAttribute("src")};
  return imgJson;
}

function parseLastSection(el, level) {
  let sectionJson = {};

  sectionJson["title"] = el.firstChild.innerText;
  sectionJson["content_HTML"] = [];
  sectionJson["subsections"] = [];

  let paraList = getLastSectionElementsByType(el, "p");
  paraList.map(p => {
    sectionJson["content_HTML"].push(parseParagraph(p));
  });

  level++;
  let subSections = getLastSectionElementsByType(el, "h"+level);

  if (subSections.length > 0) {
    for (let i = 0; i < subSections.length - 1; i++) {
      sectionJson["subsections"].push(parseSections(subSections[i], subSections[i+1], level));
    }

    parseLastSection(subSections[subSections.length - 1]);
  }

  return sectionJson;
}

function parseParagraph(p) {
  let anchorList = p.getElementsByTagName("a");
  anchorList = Array.prototype.slice.call(anchorList, 0);
  let paraJson = {};

  paraJson["tagName"] = "p";
  paraJson["className"] = "paragraph";
  paraJson["attributes"] = [];
  paraJson["children"] = [];

  if (anchorList.length > 0) {
    anchorList.map(a => {
      if (a.parentElement === p) {
        if (a.previousSibling) {
            console.log("previous sibling", a.previousSibling);
            console.log("previous sibling text", a.previousSibling.textContent)
            paraJson["children"].push(a.previousSibling.textContent);
        }
        paraJson["children"].push(parseAnchor(a));
      }
      else {
        if (a.parentElement.className != "reference") {
          if (a.parentElement.previousSibling) {
            console.log("previous sibling", a.parentElement.previousSibling);
            console.log("previous sibling text", a.parentElement.previousSibling.textContent)
            paraJson["children"].push(a.parentElement.previousSibling.textContent);
          }
          paraJson["children"].push(parseAnchor(a));
        }
      }
    });

    if (anchorList[anchorList.length - 1].nextSibling) {
      if (anchorList[anchorList.length - 1].nextSibling) {
        paraJson["children"].push(anchorList[anchorList.length - 1].nextSibling.textContent);
      }
    }
  }
  else {
    paraJson["children"].push(p.innerText);
  }

  return paraJson;
}

function parseAnchor(a) {
  let anchorJson = {};

  anchorJson["tagName"] = "a";
  anchorJson["className"] = "link";
  anchorJson["attributes"] = {};
  anchorJson["children"] = [];

  let attrNames = a.getAttributeNames();
  attrNames.map(name => {
    anchorJson["attributes"][name] = a.getAttribute(name);
  })

  anchorJson["children"].push(a.innerText);
  return anchorJson;
}
