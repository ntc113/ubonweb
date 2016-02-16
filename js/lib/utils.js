/*!
 * ubon v1.0
 @author: duynt.catcom
 */


function templateUrl (tplName) {
  return 'templates/' + tplName + '.html';
}

function onContentLoaded (cb) {
  setTimeout(cb, 0);
};

function encodeEntities(value) {
  return value.
    replace(/&/g, '&amp;').
    replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function (value) {
      var hi = value.charCodeAt(0);
      var low = value.charCodeAt(1);
      return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';';
    }).
    replace(/([^\#-~| |!])/g, function (value) { // non-alphanumeric
      return '&#' + value.charCodeAt(0) + ';';
    }).
    replace(/</g, '&lt;').
    replace(/>/g, '&gt;');
}

function calcImageInBox(imageW, imageH, boxW, boxH, noZooom) {
  var boxedImageW = boxW;
  var boxedImageH = boxH;

  if ((imageW / imageH) > (boxW / boxH)) {
    boxedImageH = parseInt(imageH * boxW / imageW);
  }
  else {
    boxedImageW = parseInt(imageW * boxH / imageH);
    if (boxedImageW > boxW) {
      boxedImageH = parseInt(boxedImageH * boxW / boxedImageW);
      boxedImageW = boxW;
    }
  }

  // if (Config.Navigator.retina) {
  //   imageW = Math.floor(imageW / 2);
  //   imageH = Math.floor(imageH / 2);
  // }

  if (noZooom && boxedImageW >= imageW && boxedImageH >= imageH) {
    boxedImageW = imageW;
    boxedImageH = imageH;
  }

  return {w: boxedImageW, h: boxedImageH};
}

function versionCompare (ver1, ver2) {
  if (typeof ver1 !== 'string') {
    ver1 = '';
  }
  if (typeof ver2 !== 'string') {
    ver2 = '';
  }
  ver1 = ver1.replace(/^\s+|\s+$/g, '').split('.');
  ver2 = ver2.replace(/^\s+|\s+$/g, '').split('.');

  var a = Math.max(ver1.length, ver2.length), i;

  for (i = 0; i < a; i++) {
    if (ver1[i] == ver2[i]) {
      continue;
    }
    if (ver1[i] > ver2[i]) {
      return 1;
    } else {
      return -1;
    }
  }

  return 0;
}


(function (global) {

  var badCharsRe = /[`~!@#$%^&*()\-_=+\[\]\\|{}'";:\/?.>,<\s]+/g,
      trimRe = /^\s+|\s$/g;

  function createIndex () {
    return {
      shortIndexes: {},
      fullTexts: {}
    }
  }

  function cleanSearchText (text) {
    var hasTag = text.charAt(0) == '%';
    text = text.replace(badCharsRe, ' ').replace(trimRe, '');
    text = text.replace(/[^A-Za-z0-9]/g, function (ch) {
      return Config.LatinizeMap[ch] || ch;
    });
    text = text.toLowerCase();
    if (hasTag) {
      text = '%' + text;
    }

    return text;
  }

  function cleanUsername (username) {
    return username && username.toLowerCase() || '';
  }

  function indexObject (id, searchText, searchIndex) {
    if (searchIndex.fullTexts[id] !== undefined) {
      return false;
    }

    searchText = cleanSearchText(searchText);

    if (!searchText.length) {
      return false;
    }

    var shortIndexes = searchIndex.shortIndexes;

    searchIndex.fullTexts[id] = searchText;

    angular.forEach(searchText.split(' '), function(searchWord) {
      var len = Math.min(searchWord.length, 3),
          wordPart, i;
      for (i = 1; i <= len; i++) {
        wordPart = searchWord.substr(0, i);
        if (shortIndexes[wordPart] === undefined) {
          shortIndexes[wordPart] = [id];
        } else {
          shortIndexes[wordPart].push(id);
        }
      }
    });
  }

  function search (query, searchIndex) {
    var shortIndexes = searchIndex.shortIndexes,
        fullTexts = searchIndex.fullTexts;

    query = cleanSearchText(query);

    var queryWords = query.split(' '),
        foundObjs = false,
        newFoundObjs, i, j, searchText, found;

    for (i = 0; i < queryWords.length; i++) {
      newFoundObjs = shortIndexes[queryWords[i].substr(0, 3)];
      if (!newFoundObjs) {
        foundObjs = [];
        break;
      }
      if (foundObjs === false || foundObjs.length > newFoundObjs.length) {
        foundObjs = newFoundObjs;
      }
    }

    newFoundObjs = {};

    for (j = 0; j < foundObjs.length; j++) {
      found = true;
      searchText = fullTexts[foundObjs[j]];
      for (i = 0; i < queryWords.length; i++) {
        if (searchText.indexOf(queryWords[i]) == -1) {
          found = false;
          break;
        }
      }
      if (found) {
        newFoundObjs[foundObjs[j]] = true;
      }
    }

    return newFoundObjs;
  }

  global.SearchIndexManager = {
    createIndex: createIndex,
    indexObject: indexObject,
    cleanSearchText: cleanSearchText,
    cleanUsername: cleanUsername,
    search: search
  };

})(window);
