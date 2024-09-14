 
var grades = new Array();
var answers = new Array();
var fmts = new Array();
var spents = new Array();
var foucsarr = new Array();
var timenow = (new Date()).getTime();
var f1 = document.form1;
var savedQuizName = (orgnum%65536) + '-' +    f1.course.value + "-" + f1.assignname.value + '-' + f1.sid.value ;
 
function checksum(x)
{
    if (x == null || x == '') return 0;
    x = x.replace(/^[ ]+/,'').replace(/[ ]+$/,'');
    var s = 0;
    var i = 0;
    for (var j=0; j < x.length; j++)
    {
        if (x.charAt(j) == '\n' || x.charAt(j) == '\r') continue;
        s += (++i)*x.charCodeAt(j);
    }
    return s;
}
function checktxt(x)
{
    if (x == null || x == '') return true;
    x = x.replace(/^[ ]+/,'').replace(/[ ]+$/,'');
    var j1 = x.indexOf('\n'); 
    var j2 = x.indexOf('\r');
    if (j1 == -1 && j2 ==-1) return false;
    else if (j1==-1 && j2>0 || j2>0 && j1>0 && j2 < j1)
         j1 = j2;  
    var i = parseInt(x.substring(0,j1));
    
    if ('' +i == 'NaN') return false;
    return i == checksum(x.substring(j1+1));
}
function removejs(str)
{
    if (str == null)
        return null;
    var rg, rg1;
    for (var q = 0; q < 3; q++)
    {
        if (q == 0)
        {
            rg = new RegExp(/<scr.pt[^>]*>/i);
            rg1 = new RegExp(/<\/script[ ]*>/i);
        }
        else if (q == 1)
        {
            rg = new RegExp(/<embed[^>]*>/i);
            rg1 = new RegExp(/<\/embed[ ]*>/i);
        }
        else
        {
            rg = new RegExp(/<object[^>]*>/i);
            rg1 = new RegExp(/<\/object[ ]*>/i);
        }


        var k = 0, k1 = 0;
        var s = '';
        var m = rg1.exec(str);
        if (m != null)
        {
            k1 = m.index + m.toString().length;
            m = rg.exec(str);
            if (m != null && k1 <= m.index)
                k = k1;
        }
        while (k < str.length)
        {
            m = rg.exec(str.substring(k));
            if (m == null)
                return s + str.substring(k);

            s += str.substring(k, k + m.index);
            var j = m.index + k + 8;
            var n = rg1.exec(str.substring(j));
            if (n == null)
                return s;

            k = n.index + n.toString().length + j;
        }
        if (q < 2)
            str = s;
    }
    return s;
}
var resz = function(n)
{
     if (n == null) n = 0;
     var tbl = document.getElementById("maintbl");
     if (tbl==null || tbl.rows.length == 0) return;
     var l = tbl.rows[0].cells[0].offsetWidth;
     var tas = f1.getElementsByTagName("textarea");
     var anw = 90;
     for (var i=0; i < tas.length; i++)
     {
         var x = tas[i].parentNode.parentNode.parentNode;
         if (x.tagName.toLowerCase()!='table')x = x.parentNode;
         if (x.rows.length == 4) anw = 105;
     }
 }
function guessFormat(t)
{
     if (t.indexOf("$")>=0 && t.indexOf("\\")>0)
         return 2;
     if ( t.indexOf("</")>=0) 
         return 1;
     return 0;
}
 
function displaytxt(ta,evt,j)
{
    
}
function doonfocus(txt,kk)
{
     foucsarr[kk] = (new Date()).getTime();
}

