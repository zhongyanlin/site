
var t0 = null;
var selx = '';
var versions = new Array();
var vn = 0, N = 0;
var xy = [0, 0];
var keyframes = [];
var comments = [];
var kfcomments = [];
var sel2sheet = [];
var isframe = false;
var numselects = 0;
var currentsel = -1;
var currentsel1 = -1;
if (typeof (installname) == 'undefined')
    var installname = "tealeaman";
var oldstage = null;
var states =
        [
            [1, 0, 0],
            [1, 2, 0],
            [2, 3, 2],
            [0, 3, 2]
        ];

var charcode = function (c)
{
    if (c == '/')
        return 0;
    if (c == '*')
        return 1;
    return 2;
}

var output = function (state, e, code)
{
    var a = '';
    if (state == 1 && code == 2)
        a = '/';
    if (state == 1 && code != 1
            || state == 0 && code != 0)
        a += e;
    return a;
}
var incode = null;
var filter = function (s, mark)
{
    var c;
    var code;
    var state = 0;
    var a = '';
    for (var j = 0; j < s.length; j++)
    {
        c = s.charAt(j);
        code = charcode(c);

        if (mark == false)
            a += output(state, c, code);
        else if (state == 1 && code != 1
                || state == 0 && code != 0)
            incode[j] = true;
        else
            incode[j] = false;
        state = states[state][code];
    }
    return a;
}



function trim(x)
{
    var i = 0;
    while (i < x.length && (x.charAt(i) == '\n' || x.charAt(i) == ' ' || x.charAt(i) == '\r'))
        i++;
    var j = x.length - 1;
    if (i > j)
        return '';
    while (j > i && (x.charAt(j) == '\n' || x.charAt(j) == ' ' || x.charAt(j) == '\r'))
        j--;
    if (i >= j + 1)
        return '';
    return x.substring(i, j + 1);
}
function showhint(t, h)
{
    if (trim(t.value) == '')
    {
        t.value = h;
        t.style.color = 'grey';
        t.className = 'hint';
        t.style.color = 'grey';
    } else
    {
        t.className = 'enter';
        t.style.color = 'red';
    }
}
function hidehint(t, h)
{
    if (trim(t.value) == h)
    {
        t.value = '';
    }
    t.className = 'enter';
    t.style.color = 'red';
}

