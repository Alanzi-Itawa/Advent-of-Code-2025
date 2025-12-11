function day11a(input) {
  var devices = {};
  var devicesInput = input.split(";");
  for (var i = 0; i < devicesInput.length; i++) {
    var device = devicesInput[i];
    var name = device.split(":")[0];
    var outputs = device.split(" ").slice(1);
    devices[name] = deepCopy(outputs);
  }
  
  var queue = [];
  for (var i = 0; i < devices["you"].length; i++) {
    queue.push(
      {
        "soFar": "you",
        "next": devices["you"][i]
      }
    );
  }
  
  var paths = {};
  while (queue.length > 0) {
    var nextInQueue = queue[0];
    queue = queue.slice(1);
    
    if (nextInQueue.next === "out") {
      paths[nextInQueue.soFar] = true;
      continue;
    }
    
    for (var i = 0; i < devices[nextInQueue.next].length; i++) {
      queue.push(
        {
          "soFar": nextInQueue.soFar + "->" + nextInQueue.next,
          "next": devices[nextInQueue.next][i]
        }
      );
    }
  }
  
  var totalCount = 0;
  for (path in paths) {
    totalCount++;
  }
  console.log(totalCount);
}

function day11b(input) {
  var devices = {};
  var devicesInput = input.split(";");
  for (var i = 0; i < devicesInput.length; i++) {
    var device = devicesInput[i];
    var name = device.split(":")[0];
    var outputs = device.split(" ").slice(1);
    devices[name] = deepCopy(outputs);
  }
  
  var queue = [];
  for (var i = 0; i < devices["svr"].length; i++) {
    queue.push(
      {
        "soFar": "svr",
        "next": devices["svr"][i]
      }
    );
  }
  
  var paths = {};
  var pathsFound = 0;
  while (queue.length > 0) {
    if (queue.length % 1000 === 0) {
      console.log("queue length: " + queue.length + ", paths found so far: " + pathsFound);
    }
    
    var nextInQueue = queue[0];
    queue = queue.slice(1);
    
    if (nextInQueue.next === "out") {
      if (stringContains(nextInQueue.soFar, "->dac") && stringContains(nextInQueue.soFar, "->fft")) {
        //paths[nextInQueue.soFar] = true;
        pathsFound++;
      }
      continue;
    }
    
    for (var i = 0; i < devices[nextInQueue.next].length; i++) {
      queue.push(
        {
          "soFar": nextInQueue.soFar + "->" + nextInQueue.next,
          "next": devices[nextInQueue.next][i]
        }
      );
    }
  }
  
  console.log(pathsFound);
}

function day11b_alt(input, start, end) {
  var devices = {};
  var devicesInput = input.split(";");
  for (var i = 0; i < devicesInput.length; i++) {
    var device = devicesInput[i];
    var name = device.split(":")[0];
    var outputs = device.split(" ").slice(1);
    devices[name] = deepCopy(outputs);
  }
  
  var queue = [];
  for (var i = 0; i < devices[start].length; i++) {
    queue.push(
      {
        "soFar": start,
        "next": devices[start][i]
      }
    );
  }
  
  var paths = {};
  var pathsFound = 0;
  while (queue.length > 0) {
    if (queue.length % 1000 === 0) {
      console.log("queue length: " + queue.length + ", paths found so far: " + pathsFound);
    }
    
    var nextInQueue = queue[0];
    queue = queue.slice(1);
    
    if (nextInQueue.next === end) {
      //if (stringContains(nextInQueue.soFar, "->dac") && stringContains(nextInQueue.soFar, "->fft")) {
        //paths[nextInQueue.soFar] = true;
        pathsFound++;
      //}
      continue;
    }
    if (nextInQueue.next === "out") {
      continue;
    }
    
    for (var i = 0; i < devices[nextInQueue.next].length; i++) {
      queue.push(
        {
          "soFar": nextInQueue.soFar + "->" + nextInQueue.next,
          "next": devices[nextInQueue.next][i]
        }
      );
    }
  }
  
  console.log(pathsFound);
}

