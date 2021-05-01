function download_file(name) {
        let mime_type =  "text/csv";
        let contents = $('csv').value;
        var blob = new Blob([contents], {type: mime_type});

        var dlink = document.createElement('a');
        dlink.download = name;
        dlink.href = window.URL.createObjectURL(blob);
        dlink.onclick = function(e) {
            // revokeObjectURL needs a delay to work properly
            var that = this;
            setTimeout(function() {
                window.URL.revokeObjectURL(that.href);
            }, 1500);
        };

        dlink.click();
        dlink.remove();
    }    
function download(t)
{
   var d  = new Date(); 
let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    
   var fn = ye + mo + da;
   myprompt('Enter the file name:', fn + '.csv', 'download_file(v)', 'Download'); 
}
function $(x){return document.getElementById(x);}
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
            for (let i = 0; i < arguments.length - 2; i++)
                this.separates[i] = arguments[i + 2];
            this.index = new Array(this.numSeparates);
            for (let j = 0; j < this.numSeparates; j++)
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
        for (let i = 0; i < this.numSeparates; i++)
            this.DIMENSIONEND[i] = (7 + i);
    }

    this.transit = function(charCode)
    {
        if (this.state == this.FILEEND || this.state == this.ERROR || this.state == this.QUOTE && charCode >= 4)
        {
            return;
        }

        let diff = 0;
        if (charCode >= 4)
        {
            diff = charCode - 4;
            charCode = 4;
        }
        let v = this.state;
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
    
    this.ignorespace = true;
    
    this.code = function(c)
    {
        if (  c == ' ')
        {
            return 0;
        }
        if (c == this.quote)
        {
            return 1;
        }
        for (let i = 0; i < this.numSeparates; i++)
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
        if (this.str==null || this.state == this.FILEEND || this.state == this.ERROR)
        {
            return null;
        }
        let k;
        let c = ' ';
        let i = this.previousOffset;
        let charCode;
        let i1,j1;
        let j = i + 1;
        let ans = '';
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
                    {
                         
                        ans += this.str.substring(j, i);
                    }
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
                    for (let l = 0; l < k; l++)
                        this.index[l] = 0;
                    if (k >= 0)
                        this.index[k]++;

                    if (this.pstate == this.UNQUOTE || this.pstate == this.POSTQUOTE)
                    {
                        if (this.ignorespace == false && this.str.charAt(this.ppOffset+1)==' ')
                        {
                           ans = ' ' + ans;
                        }
                        return ans;
                    }
                    else
                    {
                        if (i > j)
                        {
                            if (this.ignorespace == false && j>0 && this.str.charAt(j-1)==' ')
                            {
                                j--;
                            }
                            return this.str.substring(j, i);
                        }
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
                for (let j = 0; j < this.numSeparates; j++)
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
        let x = parseInt(this.nextElement());
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
        for (let k = x.length - 1; k >= 0; k--)
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
        for (let i = 0; i < this.numSeparates; i++)
        {
            for (let j = 0; j < this.separates[i].length; j++)
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
        let j = v.indexOf(this.quote);
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
            let ll = this.previousOffset + 1;
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
        let v = new Array();
        do
        {
            v[v.length] = this.nextElement();
        }
        while (this.state == this.DIMENSIONEND[0]);

        return v;
    }
    this.nextMatrix = function(ignoreblank)
    {

        if (this.state == this.FILEEND || this.state == this.ERROR || this.str == null)
            return null;
        let v = new Array();
        do
        {
            let y = this.nextRow();
            if (y.length > 1 || y[0] != null && y[0] != '' || ignoreblank == null || ignoreblank == false)
                v[v.length] = y;

        }
        while (this.state == this.DIMENSIONEND[1]);
        return v;
    }
    this.tohtml = function()
    {
        let x = this.nextMatrix();
        let num = [];
        for (let j=0; j < x[0].length+10; j++)
        {
            num[j] = true;
            if (x.length < 2) num[j] = false;
            for (let i=1; i < x.length; i++)
            {
                if (j >= x[i].length) continue;
                if (x[i][j]!=null && x[i][j]!='' && isNaN(x[i][j]))
                {
                    num[j] = false; break;
                }
            }
        }
        let s = '<table border=1 style="border-collapse:collapse" >';
        for (let i = 0; i < x.length; i++)
        {
            s += "<tr height=28>";
            for (let j = 0; j < x[i].length; j++)
            {
                let sp=1; for (let k=j+sp; k < x[i].length && x[i][k] == null; k++,sp++);
                s += "<td " + (num[j]?"align=right ":"align=left ") + ((sp==1)?"":"colspan=" + sp) + ">" + x[i][j] + '</td>';
            }
            s += "</tr>";
        }
        return s + "</table>";
    }
    this.toStr = function(m2d, quote, columnseparate, rowseparate)
    {
       this.str = '';
       for(let i = 0; i < m2d.length; i++)
       {
          if (i>0) 
              this.str += rowseparate;
          for (let j = 0; j < m2d[i].length; j++)
          {
              if (j > 0)
                 this.str += columnseparate;
              this.str += quote + (m2d[i][j]==null?"":m2d[i][j].replace(new RegExp(quote, "ig"),quote + quote)) + quote;
          }
       }
    }
}
var m;
var temp;
let oldt = new Array();
let allregs = [];
function replace()
{
   let t = $('csv');
   let b = $('view');
   let undo = $('undo');
   if (b.value == 'Back') view(b);
   let s =  $('sourcechar');
   let c =  $('targetchar');
   let a = $('regex');
   var rs = localStorage['reglist']; // search a piece of data named relist in cache/ harddrive
   if (rs == null)
       allregs = []; 
   else
       allregs = JSON.parse(rs);
   for (var i =0; i< allregs.length; i++)
       if (allregs[i][0] == s.value) 
           break;
   if ( i == allregs.length)
   {
       allregs.splice(0,0,[s.value, c.value, ($('regex').checked)]);
       if (allregs.length > 25)
           allregs.splice(allregs.length-1,1);
       localStorage['reglist'] = JSON.stringify(allregs);
       var newitem = document.createElement('option');
       newitem.value = s.value;
       var lt = $('reglist').childNodes;
       if (lt ==null || lt.length == 0)
           $('reglist').append(newitem);
       else
           $('reglist').insertBefore(lt[0],newitem);
       $('sourcechar').list = 'reglist';
       
   }
   if (a.checked)
   try
   {
     let r = new RegExp(s.value, "gi");
     
     oldt[oldt.length] = t.value;
     t.value = t.value.replace(r, c.value);
     undo.style.visibility = 'visible'; 
   }
   catch(e){}
   else
   {
     oldt[oldt.length] = t.value;
     t.value = replaceAll(t.value, s.value, c.value, true);
     undo.style.visibility = 'visible';  
   }
}
function replaceAll(str, find, newToken, ignoreCase)
{
    let i = -1;

    if (!str)
    {
        // Instead of throwing, act as COALESCE if find == null/empty and str == null
        if ((str == null) && (find == null))
            return newToken;

        return str;
    }

    if (!find) // sanity check 
        return str;

    ignoreCase = ignoreCase || false;
    find = ignoreCase ? find.toLowerCase() : find;

    while ((
        i = (ignoreCase ? str.toLowerCase() : str).indexOf(
            find, i >= 0 ? i + newToken.length : 0
        )) !== -1
    )
    {
        str = str.substring(0, i) +
            newToken +
            str.substring(i + find.length);
    } // Whend 

    return str;
}
function undo(btn)
{
   let t = $('csv');
   if (oldt.length>=1)
   {
   t.value = oldt[oldt.length-1];
   oldt.splice(oldt.length-1,1);
   if (oldt.length == 0)
      btn.style.visibility = 'hidden'; 
   }
}
function view(btn)
{
   let t = $('googlesource');
   if (btn.value == 'View Tab')
   {
      temp = t.value;
      btn.value  = 'Back';
      t.value = t.value.replace(/\t/g,'\\t   ').replace(/\n/g,'\\n\n').replace(/\r/g,'\\r');
   }
   else
   {
       t.value = temp;
       btn.value = 'View Tab';
   }
}
function proc(v)
{
    if (v == '\\t') return '\t';
    else if (v == '\\n')return '\n';
    else if (v == '\\r\\n')return '\r\n';
    else return v;
}
function parse()
{
let tx = document.getElementById('csv');
let cols = proc($('column').value);
let rows = proc($('row').value);
let des =  proc($('de').value);
m = (new CSVParse(tx.value, des, cols, rows)).nextMatrix();

let autos = ' auto';
for (let i=0; i < m[0].length; i++)
  autos += ' auto';
var str = "<div  class=heading><div id=t2  onclick=insertRow(0)></div><div id=t1 onclick=insertCol(0)></div></div>";
for (var j=0; j < m[0].length; j++)
{
   str += "<div class=heading style=width:98px;text-align:left;background-color:#888;text-align:center onmouseenter=menu("+ (j+1) + ") onmouseout=hidemenu() onclick=insertCol(" + (j+1) + ") >" + String.fromCharCode('A'.charCodeAt(0)+j) + "</div>"; 
}
$('editing').style.gridTemplateColumns = autos.substring(1);
 
for (var i=0; i < m.length; i++)
{
   str += "<div  class=heading  onmouseenter=menu("+ (i+1) + ",'r') onmouseout=hidemenu()  onclick=insertRow(" + (i+1) + ")>" + (i+1) + "</div>"; 
   for (var j=0; j < m[i].length; j++)
   {
      if (m[i][j] == null) m[i][j] = '';
      str += "<input id=" + i + "_" + j + " onblur=update() value=\"" + m[i][j].replace(/"/g, '\\"') + "\" style=width:100px>";
   }
}
$('editing').innerHTML = str;
}

function menu(i, r)
{
     
    
}
function hidemenu()
{
    
}
function insertCol(j)
{
    
}
function update()
{
   $("csv").value = back();
}
function back()
{
   let cols = proc($('column').value);
   let rows = proc($('row').value);
   let des =  proc($('de').value);
   var text = '';
   let r = 0, c = 0;
   while(true)
   {
       c = 0;
       while (true)
      {
         let ele = $(r + '_' + c);
         if (ele == null)
         {
            if (c == 0) 
                return text;
            else
            {  r++; c= 0;}
         }
         else
         {
             m[r][c] = ele.value;
             if (c == 0) 
             {
                if (r > 0) text += rows;
             }
             else
             {
                 text += cols;
             }
             text += des + ele.value.replace(des,des+des) + des;
             c++;
         }

      }

   }
   return text;
}
function insertRow(j)
{
    m.splice(j,0,new Array(m[0].length));
    var p = new CSVParse();p.toStr(m,'"',",","\n");
    $('csv').value = p.str;
    parse();
}
function insertCol(j)
{
    for (let i=0; i < m.length; i++)
    {
       m[i].splice(j,0,"");  
    }
    
    var p = new CSVParse(); 
    p.toStr(m,'"',",","\n")
    $('csv').value = p.str;
    parse();
}
onload = function()
{
    let w = thispagewidth();
    $('csv').style.width = (w - 210) + 'px';
    parse();
}
onresize = function()
{
   $('csv').style.width = '10px';
   let w = thispagewidth();
   $('csv').style.width = (w - 210) + 'px'
}


