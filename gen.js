const fs = require("fs");
const path = require("path");

var start_version = "1.7.0";
var start_i18n_version = "1.5.2";
const PRES = [
  {
    title: "community-downloads",
    url: "https://github.com/community-oss-browser/oss-browser/releases/download/",
    newUrl:
      "https://github.com/community-oss-browser/oss-browser/releases/download/",
  },
];

var t = [`# All Releases for [ OSS Browser ]\n`];

var vs = [];
var arr = fs.readdirSync("./release-notes");
arr.forEach((n) => {
  var version = n.substring(0, n.length - path.extname(n).length);
  try {
    // Check if this is a community version (contains -community)
    if (version.includes('-community')) {
      // Extract version with community suffix like 1.19.1-community
      version = version.match(/^(\d+\.\d+\.\d+-community)/)[0];
    } else {
      // Extract numeric version like 1.19.1
      version = version.match(/^(\d+\.\d+\.\d+)/)[0];
    }
  } catch (e) {}
  if (vs.indexOf(version) == -1 && compareVersion(version, start_version) <= 0)
    vs.push(version);
});

//sort by version
vs.sort(compareVersion);

PRES.forEach((n) => {
  t.push(`## Download from ${n.title}\n`);

  t.push(`||Windows ia32|Windows x64| Mac(zip) |Linux ia32|Linux x64|Release note|
  |-----|-----|-----|-----|--------|--------|---|`);
  vs.forEach((version) => {
    const url = compareVersion("1.16.0", version) < 0 ? n.url : n.newUrl;
    var str = `|${version}|[Download](${url}${version}/oss-browser-win32-ia32.zip) |[Download](${url}${version}/oss-browser-win32-x64.zip) |  [Download](${url}${version}/oss-browser-darwin-x64.zip) | [Download](${url}${version}/oss-browser-linux-ia32.zip) | [Download](${url}${version}/oss-browser-linux-x64.zip)|`;
    // Handle community version release notes
    if (version.includes('-community')) {
      str += "[" + version + ".md](release-notes/" + version + ".md)|";
    } else if (compareVersion(version, start_i18n_version) >= 0)
      str += "[" + version + ".md](release-notes/" + version + ".md)|";
    else str += "[" + version + ".md](release-notes/" + version + ".en-US.md)|";
    t.push(str);
  });
  t.push("");
});

t.push("");
t.push("[Earlier Releases](earlier-releases.md)");

fs.writeFileSync("./all-releases.md", t.join("\n"));

function compareVersion(a, b) {
  var v1 = a.split(".");
  var v2 = b.split(".");
  for (var i = 0; i < v1.length; i++) {
    if (parseInt(v1[i]) < parseInt(v2[i])) return 1;
    else if (parseInt(v1[i]) > parseInt(v2[i])) return -1;
  }
  return -1;
}