function makefield(ts)
{
    var sel = "<div style=height:640px;overflow:hidden  id=t3><table cellspacing=0 cellpadding=4 border=1 style=border-collapse:collapse >";
    var z = 0;

    for (var i = 0; i < ts.length; i++)
    {
        ts[i] = trim(ts[i]);
        var j = ts[i].indexOf(":");
        if (j == -1)
            continue;
        var pn = ts[i].substring(0, j).replace(/ /g, '');
        var v = trim(ts[i].substring(j + 1));
        if (v == '')
            continue;
        if (z % 2 == 0)
            sel += "<tr>";
        var y = trim(pn.replace(/\/.*/, ''));
        //y = '<a href="https://www.w3schools.com/cssref/" target=w3school>' + y + '</a>';
        sel += "<td align=left><nobr>" + y + "</nobr></td><td align=center >";
        if (v.indexOf("e.g") == 0)
        {
            v = trim(v.replace(/["|']/g, '')).replace(/;$/, '').replace(/ \/ /g, "@1#");
            var ll = 0;
            var dl = '';
            var hasmore = false;
            if ((ll=v.indexOf('/'))>0)
          {
               hasmore = true;
               var xs = v.substring(4).split(/\//);
               dl = "<datalist id=dl" + i + ">";
               for (var k1=0; k1 < xs.length; k1++)
                   dl += '<option value="' + xs[k1].replace(/@1#/g,' / ') + '"/>';
               dl += "</datalist>";
            }
            
            v = v.replace(/@1#/g,' / ').replace(/\/.*$/,'');
            var v1 = v.replace(/"/g, '\\"');
            var v2 = v1.replace(/'/g, "\\'");
            sel += "<input   onblur=\"showhint(this,'"
                    + v2
                    + "')\" onfocus=\"hidehint(this,'"
                    + v2
                    + "')\" class=hint style=\"width:150px\" value=\""
                    + v1
                    + "\" name=\""
                    + pn
                    + "\" onchange=setprop() " + (hasmore?("list=dl" + i + " "):"") + ">" + dl;
        } else
        {
            sel += "<select name=\"" + pn + "\" class=enter  style=\"width:153px\" onchange=setprop()><option value=\"\"></option>";

            if (v.replace(/[\-]?[0-9]+[ ]*\-[ ]*[\-]?[0-9]+[ ]*[a-z]*/, '') == '')
            {
                var low = parseInt(v.replace(/[ ]*\-[ ]*[\-]?[0-9]+[ ]*[a-z]*/, ''));
                var hg = parseInt(v.replace(/[\-]?[0-9]+[ ]*\-[ ]*/, '').replace(/[ ]*[a-z]*/, ''));
                var ut = v.replace(/[\-]?[0-9]+[ ]*\-[ ]*[\-]?[0-9]+[ ]*/, '').replace(/ /g, '');

                var step = Math.ceil((hg - low) / 50.0);
                while (low <= hg)
                {
                    sel += "<option value=\"" + low + ut + "\">" + low + ut + "</option>";
                    low += step;
                }
            } else
            {
                var vs = v.split(/[ ]*\/[ ]*/);
                for (j = 0; j < vs.length; j++)
                {
                    sel += "<option value=\"" + vs[j].replace(/"/g, '@@') + "\">" + vs[j] + "</option>";
                }
            }
            sel += "</select>";
        }
        sel += "</td><td onclick=pind(this) width=20>&nbsp;</td>";
        if (z % 2 == 1)
            sel += "</tr>";
        
        z++;
    }

    v = 'property:value;'
    var morestr = "<td ><a href=\"https://www.w3schools.com/cssref/\" target=w3school>More</a></td><td><input name=More size=25 onblur=\"showhint(this,'"
            + v.replace(/'/g, "\\'").replace(/"/g, '\\"')
            + "')\" onfocus=\"hidehint(this,'"
            + v.replace(/'/g, "\\'").replace(/"/g, '\\"')
            + "')\" class=hint style=\"width:150px\" value=\""
            + v.replace(/"/g, '\\"')
            + "\"   onchange=setprop();setcl(this) ></td><td   width=20>&nbsp;</td>";

    if (z % 2 == 1)
    {
        sel += morestr + "</tr>";
    } else
    {
        sel += "<tr>" + morestr + "<td colspan=3></td></tr>";
    }
    return sel + "</table></div>";
}
var fields = '';
function setcl( t)
{
    if (t.value !='' && t.value.indexOf('e.g') != 0)
        t.style.color = 'red';
    else t.color = 'gery';
}
onload = function ()
{
    textareatobesearch = document.f.codes;
    var t1 = document.getElementById('t1');
    fields = t1.rows[1].cells[0].innerHTML.replace(/<!../, '').replace(/..>$/, '');

    t1.rows[1].cells[0].innerHTML = makefield(fields.split(/\n/));
    if (opener != null && typeof (opener.helpsave) != 'undefined')
    {

    } else
    {
        document.f.filename.style.visibility = 'hidden';
        //document.f.savebtn.style.visibility = 'hidden';
        document.getElementById('t2').rows[0].cells[0].innerHTML = '';
    }

    if (document.f.codes.value != '')
        parsecss();
    document.f.undobtn.disabled = true;
    document.f.dobtn.disabled = true;
    document.getElementById("t3").style.cssText = '' + document.getElementById("t3").style.cssText;
}
function findPositionnoScrolling(oElement, win)
{
    if (win == null)
        win = self;
    if (oElement == null)
        return [0, 0];
    if (typeof (oElement.offsetParent) != 'undefined')
    {
        var ii = 0;
        var originalElement = oElement;
        for (var posY = 0, posX = 0; ii++ < 10 && oElement != null; oElement = oElement.offsetParent)
        {
            posY += oElement.offsetTop;
            posX += oElement.offsetLeft;
            if (oElement != originalElement && oElement != win.document.body && oElement != win.document.documentElement)
            {
                posY -= oElement.scrollTop;
                posX -= oElement.scrollLeft;
            }
        }
        return  [posX, posY];
    } else
    {
        return  [oElement.x, oElement.y];
    }
}

function settag(v)
{
    for (var i = 0; i < document.f.fortag.options.length; i++)
    {
        if (document.f.fortag.options[i].value == v)
        {
            document.f.fortag.selectedIndex = i;
            return;
        }
    }
    document.f.fortag.options[document.f.fortag.options.length] = new Option(v, v);
    document.f.fortag.selectedIndex = document.f.fortag.options.length-1;
}

function setstage(v)
{
    for (var i = 0; i < document.f.stage.options.length; i++)
    {
        if (document.f.stage.options[i].value == v)
        {
            document.f.stage.selectedIndex = i;
            return;
        }
    }
    document.f.stage.options[document.f.stage.options.length] = new Option(v, v);
    document.f.stage.selectedIndex = document.f.stage.options.length-1;
}
function parsecss()
{
   //updatecss();

    var k = 0;
    var t = document.f.codes.value;

    incode = new Array(t.length);
    filter(t, true);

    var i, l = 0;
    var s = document.f.fortag;
    ns = s.options.length;
    for (var i = ns - 1; i >= 1; i--)
        s.options[i] = null;
    s = document.f.stage;
    ns = s.options.length;
    for (var i = ns - 1; i >= 1; i--)
        s.options[i] = null;
    s = document.f.selector;
    var ns = s.options.length;
    for (var i = ns - 1; i >= 1; i--)
        s.options[i] = null;
    keyframes = [];
    kfcomments = [];
    comments = [];
    sel2sheet = [];
    while (true)
    {
        var k1 = k;
        
        var i = t.indexOf("{", k);
       
        if (i == -1)
            break;
        var sel = trim(filter(t.substring(k, i).replace(/\n/g, ''),false) );
      
        var comment = '';
        for (k1 = k; k < i - 1; k++)
            if (incode[k1] == false)
                comment += t.charAt(k1);
        comments[sel] = comment;
        s.options[s.options.length] = new Option(sel, sel);
        if (sel.indexOf('@keyframe') >= 0)
        {
            if (sel.indexOf('@keyframes') < 0)
                alert('Do you mean ' + sel.replace(/keyframe/, 'keyframes'));
            var store = [];
            var j = i + 1, n, m, gm = i;
            var cmt = [];
            while ((n = t.indexOf("{", j)) > 0 && t.substring(j, n).indexOf('}') < 0 && (m = t.indexOf("}", n + 1)) > 0)
            {
                var stage = trim(filter(t.substring(j, n).replace(/\n/g, ''), false));
                var comment = '';
                for (var k1 = j + 1; k1 < n - 1; k1++)
                    if (incode[k1] == false)
                          comment += t.charAt(k1);
                cmt[stage] = comment;
                store[stage] = trim(t.substring(n + 1, m));
                j = m + 1;
                gm = m;
            }
            keyframes[sel] = store;
            kfcomments[sel] = cmt;
            i = gm;
            l = t.indexOf("}", i + 1);
        } else
        {
            l = t.indexOf("}", i + 1);
            if (l > 0)
                sel2sheet[sel] = t.substring(i + 1, l);
            else
                sel2sheet[sel] = '';
        }


        if (l > 0)
            k = l + 1;
        else
            break;

    }

    if (l >= 0)
    {
        var sel = trim(t.substring(k));

        if (sel != '')
        {
            s.options[s.options.length] = new Option(sel, sel);
            document.f.codes.value = t.substring(0, k) + "\n" + sel + "\n{\n}";
            if (sel.indexOf('@keyframes') >= 0)
            {
                keyframes[sel] = [];
                kfcomments[sel] = null;
                setstage('');
            } else
            {
                sel2sheet[sel] = '';
                settag('');
            }
        }
    }
    

    if (numselects == s.options.length - 1)
    {
        if (currentsel > 0)  // rename
        {
            s.selectedIndex = currentsel;
            getsel(s);
        }
    } else if (numselects == 0 && s.options.length > 1) //begiingn
    {
        s.selectedIndex = 1;
        getsel(s);
        s.selectedIndex = 1;
        currentsel = 1;
    } else if (numselects + 1 == s.options.length - 1) // just added one
    {
        s.selectedIndex = s.options.length - 1;
        getsel(s);
        s.selectedIndex = s.options.length - 1;
        currentsel = s.options.length - 1;
    }
    numselects = s.options.length - 1;

}
var t0;

function getsel1(sel)
{
    if (selx.indexOf('@keyframes') < 0) return;
    var selvalue = sel.options[sel.selectedIndex].value;
     
    var store = keyframes[selx];
    var clm = kfcomments[selx];
    if (selvalue == 'New Stage')
    {
        var z = prompt('Name of New Stage');
        setstage(z);
        store[z] = '';
        clm[z] = '';
        keyframes[selx] = store;
        document.f.sheet.value = '';
        updatecss();
        filltag();
        fillsheet("");
        vn = 0;
        N = 1;
        versions[0] = "";
        document.f.undobtn.disabled = true;
        document.f.dobtn.disabled = true;
    } else
    {
        var ws = store[selvalue];
        if (ws == null) ws = '';
        if (ws!=null)
        {
        filltag();
        updatecss();
        fillsheet(ws);
        document.f.sheet.value = ws;
        vn = 0;
        N = 1;
        versions[0] = ws;
        document.f.undobtn.disabled = true;
        document.f.dobtn.disabled = true;
        }
    }
 
    oldstage = selvalue;
}

function getsel2(sel)
{
     sample(document.f.sheet.value);
}


function filltag()
{
    var tags = ['div', 'span', 'p', 'table', 'tr', 'td', 'ul', 'ol', 'li', 'select', 'input', 'textarea', 'a',
        'iframe', 'body'];
    for (var i = 0; i < tags.length; i++)
        document.f.fortag.options[i] = new Option(tags[i], tags[i]);
}


var notshow = '';
function fillsheet(sheet)
{
    for (var k = 0; k < document.f.elements.length; k++)
    {
        var e = document.f.elements[k];
        if (oldone(e))
            continue;
        if (e.tagName.toLowerCase() == 'input')
        {
            var x = ("" + e.onblur);
            var j = x.indexOf("showhint");
            x = x.substring(j);
            e.value = '';
            x = x.replace(/showhint.this,/, "showhint(e,");
            x = x.replace(/}/, "");
        
            eval(x);
            e.className = 'hint';
        } else
            e.selectedIndex = 0;
    }

    var ss = sheet.split(/;/);
    notshow = '';
    for (i = 0; i < ss.length; i++)
    {
        var j = ss[i].indexOf(":");
        if (j == -1)
            continue;
        var pn = trim(ss[i].substring(0, j).replace(/[ ]/g, ''));
        var pv = trim(ss[i].substring(j + 1).replace("\n", " "));
        
        var hit = false;
         
        for (var k = 0; k < document.f.elements.length; k++)
        {
            var e = document.f.elements[k];
            if (oldone(e))
                continue;
            
            if (("/" + e.name.toLowerCase() + "/").indexOf("/" + pn.toLowerCase() + "/") >= 0)
            {
                hit = true;
               
                if (e.tagName.toLowerCase() == 'input')
                {
                    e.value = pv;
                    e.className = 'enter';
                    e.style.color = 'red'; 
                } else
                {
                    for (var l = 0; l < e.options.length; l++)
                    {
                        if (e.options[l].value.toLowerCase().replace(/ /g, '').replace(/@@/g, '"') == pv.toLowerCase().replace(/ /g, ''))
                            break;
                    }
                    if (l == e.options.length)
                    {
                        if (pv.charAt(0).replace(/[0-9]/, '') == '' && pv != 'inherit')
                        {
                            e.options[l] = new Option(pv, pv);
                            e.selectedIndex = l;
                        } else if (pv != 'inherit' && pv != 'bold')
                        {
                            error(pv + ' is an invalid value for ' + pn);
                            e.selectedIndex = 0;
                        }
                    } else
                    {
                        e.selectedIndex = l;
                    }
                }
            }

        }
        if (hit == false)
            notshow += "\n" + ss[i].replace(/:/g, ":e.g. ");
    }
    if (notshow != '')
    {
        //These properties are not recognized<br>" + notshow);
        //document.f.More.value = notshow;
        fields += notshow;
        var t1 = document.getElementById('t1');
        t1.rows[1].cells[0].innerHTML = makefield(fields.split(/\n/));
        notshow = '';
        fillsheet(sheet);
    } else
    {
        xy = findPositionnoScrolling(t0.rows[3].cells[0]);
        sample(sheet);
    }
}


function error(s)
{
    var d = document.createElement("div");
    d.id = "err";
    d.className = "errplain";
    d.innerHTML = "<img src=/" + installname + "/image/icon/smalls01.png onclick=closeerr() style=\"float:left\">" + s;
    document.body.appendChild(d);
}

function closeerr()
{
    var d = document.getElementById("err");
    document.body.removeChild(d);
}

function adjust(sheet)
{
    if (sheet == null)
        return '';
    sheet = trim(sheet.replace(/\n/g, '').replace(/;[ ]+/g, ';').replace(/:[ ]+/g, ':'));
    var i = -1;
    while (i < sheet.length - 1)
    {
        i = sheet.indexOf("top:", i + 1);
        if (i == -1)
            break;
        else
        if (i == 0 || sheet.charAt(i - 1).replace(/[a-z]/, '') != '')
        {
            var n = parseInt(sheet.substring(i + 4).replace(/[^0-9].*/, ''));
            sheet = sheet.substring(0, i + 4) + (n + xy[1]) + sheet.substring(i + 4).replace(/[0-9]+/, '');
            break;
        }
    }
    i = -1;
    while (i < sheet.length - 1)
    {
        i = sheet.indexOf("left:", i + 1);
        if (i == -1)
            break;
        else if (i == 0 || sheet.charAt(i - 1).replace(/[a-z]/, '') != '')
        {
            n = parseInt(sheet.substring(i + 5).replace(/[^0-9].*/, ''));
            sheet = sheet.substring(0, i + 5) + (n + xy[0]) + sheet.substring(i + 5).replace(/[0-9]+/, '');
        }
    }
    return sheet;
}
function oldone(e)
{
    return (e.name.toLowerCase() == 'codes'
            || e.name.toLowerCase() == 'sheet'
            || e.name.toLowerCase() == 'parsebtn'
            || e.name.toLowerCase() == 'filename'
            || e.name.toLowerCase() == 'dobtn'
            || e.name.toLowerCase() == 'undobtn'
            || e.name.toLowerCase() == 'savebtn'
            || e.name.toLowerCase() == 'selector'
            || e.name.toLowerCase() == 'chn'
            || e.name.toLowerCase() == 'fortag');
}
function setprop()
{
    var sheet = '';
    for (var k = 0; k < document.f.elements.length; k++)
    {
        var e = document.f.elements[k];
        if (oldone(e))
        {
            continue;
        }
        var vl = '';
        if (e.tagName.toLowerCase() == 'input')
        {
            vl = trim(e.value.replace(/[ ]+/, ' '));
            if (vl.indexOf('e.g') == 0)
            {
                vl = '';
            }
            if (e.value == '') e.style.color = 'grey';
        } else if (e.tagName.toLowerCase() == 'select')
        {
            if (e.selectedIndex != 0 && e.options[e.selectedIndex]!=null)
            {
                vl = e.options[e.selectedIndex].value.replace(/@@/g, '"');
            }
            else
                e.style.color = 'grey';
        }
        if (vl == '')
            continue;
        var es = e.name.toLowerCase().split(/\//);
        if (e.name == 'More')
        {
            if (vl.indexOf(":") > 0 && vl != 'property:value')
                sheet += vl + ";\n";
        } else
            for (var i = 0; i < es.length; i++)
                sheet += es[i] + ":" + vl + ";\n";
    }
    var t0 = document.getElementById('t0');
    sheet = sheet.replace(/property:value;/, '').replace(/\n[ ]*$/, '').replace(/;[ ]*$/, '').replace(/\n[ ]*$/, '').replace(/;[ ]*$/, '');
    sample(sheet);
    document.f.sheet.value = sheet;
    if (selx.indexOf("@keyframes") >= 0)
    {
        var store = keyframes[selx];
        store[oldstage] = sheet;
        keyframes[selx] = store;
    } else
    {
        sel2sheet[selx] = sheet;
    }
    vn = N;
    versions[N++] = sheet;
    document.f.undobtn.disabled = false;
}

function undo()
{
    if (vn == 0)
        reutrn;
    vn--;
    fillsheet(versions[vn]);
    document.f.sheet.value = versions[vn];
    if (selx.indexOf("@keyframes") >= 0)
    {
        var store = keyframes[selx];
        store[oldstage] = versions[vn];
        keyframes[selx] = store;
    } else
    {
        sel2sheet[selx] = versions[vn];
    }
    document.f.dobtn.disabled = false;
    if (vn == 0)
    {
        document.f.undobtn.disabled = true;
    }
}

function goahead()
{
    if (vn == N - 1)
        reutrn;
    vn++;
    fillsheet(versions[vn]);
    document.f.sheet.value = versions[vn];
    if (selx.indexOf("@keyframes") >= 0)
    {
        var store = keyframes[selx];
        store[oldstage] = versions[vn];
        keyframes[selx] = store;
    } else
    {
        sel2sheet[selx] = versions[vn];
    }
    if (vn == N - 1)
    {
        document.f.dobtn.disabled = true;
    }
}
var contents = 'contents';
var sheet1;
function changecontent()
{
    var td = document.getElementById('showarea');
    td.innerHTML = "<textarea id=newcontent rows=10 cols=50>" + contents + "</textarea>";
    document.getElementById('showarea').onclick = null;
    document.f.chn.style.visibility = 'visible';
    document.f.chn.className = 'button';
    document.f.chn.value = 'Update';
}
function showhtml()
{
    if (document.getElementById('newcontent')!=null)
    {
        updatec();
    }
    else if (document.f.chn.value == 'Sample')
    {
        var dv = document.createElement('div');
        dv.style.cssText = 'background-color:grey;position:absolute;left:100px;top:100px;z-index:10;border:1px grey outset;padding:1px';
        var x = document.getElementById('showarea');
        
        dv.innerHTML='<table><tr><td  id=scl onclick=closesic(this)> <!----></td><td  id=sis>The HTML codes of the sample object below</td></tr><tr><td colspan=2><textarea rows=20 cols=60>' + document.getElementById('showarea').innerHTML.replace(/textarea/ ,"text'+'area") + '</textarea></td></tr></table>';
        document.body.appendChild(dv);
        document.f.chn.value = 'Sample';
    }
}
function closesic(s)
{
    document.body.removeChild(s.parentNode.parentNode.parentNode.parentNode);
}
function updatec()
{
    contents = document.getElementById('newcontent').value;
    sample(sheet1);
    document.f.chn.value = 'Sample';
    document.getElementById('showarea').onclick = changecontent;
}
function sample(sheet)
{
    sheet1 = sheet;
    t0 = document.getElementById('t0');
    filltag();
    var k = document.f.fortag.selectedIndex; if (k==-1) k = 0;
    var tag = document.f.fortag.options[k].value;
    
    if (tag == 'img')
    {
        t0.rows[3].cells[0].innerHTML = "<img style=\"" + adjust(sheet) + "\"  src=/" + installname + "/image/" + bgindexjpg + " width=200> ";
    } else if (tag == 'p')
    {
        t0.rows[3].cells[0].innerHTML = "<p style=\"" + adjust(sheet) + "\" > " + contents + "</p>";
    } else if (tag == 'span')
    {
        t0.rows[3].cells[0].innerHTML = "<span style=\"" + adjust(sheet) + "\"> " + contents + " </span>";
    } else if (tag == 'table')
    {
        t0.rows[3].cells[0].innerHTML = "<table style=\"" + adjust(sheet) + "\" ><tr><td>" + contents + "</td><td>" + contents + "</td></tr><tr><td>" + contents + "</td><td>" + contents + "</td></tr></table>";
    } else if (tag == 'tr')
    {
        t0.rows[3].cells[0].innerHTML = "<table ><tr style=\"" + adjust(sheet) + "\"><td>" + contents + "</td><td>" + contents + "</td></tr><tr><td>" + contents + "</td><td>" + contents + "</td></tr></table>";
    } else if (tag == 'td')
    {
        t0.rows[3].cells[0].innerHTML = "<table ><tr ><td style=\"" + adjust(sheet) + "\">" + contents + "</td><td>" + contents + "</td></tr><tr><td>" + contents + "</td><td>" + contents + "</td></tr></table>";
    } else if (tag == 'ol')
    {
        t0.rows[3].cells[0].innerHTML = "<ol style=\"" + adjust(sheet) + "\" ><li>" + contents + "</li><li>" + contents + "</li></ol>";
    } else if (tag == 'ul')
    {
        t0.rows[3].cells[0].innerHTML = "<ul style=\"" + adjust(sheet) + "\" ><li>" + contents + "</li><li>" + contents + "</li></ul>";
    } else if (tag == 'a')
    {
        t0.rows[3].cells[0].innerHTML = "<a style=\"" + adjust(sheet) + "\" href=\"http://www.yahoo.com\" target=_blank>http://www.yahoo.com </a>";
    } else if (tag == 'h1' || tag == 'h2' || tag == 'h3' || tag == 'h4')
    {
        t0.rows[3].cells[0].innerHTML = "<" + tag + " style=\"" + adjust(sheet) + "\" ><li>" + contents + "</li><li>" + contents + "</li></" + tag + ">";
    } else if (tag == 'input')
    {
        t0.rows[3].cells[0].innerHTML = "<" + tag + " style=\"" + adjust(sheet) + "\" value=\"" + contents + "\" >";
    } else if (tag == 'select')
    {
        t0.rows[3].cells[0].innerHTML = "<" + tag + " style=\"" + adjust(sheet) + "\" ><option>" + contents + "</option></select>";
    } else if (tag == 'textarea')
    {
        t0.rows[3].cells[0].innerHTML = "<" + tag + " style=\"" + adjust(sheet) + "\" rows=5 cols=20>" + contents + "</" + "textarea>";
    } else
    {
        if (selx.charAt(0)=='#')
        {
           var did = selx.replace(/:.*/,'');
           var str = '';
           for (var key in sel2sheet)
           {
               if (key.indexOf(did)==0)
                   str += key + '{' + sel2sheet[key] + '}'
           }
          t0.rows[3].cells[0].innerHTML = '<style>'+ str + "</style><div id=\"" + did.substring(1) + "\" >" + contents + "</div>";
       }else if (selx.charAt(0)=='@')
        {
           var framenm = trim(selx.replace(/^[^ ]+[ ]+/,''));
           var str = selx + '{' + framestr(selx) + "}"
           t0.rows[3].cells[0].innerHTML = '<style>'+ str + "</style><div style=\"animation:" + framenm + " 2s 2\" >" + contents + "</div>";
       }else
          t0.rows[3].cells[0].innerHTML =   "<div style=\"" + adjust(sheet) + "\" >" + contents + "</div>";
    }

}

function updatecss()
{
    if (selx == '')
        return;
    var k = 0;
    var t = document.f.codes.value;
    var i;
    var str = '';
    var s = document.f.selector;
    for (i = 1; i < s.length; i++)
    {
        var sel = s.options[i].value;
        var xx = comments[sel];
        str += (xx==null?'':xx) + "\n";
        str += sel + "\n{\n"
        if (sel.indexOf('@keyframes') >= 0)
        {
            var y = '';
            var store = keyframes[sel];
            var mp = kfcomments[sel];
            for (var key in store)
            {
                if (mp[key]!='')
                   y += mp[key] + "\n";
                y += key + "{" + store[key] + "}\n";
            }
            str += ident(y) ;
        } 
        else
        {
            str += ident(sel2sheet[sel]) ;
        } 
        str += "\n}\n";
    }
    document.f.codes.value = str;
}
function framestr(key)
{
    var y = '';
    var store = keyframes[key];
    for (var key in store)
    {
        y += key + "{" + store[key] + "}\n";
    }
    return y;
}
function combine(selx, oldstage, cod)
{
    // var y = document.f.fortag.options[document.f.fortag.selectedIndex].value;
    var store = keyframes[selx];
    var z = '';
    for (var key in store)
    {
        if (key == oldstage && cod.replace(/[ |\n]/g, '') != '')
        {
            store[key] = cod;
        }
        z += key + '{' + store[key] + '}\n';
    }
    return z;
}
function ident(s)
{
    return "   " + trim(s).replace(/\n[ ]*/g, '\n   ');
}

function saveit()
{
    updatecss();
    opener.helpsave(window, document.f.filename.value, document.f.codes.value);
}

function renull(fn, len, furl, ltime)
{
    var cl = document.f.savebtn.style.color;
    document.f.savebtn.style.color = "#00CC00";
    document.f.savebtn.style.color = cl;
}

function getsel(sel)
{
    if (sel == null || typeof (sel.tagName) == 'undefined' || sel.tagName.toLowerCase() != 'select' || sel.selectedIndex == -1)
    {
        return;
    }
    updatecss();
    t0 = document.getElementById('t0');
    selx = sel.options[sel.selectedIndex].value;
    currentsel = sel.selectedIndex;
    var ll = selx.indexOf(".");
    var fortag = '';
    for (var j = document.f.fortag.options.length - 1; j >= 0; j--)
        document.f.fortag.options[j] = null;
    if (selx.indexOf('@keyframes') >= 0)
    {
        document.getElementById('lblstage').style.visibility = 'visible';
        document.f.stage.style.visibility = 'visible';
        var store = keyframes[selx];
        var key1 = null;
        var str = '';
        for (var key in store)
        {
            if (key1 == null)
                key1 = key;
            setstage(key);
            if (oldstage != null && oldstage == key)
                key1 = key;
        }
        setstage('New Stage');
        setstage(key1);
        document.f.sheet.value = store[key1];
        fillsheet(store[key1]);
        oldstage = key1;
        vn = 0;
        N = 1;
        versions[0] = store[key1];
        document.f.undobtn.disabled = true;
        document.f.dobtn.disabled = true;
        currentsel = sel.selectedIndex;
        filltag();
        return;
    } else if (ll > 0)
    {
        fortag = selx.substring(0, ll);
        document.getElementById('lblstage').style.visibility = 'hidden';
        document.f.stage.style.visibility = 'hidden';
        filltag();
        settag(fortag);
    } else
    {
        ll = selx.lastIndexOf(" ");
        document.getElementById('lblstage').style.visibility = 'hidden';
        document.f.stage.style.visibility = 'hidden';
        filltag();
        if (ll > 0)
        {
            fortag = selx.substring(ll + 1);
        } else if (selx.replace(/[a-z]/g, '') == '')
        {
            fortag = selx;
        }

        settag(fortag);
    }
    var k = 0;
    var t = document.f.codes.value;
    var i;
    var sheet = '';
    if (selx.indexOf('@keyframes') < 0)
    {
        sheet = sel2sheet[selx];
        sheet = trim(sheet).replace(/\n[ ]+/g, '\n');
        document.f.sheet.value = sheet;
        vn = 0;
        N = 1;
        versions[0] = sheet;
        fillsheet(sheet);
        document.f.undobtn.disabled = true;
        document.f.dobtn.disabled = true;
        currentsel = sel.selectedIndex;
    }
}
function pind(pn)
{
   var x =  pn.previousSibling.getElementsByTagName('input');
   if (x!=null && x.length==1) 
   {
       if ( x[0].value.indexOf('e.g')==0 && x[0].value!='')
       {
       x[0].value = x[0].value.replace(/^e\.g./,'');
       x[0].style.color = 'red';
       x[0].focus();
       setprop();
       }
       else if ( x[0].value=='')
       {
       x[0].style.color = 'grey';
       setprop();
       x[0].value = 'e.g.';
       
       }
   }
   
    
}