function day11b_alt2(input, start, end) {
  var devices = {};
  var devicesInput = input.split(";");
  for (var i = 0; i < devicesInput.length; i++) {
    var device = devicesInput[i];
    var name = device.split(":")[0];
    var outputs = device.split(" ").slice(1);
    devices[name] = deepCopy(outputs);
  }
  
  var deviceStatuses = {};
  for (device in devices) {
    deviceStatuses[device] = {
      "pathsHere": 0
    };
  }
  deviceStatuses[start].pathsHere = 1;
  
  var totalPathsToEnd = 0;
  var iteration = 0;
  while (true) {
    // Find first device with pathsHere > 0
    var foundOne = false;
    for (deviceStatus in deviceStatuses) {
      if (deviceStatuses[deviceStatus].pathsHere > 0) {
        foundOne = true;
        var tempPathsHere = deviceStatuses[deviceStatus].pathsHere;
        deviceStatuses[deviceStatus].pathsHere = 0;
        
        iteration++;
        if (iteration % 10000 === 0) {
          console.log("iteration " + iteration + ": device " + deviceStatus + " has paths " + tempPathsHere);
        }
        
        for (var i = 0; i < devices[deviceStatus].length; i++) {
          if (devices[deviceStatus][i] === end) {
            totalPathsToEnd += tempPathsHere;
          } else if (devices[deviceStatus][i] !== "out") {
            deviceStatuses[devices[deviceStatus][i]].pathsHere += tempPathsHere;
          }
        }
        break;
      }
    }
    if (!foundOne) {
      break;
    }
  }
  console.log(totalPathsToEnd);
}

function day11b_alt3(input, start, end) {
  var devices = {};
  var devicesInput = input.split(";");
  for (var i = 0; i < devicesInput.length; i++) {
    var device = devicesInput[i];
    var name = device.split(":")[0];
    var outputs = device.split(" ").slice(1);
    devices[name] = deepCopy(outputs);
  }
  
  var deviceStatuses = {};
  for (device in devices) {
    deviceStatuses[device] = {
      "pathsHere": 0
    };
  }
  deviceStatuses[start].pathsHere = 1;
  
  var totalPathsToEnd = 0;
  var iteration = 0;
  while (true) {
    // Pick device with minimum pathsHere but over 0
    var minPaths = 9999999999999999;
    var foundDevice = "";
    for (deviceStatus in deviceStatuses) {
      if (deviceStatuses[deviceStatus].pathsHere > 0 && deviceStatuses[deviceStatus].pathsHere < minPaths) {
        minPaths = deviceStatuses[deviceStatus].pathsHere;
        foundDevice = deviceStatus;
      }
    }
    
    if (foundDevice === "") {
      break;
    }
    
    var tempPathsHere = deviceStatuses[foundDevice].pathsHere;
    deviceStatuses[foundDevice].pathsHere = 0;
    
    iteration++;
    if (iteration % 10000 === 0) {
      console.log("iteration " + iteration + ": device " + foundDevice + " has paths " + tempPathsHere);
    }
    
    for (var i = 0; i < devices[foundDevice].length; i++) {
      if (devices[foundDevice][i] === end) {
        totalPathsToEnd += tempPathsHere;
      } else if (devices[foundDevice][i] !== "out") {
        deviceStatuses[devices[foundDevice][i]].pathsHere += tempPathsHere;
      }
    }
  }
  console.log(totalPathsToEnd);
}