function doonblurhelp(txt,kk,xx)
{
     var fmt=4;
     if (typeof(txt.type)=='undefined' || txt.type.toLowerCase()!='radio')
     {
         fmt = guessFormat(txt.value);
     }
     fmts[kk] = fmt;
     var x = (new Date()).getTime();
      
     if (foucsarr[kk] == null) 
     {
         foucsarr[kk] = timenow;
     }
     spents[kk] = Math.round( (x  - foucsarr[kk])/1000);
     timenow =  x;
     answers[kk] = xx;
     composecsv(); 
     localStorage[savedQuizName] = Math.round( (new Date()).getTime()/1000) + "," + sofar;
     window.onbeforeunload = nosaved;
    
}
function doonblur(txt,kk)
{
 if (txt.value=='') return;
 txt.value = removejs(txt.value);
 var xx = txt.value.replace(/[\s]*$/,'');
 doonblurhelp(txt,kk,xx);
}

function doonblurb(txt,kk, N)
{
     if (txt.value=='') return;
     txt.value = txt.value.replace(/[\s]*$/,'');
     txt.value = removejs(txt.value);
     var xx='';

     for (var j=0; j < N; j++)
     {
         if (xx!='')xx += '\n';
         eval("xx +=  f1.q" + kk +"_" + j +".value");
     }
     answers[kk] =  xx ;
     
     eval("f1.q" + kk +".value='" + xx.replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'");
     doonblurhelp(txt,kk,xx);
}
function composecsv()
{
    sofar = '';
    var i;
    for ( i=0;  i <= maxorder; i++)
    { 
        if (answers[i] == null) continue;
        if (sofar != '')  sofar += "\n";
        if (answers[i].indexOf(",") >= 0 || answers[i].indexOf("\r") >= 0 || answers[i].indexOf("\n") >= 0)
           sofar +=   i + "," + "'" + answers[i].replace(/'/g, "''") + "'";
        else
           sofar +=   i + ","   + answers[i];
        if(spents[i] == null) { spents[i] =10;}
        sofar=sofar + ',' + spents[i];  
        sofar=sofar + ',' + fmts[i];
        
    }
    f1.temptxt.value = checksum(sofar) + '\n' + sofar;
}
function onradioclick(txt,kk,N)
{
     fmts[kk] = 4;
     doonblurhelp(txt,kk,txt.value);
     timenow = (new Date()).getTime();
}
function tdstr(n)
{
       return  '<table border="0" align="center" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td width="2"></td><td colspan="1" height="2"></td><td width="2"></td></tr><tr><td width="2"></td><td align="left" valign="top" style="border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;"><table width="100%" class="quesans"><tbody><tr><td width="30" valign="top"><!--' 
        + n
       + '--><b>' + n + '.</b> </td><td align="left" width="100%" class="quesans" valign="top">'
       + question 
       + n 
       + '</td></tr><tr><td align="left" class="quesans" valign="top" rowspan="2"></td><td valign="top" class="quesans" align="left">'
       + '<textarea name="q' + n + '" cols="10" class="blanklook" rows="3" onfocus="doonfocus(f1.q' + n + ',' + n + ');resz()" onblur="doonblur(this,' + n + ')" onkeypress="return displaytxt(this,event,' + n + ')" style="width:99%"></textarea></td></tr><tr><td valign="top" align="left" class="quesans"><div style="border:1px" id="showarea' + n + '"></div></td></tr></tbody></table></td><td width="2"><div></div></td></tr>'
       + '<tr height="5"><td width="2"></td><td><div style="width:100%;height:2px;background-color:transparent;cursor:s-resize"></div></td><td width="2"><div style="width:2px;height:2px;background-color:transparent;cursor:se-resize"></div></td></tr></tbody></table>'
} 
function addone()
{
    var x = document.getElementById( "maintbl");
    var r = x.insertRow(-1);
    var c = r.insertCell(-1);
    c.innerHTML = tdstr(++maxorder);
    myprompt(maxorder + " questions")
}
function CSVParse()
{
    this.str = '';
    this.quote = "\"";
    this.separates = [',', '\r\n'];
    this.previousOffset = -1;
    this.PREQUOTE = 0;
    this.QUOTE = 1;
    this.UNQUOTE = 2;
    this.POSTQUOTE = 3;
    this.NAKED = 4;
    this.FILEEND = 5;
    this.ERROR = 6;
    this.DIMENSIONEND = [7, 8];
    this.states =
            [
                /*PREQUOTE  = 0*/  [0, 1, 4, 5, 7],
                /*QUOTE     = 1*/  [1, 2, 1, 6, 1],
                /*UNQUOTE   = 2*/  [3, 1, 6, 5, 7],
                /*POSTQUOTE = 3*/  [3, 6, 6, 5, 7],
                /*NAKED     = 4*/  [4, 4, 4, 5, 7],
                /*FILE END  = 5*/  [5, 5, 5, 5, 5],
                /*ERROR     = 6*/  [6, 6, 6, 6, 6],
                /*DIM1 END  = 7*/  [0, 1, 4, 5, 7]

            ];
    this.state = this.PREQUOTE;
    this.pstate;
    this.ppOffset = -1;
    this.ppstate = 0;
    this.index = [0, 0];
    this.numSeparates = 2;

    if (arguments.length > 0)
    {
        this.str = arguments[0];
    }
    if (arguments.length >= 2)
    {
        this.quote = arguments[1];
    }
    if (arguments.length >= 3)
    {
        if (arguments[2] != null)
        {
            this.numSeparates = arguments.length - 2;
            this.separates = new Array(this.numSeparates);
            for (var i = 0; i < arguments.length - 2; i++)
                this.separates[i] = arguments[i + 2];
            this.index = new Array(this.numSeparates);
            for (var j = 0; j < this.numSeparates; j++)
                this.index[j] = 0;
        }
        else
        {
            this.numSeparates = 0;
            this.separates = null;
            this.numSeparates = 0;
        }
    }
    if (this.numSeparates > 0)
    {
        this.DIMENSIONEND = new Array(this.numSeparates);
        for (var i = 0; i < this.numSeparates; i++)
            this.DIMENSIONEND[i] = (7 + i);
    }

    this.transit = function(charCode)
    {
        if (this.state == this.FILEEND || this.state == this.ERROR || this.state == this.QUOTE && charCode >= 4)
        {
            return;
        }

        var diff = 0;
        if (charCode >= 4)
        {
            diff = charCode - 4;
            charCode = 4;
        }
        var v = this.state;
        if (v >= this.DIMENSIONEND[0])
            v = 0;
        this.state = this.states[v][charCode] + diff;

    };

    this.checkError = function(b)
    {
        if (b)
        {
            this.states[1][3] = this.states[2][2] = this.states[3][1] = this.states[3][2] = this.ERROR;
        }
        else
        {
            this.states[1][3] = FILEEND;
            this.states[2][2] = this.states[3][1] = this.states[3][2] = this.POSTQUOTE;
        }
    };


    this.code = function(c)
    {
        if (c == ' ')
        {
            return 0;
        }
        if (c == this.quote)
        {
            return 1;
        }
        for (var i = 0; i < this.numSeparates; i++)
        {
            if (this.separates[i].indexOf("" + c) >= 0)
            {
                return  (i + 4);
            }
        }

        return 2;

    };

    this.putBack = function()
    {
        this.previousOffset = this.ppOffset;
        this.state = this.ppstate;
    }
    this.nextElement = function()
    {
        this.ppOffset = this.previousOffset;
        this.ppstate = this.state;
        if (this.state == this.FILEEND || this.state == this.ERROR)
        {
            return null;
        }
        var k;
        var c = ' ';
        var i = this.previousOffset;
        var charCode;

        var j = i + 1;
        var ans = '';
        while (true)
        {
            i++;
            if (i < this.str.length)
            {
                c = this.str.charAt(i);
                charCode = this.code(c);
            }
            else
            {
                charCode = 3;
            }

            /*
             if ( (this.state == this.PREQUOTE || this.state > (this.ERROR + 1) ) && charCode > 4) 
             {
             continue;
             }*/
            this.pstate = this.state;
            this.transit(charCode);

            switch (this.state)
            {
                case this.PREQUOTE:
                case this.NAKED:
                    break;
                case this.QUOTE:
                    if (this.pstate == this.UNQUOTE)
                    {
                        j = i;
                    }
                    else if (this.pstate != this.QUOTE)
                    {
                        j = i + 1;
                    }
                    break;
                case this.UNQUOTE:
                    if (i > j)
                        ans += this.str.substring(j, i);
                    break;
                case this.POSTQUOTE:
                    break;
                case this.ERROR:
                    return null;
                default:
                    this.previousOffset = i;
                    k = this.state - 7;
                    if (k < 0)
                    {
                        k = this.numSeparates - 1;
                    }
                    for (var l = 0; l < k; l++)
                        this.index[l] = 0;
                    if (k >= 0)
                        this.index[k]++;

                    if (this.pstate == this.UNQUOTE || this.pstate == this.POSTQUOTE)
                    {
                        return ans;
                    }
                    else
                    {
                        if (i > j)
                            return this.str.substring(j, i);
                        else
                            return '';
                    }
            }
        }
    };

    this.getState = function()
    {
        return this.state;
    };
    this.getPstate = function()
    {
        return this.pstate;
    };
    this.setString = function(s)
    {
        this.str = s;
    };
    this.setSeparates = function(s, i)
    {
        if (i == null)
        {
            if (s != null)
            {
                this.separates = s;
                this.numSeparates = s.length;
                this.index = new Array(this.numSeparates);
                for (var j = 0; j < this.numSeparates; j++)
                    this.index[j] = 0;
            }
            else
            {
                this.separates = null;
                this.numSeparates = 0;
                this.index = null;
            }
        }
        else if (i < this.numSeparates)
            this.separates[i] = s;
        this.state = this.PREQUOTE;
        this.previousOffset = -1;
    };
    this.setQuote = function(q)
    {
        this.quote = q;
        this.state = this.PREQUOTE;
        this.previousOffset = -1;
    };

    this.nextInt = function()
    {
        if (this.state == this.FILEEND)
            return null;
        var x = parseInt(this.nextElement());
        if ('' + x == 'NaN')
            return null;
        return x;
    };
    this.nextFloat = function()
    {
        return parseFloat(this.nextElement());
    };

    this.beyong = function(x)
    {
        if (x == null || this.index == null || x.length != this.index.length)
        {
            return false;
        }
        for (var k = x.length - 1; k >= 0; k--)
            if (this.index[k] < x[k])
                return true;
        return false;
    };
    this.elementAt = function(x)
    {
        while (this.beyong(x))
        {
            this.nextElement();
        }
        return this.nextElement();
    };
    this.hasSeparate = function(v)
    {
        for (var i = 0; i < this.numSeparates; i++)
        {
            for (var j = 0; j < this.separates[i].length; j++)
                if (v.indexOf(this.separates[i].charAt(j)) >= 0)
                    return true;
        }
        return false;
    };
    this.compose = function(v)
    {
        if (v == null)
            return v;
        if (this.hasSeparate(v))
            return this.quote + this.doubleQuote(v) + this.quote;
        return v;
    };

    this.doubleQuote = function(v)
    {
        var j = v.indexOf(this.quote);
        if (j == -1)
            return v;
        if (j == v.length - 1)
            return v + this.quote;
        return v.substring(0, j + 1) + this.quote + this.doubleQuote(v.substring(j + 1));

    };
    this.setStr = function(x, v, ifadd)
    {
        if (x == null || this.index == null || x.length != this.index.length || this.str == null)
        {
            return;
        }
        this.reset();
        while (this.beyong(x))
        {
            this.nextElement();
        }

        v = this.compose(v);
        if (ifadd == false)
        {
            var ll = this.previousOffset + 1;
            this.str = this.str.substring(0, ll) + v + this.str.substring(this.previousOffset);
        }
        else if (this.previousOffset > -1)
        {
            this.str = this.str.substring(0, this.previousOffset + 1) + v + this.separates[0].charAt(0) + this.str.substring(this.previousOffset + 1);
        }
        else
        {
            this.str = v + this.separates[0].charAt(0) + this.str;
        }
    };

    this.nextRow = function()
    {

        if (this.state == this.FILEEND || this.state == this.ERROR || this.str == null)
            return null;
        var v = new Array();
        do
        {
            v[v.length] = this.nextElement();
        }
        while (this.state == this.DIMENSIONEND[0]);

        return v;
    }
}

function parseit(sofar)
{ 
     
    var parse = new CSVParse(sofar, "'", ",", "\r\n");
    var ar = null;
    var nur = 0;
   
    while ( (  ar = parse.nextRow()) != null)
    {
        nur++;
         
        var kk = parseInt(ar[0]);
        answers[kk] = ar[1];
        if (kk > maxorder)
        {
            addone();
        }
        if (ar[3]==null || '' + ar[3] == 'NaN' ) ar[3] = guessFormat(ar[1]);
        if (ar[2]==null || '' + ar[2] == 'NaN') ar[2] = 1;
        if (fmts[kk]!=4) fmts[kk] = ar[3];
        spents[kk] = parseInt(ar[2]);
        if ('' + spents[kk] == 'NaN')
            spents[kk] = 1;
        else if (spents[kk] > 1000000)
            spents[kk] = 1000000;
        grades[kk] = -1;
        if (ar[5]!=null) grades[kk] =parseInt(ar[5]);
       
    }
    

    var len = f1.elements.length;
    var lastk = 0;
    for (var i = 0; i < len; i++)
    {

        var x = f1.elements[i];
        if (x==null || typeof(x.name) == 'undefined')
            continue;
        var nstr = x.name;

        if (nstr.length < 2)
            continue;
        var kk = parseInt(nstr.substring(1));
        if (''+ kk == 'NaN' || answers[kk] == null) continue;
       
        if (x.type.toLowerCase() == 'radio')
        {
            if (answers[kk] == x.value )
            {
                x.checked = true;
                
            }
            
        }
        else  if ( x.tagName.toLowerCase() == 'textarea' || x.tagName.toLowerCase() == 'input' && x.type.toLowerCase() == 'hidden')
        {
            var v = answers[kk];
            var fmt = fmts[kk];
            var sha = document.getElementById("showarea" + kk);
           
            if (fmt!=0 && sha!=null) sha.innerHTML = v;
            x.value = v;
            if (x.tagName.toLowerCase() == 'textarea')
            {
                var rw = v.split(/[\r|\n]+/).length ;
                if (rw > 3) x.rows = rw;
            }
            if (x.tagName.toLowerCase() == 'input')
            {
                var fills = v.split(/[\r|\n]+/);
                for (var j = 0; j < fills.length; j++) 
                {
                      eval("f1." + x.name + "_" + j + ".value=\"" + fills[j].replace(/"/g, '\\"') + "\";");
                }
            }
        }
    }
}
function parsepaste()
{
    var x = f1.temptxt.value;
    if (checktxt(x) == false)
    {
        document.getElementById('error').innerHTML = msg1468;
        return;
    }
    document.getElementById('error').innerHTML = '';
    parseit(x.replace(/^[ |\\-|0-9]+[\r|\n]+/,''));
}
var onloadbeforequizback = null;
if (typeof window.onload == 'function') 
    onloadbeforequizback = window.onload;

window.onload =  function()
{
    if (onloadbeforequizback!=null)
        onloadbeforequizback();
    var x = localStorage[savedQuizName];
    if (x!=null) 
    {
        x = x.replace(/^[^,][^,][^,][^,][^,]+,/,'');
        parseit(x);
        f1.temptxt.value = checksum(x) + '\n' + x;
       
    }
    var y = localStorage['mysid'];
    if (y != null) document.form1.sid.value = y;
    document.form1.sid.onchange = function(){localStorage['mysid'] = this.value;};
};

function nosaved()
{
    return msg1469; 
}

 
 