/** ========== Helper functions ========== */
// Arrays -- Also remember concat(array), slice( [start,end) ), and splice(index, numToRemove, itemsToAdd...)
function arrayContains(inputArr, val) { return inputArr.indexOf(val) !== -1; }
function arrayIntersection(array1, array2) { return array1.filter(value => array2.includes(value)); }
function removeItemFromArray(inputArr, val) { if (arrayContains(inputArr, val)) { inputArr.splice(inputArr.indexOf(val), 1); } }
// Strings
function replaceCharAt(inputStr, index, character) { return inputStr.substr(0, index) + character + inputStr.substr(index + 1); }
function cutOutCharAt(inputStr, index) { return inputStr.substr(0, index) + inputStr.substr(index + 1); }
function stringContains(inputStr, subStr) { return inputStr.indexOf(subStr) !== -1; }
// Binary
function bin2dec(bin) { return parseInt(bin, 2); }
function dec2bin(dec) { return (dec >>> 0).toString(2); }
// Other
function deepCopy(input) { return JSON.parse(JSON.stringify(input)); }
/** ====================================== */

//var dayInput = "aaa: you hhh;you: bbb ccc;bbb: ddd eee;ccc: ddd eee fff;ddd: ggg;eee: out;fff: out;ggg: out;hhh: ccc fff iii;iii: out";
//var dayInput = "svr: aaa bbb;aaa: fft;fft: ccc;bbb: tty;tty: ccc;ccc: ddd eee;ddd: hub;hub: fff;eee: dac;dac: fff;fff: ggg hhh;ggg: out;hhh: out";
var dayInput = "ufk: out;kgy: srg try;fhi: mxe;ywm: tsx jqk tco;hjp: pxg fkj ode;tzd: orq joq smr;gmu: qfj;kow: tsx jqk;lga: ldk kcm eyu;trj: nnb gek;uqc: fdh rdj;opa: uwc iet cst hnj ybf;xtf: yso rzi tew;exk: wgb jyz zri igi;ice: rhu;fpv: wcy wnm;wuh: iet uwc ybf hnj;hon: vbl rnk met ihp;jvj: gqx;lgn: out;zzi: aef ecv;sce: ixo unv;uxr: iut;nss: qbk ncd;qjk: out;vjv: you rhu jny;fwg: tco;ffk: rpq txp vug hfz;djh: fdh;ekp: sau gbi;amf: ecv kjy;ciy: lgn fzm;uiv: lpi xgf;ihp: cui oul tsz;qxa: jny rhu you;xhl: vyp yoy;tdm: fcw gzu;avz: omy;qfj: kuh anb gxw ulx;rlu: ldg jee qpe riq;adu: lvz eda uiv;ykx: yfk;htw: kgs rpq vug hfz;qqf: jyz igi sdo;nkj: out;cxl: zhi okh;cui: wrc wnm;wrg: kgs txp hfz;upv: nnb;naw: zlb pav erz zxj oam;vug: fdj;yol: fek dvn ywj zxd osu;xgf: ucd;wnk: jny;gfz: ikw qjy;clh: osz;jbw: swf czw;pmi: ybs tkt cld;qqr: zme bol;yqo: tfg;qrz: iet uwc ybf hnj;eda: kek xgf;yfm: tzd szb;enl: jny;efg: ety dro onk;ipq: cwu rpf eru gmo;pgw: ekp hza mog rqt;gar: dds ihv;clx: lvd mir ezh ugd rjt;kek: ltl xph;pob: jet woy;vpy: fox rvu;ddd: kvn fmj uxr;pwe: ccy cys;hzl: wcy wrc;tfl: zxd fek ywj dvn;urb: tgo;fzn: uah jyp zvf;wzs: ksm cka;pbi: pxq fec dat;gzl: fdh;vbl: cui tcg fhi;yba: xuf exk;beo: qyj rhp jiq gfz wcx;xee: upv mxh trj;mfj: bvq uno daq qth wgz;zmk: awn ala;ldk: out;wvv: pav syo hon clb vhq eji oio lav sdy zlb yby quj kgy;rjt: oaf ttk apr;efw: kjy aef ecv;lmp: jny;blv: juh udg;gnn: fiw teb;cil: mmb wxs ymh;pfg: rvu utq;tjq: auf;dat: vgr ggt uco;jnv: htw ozg;fui: qhj;ghw: tfg;hza: sau jdc;arp: okh;uck: hzl;hkh: fev muf ddd hgt;svr: zae jwu wvv naw ypl;fvc: you rhu;ggp: fdj;yby: xcy;vvw: myu agv hnx;jkl: ymh;fiw: see;edz: iet uwc ybf;kym: tvq;nmk: tdm kkc;raf: bkp hhm rjh ydz;xru: ych;qwn: uwc ybf;jnt: out;qjq: qxa;bon: icp rah ipt;mxh: nnb;ohd: tlc;daw: ice;sen: vpy;aqf: jny you;lav: bbl kbm nze;tgo: you rhu;aum: fvc nqq fne;mtn: nsy uho uou yqo jmz szl psd nff wjm efg ghw gmu kui qga njd edv;vck: qse yfm yns xmf meo;hfz: amb;fox: zqk amb;rnh: qph pmi;utm: kxp pdj;ham: hhm bkp;ljo: cwu;qse: szb eoh thr tzd;auf: cst iet;wlo: rah kep shp;osj: iuj zme xzb;qga: qjq ago pdq jlx;tdt: zmi gex kvd;mzt: rhu you;cby: wnm wrc wcy mxe;pdr: tzm;nnb: ixo unv;kvn: vbh acl iut;wpi: uqc;txp: zqk amb;tcg: wrc;xzb: mtn;hca: ljo fft;fgc: wfp crf;vis: riz;ehk: yoy qjk tvq;kwj: nss edl;kzn: ciy suk;nav: you;wew: kep;xvy: djs;rss: ygf wuh qrz;buo: cby smw;cld: wpi;keu: jyp;fss: uwc iet cst ybf;inn: osj;tjp: teb;kxp: twr fcf phr;phr: wdx jck;pav: rnk vbl ihp;wdx: kym xhl;jck: kym xhl ehk zxb;otj: zmi kvd gex;nmh: xru ykn fcf phr;uah: wrd fsd cza;ors: kwj qhz mpe;cwu: iad qod;hgx: gak;clb: upb;pdq: lmp qxa tgo;hyw: hke clh ixu sen;qpt: mud ogi;gao: tzp;mxe: iul vvw zhx zbl eiq zzi wyl rjz dwe ich bvo axx asm rqm sex;tco: vjv enl tji;ivx: ciy;rzi: raf wig yvt;fdh: nsy kui zld qga edv nff wlp pcv;kud: kix gsl boq;kuh: raj ekp mog rqt;ski: huu upv;axx: otj tdt;fmx: gxw pgw kuh;lay: ljo krb bue;ipt: zqk;vls: sjn iau;fkj: vls dzt;vyy: awf ank hsj aum tvb;qnk: ywj;smw: wnm wcy mxe wrc;tsz: wcy wnm;iet: lmq gjp clu fkh kud rbx hph qdi gnn vff jnv nvs gdk pqk qpn zsb jah xtf tjp miz;uwc: qdi hph rbx jnv vff gnn clu gjp fkh kud xtf jah zsb qpn miz tjp gdk pqk nvs;agv: cvb beo vjr;aqo: kay;meo: thr tzd szb eoh;ckk: qfj fmx xez;acp: udg;jyp: fsd wrd;mng: hgd ljv fpv;vuy: hzl ght hwj;tew: raf wig;zmi: hnj ybf iet;ltl: wrc;ode: vls xqf;clu: fiw teb;loh: ihp;zhx: blv zvr hfm acp;daq: uwc hnj ybf;xll: osu dvn ywj fek;dro: fwg ywm qox;kkc: fcw;frk: wcy mxe wnm;oao: nji uho uou jmz wlp swt ghw zld gmu kui efg pcv pwe njd;gdk: htw ffk ozg wrg phe;ccy: ogv;ogv: rhu you;oio: gsu;rgx: osj;zae: jmw kgy zlb sdy yby clx quj hon oam gux erz zxj rlz eji loh clb vhq vae;ucd: wrc wcy mxe wnm;zqk: jfl gfh tqc hbz fui hnb btv fzn inn szw npa spb avz lqy keu rnh;yiw: eya uah;xmf: eoh;zri: mtn oao fdh;wlp: onk;xpd: lga;odx: wzs xpd;you: cil xvy sin iph jkl doo cxl upe fga wdd utm azz bbx tsq bsx svm pmq ieg;raj: jdc;wyb: wkt;doo: wxs ymh;aiz: kvd edz;ksm: ldk;crf: sdo;bvq: ybf hnj iet;anb: raj mog rqt;znf: iet cst hnj ybf;cst: xtf hph rbx rda fkh kud pqk lmq;omy: kwj qhz mpe;tlc: mnv hgd ljv;gfh: fgc hsm krw;nka: qbq tfg kbb;xqf: sjn znf ssj;qhj: tet gzl dil djh arw;ety: ywm fwg ccm qox kow;awn: ivx kxo kzn;yfk: you rhu jny;sff: fdj amb zqk;zhi: wsy tdm kkc;hsd: vwr epe;wgb: mtn rdj fdh;qxm: lym frk smw;xxf: kgd;wqq: ogv;jlx: tgo qxa lmp;xuq: uwc hnj ybf;rbx: kix boq gsl;zxb: vyp qjk;vbh: nkj tdu tiw;qyj: qwn xuq csr;xph: wrc wcy mxe;joq: mxe wrc;ezh: oaf yno ttk;gqx: izq kzn ivx;qjy: uwc iet ybf;xjn: cfs hwj ght;yru: fdj;kxo: afp ciy;gex: iet uwc cst;qcy: out;iau: hnj ybf uwc;vru: huu mxh upv;tji: rhu you;qth: uwc cst;tkt: jbw qvm wkt;djs: ala;gsl: sen hke;dzt: iau znf sjn;huu: nnb gek sce;tsx: tji vjv nav enl;cza: vxy kbh;rrk: vyy dac;sau: you rhu;vda: ode;iul: lay;pqk: kix hyw;srg: eob vks;thr: smr joq orq nmn fxq;dlt: cfs ght;nky: wzs xpd;eru: qod;qbk: mtn oao rdj;kep: amb fdj;ttk: ixj mth buo qxm;ugd: apr yno;lqy: pmi vis rft qph;qbq: ice ade;kix: sen ixu;rah: zqk amb;zvr: mfj;spb: ngf hsm yba fgc;npa: yba fgc;qpn: bon iox wew;sex: tzp hca;xuf: zri igi wgb;oaf: qxm mth ixj;upb: jet gar ohd;mth: frk;wcx: qjy xuq qwn ikw;xez: kuh pgw ulx anb;gjp: wrg;ixj: frk lym cby smw;riz: jbw wkt;ybf: kud fkh clu gjp lmq jnv vff gnn hph rbx rda pqk gdk nvs miz tjp xtf zsb qpn;gbi: jny rhu;gek: unv jnt;tet: rdj;usk: ssi omy axc ors;hgd: wnm mxe wcy wrc;uie: amb;qyl: xjn vuy uck;hgt: kvn uxr;xre: xzb iuj;sdo: rdj oao mtn;see: tzm tfl yol xll;rqt: sau;ank: nqq uhs;utq: fdj zqk;zvf: fsd;acl: tdu nkj dtw;svm: nmh pdj kxp;teb: olu pdr;iph: jvj fyb zmk djs;vhq: lvd ezh mir rjt;zme: mtn oao rdj;kbb: wnk ice;ymh: nky odx aqo;uou: pdq urb qjq ago;nng: rdj oao mtn;fxq: wrc wcy mxe wnm;qph: cld ybs wyb;fdj: jyd avz szw usk piw qgn xja keu gfh yiw tqc fui fzn inn rgx;vgr: out;uhs: rhu jny;swt: qjq ago urb pdq;arw: fdh oao mtn;ohu: fox utq rvu;fmj: vbh iut;lvd: yno apr ttk;jwu: eji rlz zxj loh oio lav clb vhq vae xxf oam hon erz lpu clx sdy zlb jmw;lvz: xgf lpi kek;fek: amb fdj;nze: uiv;ala: ivx;rnk: tcg;fzm: out;pxq: uco ggt vgr iya;bgu: vyy ugx;qox: tco tsx;eji: lvd ugd ezh mir rjt;cys: yfk;vjr: wcx;icp: zqk fdj;hnj: gjp lmq kud hph qdi rbx jnv gdk pqk nvs xtf qpn;izq: suk ciy;kvd: uwc ybf;kui: xez fmx;ybs: jbw qvm wkt;dwe: pxg fkj;cab: agv hnx;bue: tjq cwu;olu: tfl qnk tzm yol;wyl: kjy aef;iuj: oao mtn fdh;jet: dds;udg: daq uno bvq;jee: xee;unv: out;szw: rft qph pmi sio vis;hnx: sfb vjr cvb;ogi: djh gzl dil;ccm: tsx;dac: tvb awf hsj;edv: epe vwr rrk bgu;oul: mxe;twr: ych;juh: wgz daq qth;wkt: czw uqc;vxy: fdh;zlb: kbm;nqq: jny;kay: cka;rhp: csr xuq ikw qjy;cvb: rhp gfz;mpe: edl rnb;rqm: ejd aiz;boq: sen hke clh;nmn: mxe wrc;qpe: vru ski;erz: srg;eob: dlt uck xjn vuy;eoh: nmn;rjh: uie yru sff;fkh: rzi;azz: jee ldg;hnd: ubz ddd;tzm: osu dvn ywj;yno: qxm buo ixj;wcy: gao zbl eiq sue rqm dwe sex;rnb: erv;ecv: oek rss bwi;jqk: tji aqf;vyp: out;bbx: djs jvj zmk;tdu: out;szb: smr orq fxq;try: vks;ugx: hsj ank tvb;piw: axc;hbz: osj qqr xre;hnb: qhj ogi;vsf: acp;tsq: kxp pdj nmh;pmq: nmh;bol: oao;osu: amb fdj;kbh: mtn rdj;vff: yso rzi tew;vks: xjn vuy eju dlt;szl: bgu;met: fhi cui oul tsz;csz: xmf yfm;uco: out;ldg: vru alk;ljv: wrc;lpi: xph ltl ucd;tzp: ljo ipq fft;cfs: wnm wcy mxe;yoy: out;pxg: xqf dzt;jyd: mud ogi;nvs: fiw jqd;awf: nqq uhs;efd: qqr xre;kcm: out;rda: ffk ozg phe;rft: wyb ybs;gux: xcy pob;rvu: amb fdj zqk;asm: pxg;mnv: wnm mxe wcy;vwr: vyy;bsx: riq;dds: mnv ljv hgd;jyz: fdh mtn rdj;fsd: nng kbh vxy;erv: mtn;wig: rjh ydz hhm;mmb: nky odx;mud: dil gzl djh;aef: oek bwi;gzu: dat lar;qvm: swf uqc;hsj: uhs;oek: wuh qrz ygf fss;gak: fev muf ubz ddd;zxj: uyw pob;smr: wrc wcy;lpu: srg;zxd: amb fdj zqk;dtw: out;qod: iet hnj cst ybf;fcf: wdx ych;gxw: ekp rqt mog;qdi: boq gsl kix;fga: zhi;kgd: yfm meo yns;edl: qbk ncd;riq: xee ski;ago: qxa lmp;ikw: iet;jfl: hsm ngf;ngf: wfp exk;apr: mth qxm buo;dvn: zqk amb fdj;rew: uah eya jyp zvf;fcw: lar fec;vzx: qse;fev: fmj kvn;ihv: ljv;phe: kgs rpq txp hfz;lar: ggt iya;ieg: nmk okh;jny: svm arp iph bsx tsq rlu wdd upe hgx;wdd: hkh;zsb: boq hyw;kbm: eda lvz;osz: fox utq;tof: mmb;suk: lgn gbv qcy;nji: dro onk;qgn: sio qph rft;sin: zmk djs;bkp: sff ggp;ixu: pfg vpy ohu;tvq: out;ixo: out;orq: wnm wrc wcy;upe: hkh hnd;iox: icp;hfm: juh;czw: oao;eju: hzl;fft: eru gmo;rjz: acp hfm blv;vae: nze bbl;ade: you rhu;psd: daw;njd: qbq;rhu: bbx bsx utm hgx tof upe ieg pmq svm sin rlu xvy cxl doo jkl iph;jqd: pdr olu see;sue: lay hca;fec: ggt;ubz: fmj;iad: hnj ybf uwc iet;pcv: pdq;ncd: fdh rdj oao;rpq: zqk fdj;hph: rzi tew;wjm: ykx wqq cys;kjy: bwi rss;bwi: qrz;hke: ohu;jmw: adu;wfp: igi wgb;dil: oao;rlz: met;hsm: wfp xuf qqf crf;sjn: uwc ybf;muf: kvn uxr;mgk: ejd cyg tdt;gmo: qod iad auf;xja: pmi;pdj: ykn phr fcf;gsu: vks qyl;ykn: ych wdx;ssj: uwc ybf cst;xcy: ohd jet;zld: bgu rrk epe;myu: sfb beo;rpf: qod opa;sfb: jiq gfz;igi: mtn;tfg: ade;nff: ety dro;epe: ugx;iut: nkj tdu tiw;shp: zqk;onk: qox kow fwg;yso: ham;wgz: iet cst hnj;afp: gbv;cyg: kvd edz;ggt: out;iya: out;oam: vck;tiw: out;eyu: out;sio: wyb cld tkt;ssi: qhz mpe;uho: xez fmx;hwj: wnm mxe wcy;sdy: csz;uno: cst hnj iet uwc;wrd: nng kbh vxy;btv: ors;miz: tew yso;okh: kkc wsy;yvt: ydz;ych: zxb;zbl: ejd cyg otj tdt;csr: iet uwc cst;jmz: onb ykx ccy;tvb: fvc;ypl: jmw sdy yby kgy erz syo pav gux oam hon clb oio lav yfa loh zxj rlz eji;kgs: zqk;mir: apr oaf yno;woy: ihv dds mng;ght: wnm mxe wrc;ich: tzp hca;onb: ogv mzt yfk;syo: kgd vzx;rdj: szl nji uou nsy yqo nff wjm zld gmu efg njd uho ckk wlp swt psd ghw kui hsd nka qga edv;wxs: nky;uyw: gar;ygf: iet;ydz: ggp yru uie;amb: qgn avz szw npa hnb rgx tqc yiw jfl gfh efd piw rnh keu jyd usk rew spb btv fzn qpt fui hbz;swf: mtn fdh;fyb: gqx ala awn;ywj: fdj;ozg: rpq vug;ulx: raj hza rqt;tqc: eya jyp zvf uah;nsy: xez;jiq: ikw xuq qwn qjy csr;yfa: ugd ezh;eiq: ode fkj;wrc: vvw cab vda ich gao sue sex amf iul zhx hjp zbl zzi wyl eiq rjz mgk dwe vsf bvo axx asm efw rqm;yns: tzd;wsy: gzu pbi fcw;lmq: bon wew iox;bvo: myu;quj: rnk met;krw: xuf wfp;gbv: out;qhz: rnb;lym: wrc wnm;jdc: rhu you;axc: qhz mpe;wnm: iul hjp rjz cab mgk eiq zzi wyl bvo ich asm axx;mog: sau gbi;krb: rpf;eya: fsd cza;fne: rhu you;cka: ldk eyu ufk;hhm: uie;alk: trj;ejd: gex;bbl: uiv;jah: wlo iox";

//day11a(dayInput);
//day11b(dayInput);
//day11b_alt2(dayInput, "svr", "fft");
day11b_alt3(dayInput, "svr", "fft");
//day11b_alt3(dayInput, "svr", "out");

/**
svr->fft: 21788
fft->dac: 6402587 (dac->fft: 0)
dac->out: 3651
          Multiply these three together to get the total paths
*/


