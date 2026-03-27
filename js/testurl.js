function testcodes(url) {
    if (url ===null)  url = "https://zhongyanlin.pythonanywhere.com/codes";
    
    function process(text) {
        // Check if the response is a 20x5 table of codes
        const lines = text.trim().replace(/.*<tr[^>]*>/i,'').replace(/<.table>.*$/i,'</table>').split(/tr[^>]*>/i);
       codes.clear();
        let isValid = true;

        // Check for 20 rows
        if (lines.length !== 20) {
            isValid = false;
        }

        // Extract codes from each line (assuming 5 codes per line)
        for (const line of lines) {
            const rowCodes = line.trim().replace(/<.td>$/,'').split(/<.td>/).map(x=>x.replace(/<[^>]+>/g,'')); // Split by whitespace
            if (rowCodes.length !== 5) {
                isValid = false;
                break;
            }
            codes.push(...rowCodes);
        }

        // Check for 100 unique 10-character codes
        if (codes.length !== 100 || new Set(codes).size !== 100) {
            isValid = false;
        }

        // Check each code is 10 letters/digits
        for (const code of codes) {
            if (!/^[A-Za-z0-9]{10}$/.test(code)) {
                isValid = false;
                break;
            }
        }

        return isValid;
    }

    // Synchronous AJAX call
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, false); // Synchronous (blocking)
    try {
        xhr.send();
        if (xhr.status === 200) {
            return process(xhr.responseText);
        } else {
            console.log(url + ": fail (HTTP " + xhr.status + ")");
            return false;
        }
    } catch (e) {
        console.log(url + ": fail (Network Error)");
         return false;
    }
}
const codes = []; 
 

async function testsignin(url) {
    if(null ===url) url = "https://zhongyanlin.pythonanywhere.com/signin";
    
    function process(text) {
        text = text.toLowerCase();
        const hasForm = text.includes('<form') && 
                        text.includes('action="/verify"') && 
                        (text.includes('method="post"') || text.includes('method=post'));
        
        const hasSidInput = text.includes('name="sid"') || text.includes('name=sid');
        const hasCodeInput = text.includes('name="code"') || text.includes('name=code');

        const isValid = hasForm && hasSidInput && hasCodeInput;
        console.log(url + (isValid ? ": pass" : ": fail"));
        return isValid;
    }

   
    try {
        const response = await fetch(url);
        if (response.ok) {
            const text = await response.text();
            return process(text);
        } else {
            console.log(url + ": fail (HTTP " + response.status + ")");
            return false;
        }
    } catch (e) {
        console.log(url + ": fail (Network Error)");
        return false;
    }
}

async function testverify(url) {
    if(null ===url) url = "https://zhongyanlin.pythonanywhere.com/verify?sid=D10000000?code=";
    let rand = Math.round(Math.random()*100); if (rand == 100) rand--;
    ACODE = codes[rand];
    url = url.replace(/code=.*$/,'') + 'code=' + ACODE;
    function process(text) {
        text = text.trim();
        const isValid = (text === "You are successfully signed in");
        console.log(url + (isValid ? ": pass" : ": fail"));
        return isValid;
    }

   
    try {
        const response = await fetch(url);
        if (response.ok) {
            const text = await response.text();
            return process(text);
        } else {
            console.log(url + ": fail (HTTP " + response.status + ")");
            return false;
        }
    } catch (e) {
        console.log(url + ": fail (Network Error)");
         return false;
    }
}

let ACODE;
 
async function testverify1(url) {
    if(null ===url) url = "https://zhongyanlin.pythonanywhere.com/verify?sid=D10000001?code=";
    url = url.replace(/code=.*$/,'') + 'code=' + ACODE;
    function process(text) {
        text = text.trim();
        const isValid = (text === 'The code is used by " D10000000 " and  can not be shared');
        console.log(url + (isValid ? ": pass" : ": fail"));
        return isValid;
    }

   
    try {
        const response = await fetch(url);
        if (response.ok) {
            const text = await response.text();
            return process(text);
        } else {
            console.log(url + ": fail (HTTP " + response.status + ")");
             return false;
        }
    } catch (e) {
        console.log(url + ": fail (Network Error)");
         return false;
    }
}
 
async function testverify2(url) {
    if(null ===url) url = "https://zhongyanlin.pythonanywhere.com/verify?sid=D10000000?code=";
    let WRONGCODE = "111111111111111111";
    url = url.replace(/code=.*$/,'') + 'code=' + WRONGCODE;
    function process(text) {
        text = text.trim();
        const isValid = (text === 'Wrong code entered');
        console.log(url + (isValid ? ": pass" : ": fail"));
         return isValid;
    }

   
    try {
        const response = await fetch(url);
        if (response.ok) {
            const text = await response.text();
           return process(text);
        } else {
            console.log(url + ": fail (HTTP " + response.status + ")");
             return false;
        }
    } catch (e) {
        console.log(url + ": fail (Network Error)");
         return false;
    }
}

async function testattended(url) {
    if(null ===url) url = "https://zhongyanlin.pythonanywhere.com/attended";
    
    function process(text) {
        text = text.trim();
        const isValid = (text.includes('D100000'));
        console.log(url + (isValid ? ": pass" : ": fail"));
         return isValid;
    }

   
    try {
        const response = await fetch(url);
        if (response.ok) {
            const text = await response.text();
           return process(text);
        } else {
            console.log(url + ": fail (HTTP " + response.status + ")");
             return false;
        }
    } catch (e) {
        console.log(url + ": fail (Network Error)");
         return false;
    }
}

function testall(url,sid)
{
   url = url.replace(/com.*$/,'com/');
   let t1 = testcodes(url + 'codes');
   let t2 = testsignin(url + 'signin'); 
   let t3 = testverify(url + 'verify?sid=D10000000?code='); 
   let t4 = testverify1(url + 'verify?sid=D10000001?code='); 
   let t5 = testverify2(url + 'verify?sid=D10000000?code='); 
   let t6 = testattended(url + 'attended'); 
   let assess = '1,3,' + (t1?3:0) + ',;2,3,' + (t2?3:0) + ',;3,3,' + ((t3?1:0) + (t4?1:0) + (t5?1:0)) + ',;4,3,' + (t6?3:0) + ',';
   let grade = (t1?3:0)   + (t2?3:0)  + ((t3?1:0) + (t4?1:0) + (t5?1:0))   + (t6?3:0);
   console.log(sid + " " + assess + " " + grade);
}

let d = [["D10773831","https://bb.pythonanywhere.com/codes"], 
["D10773834","https://kunkun82.pythonanywhere.com/codes"],                                                                                                                                                                                     
["D10773836","https://leaster.pythonanywhere.com/codes"],                                                                                                                                                                                      
["D10773837","https://simple666.pythonanywhere.com/codes"],                                                                                                                                                                                    
["D10773839","https://chenyuer.pythonanywhere.com/codes"],                                                                                                                                                                                     
["D10773954","https://oliiver.pythonanywhere.com/codes"],                                                                                                                                                                                      
["D10773955","https://anyuan.pythonanywhere.com/codes"],                                                                                                                                                                                       
["D10773959","https://05Moki.pythonanywhere.com/codes"],                                                                                                                                                                                       
["D10773962","https://dogixx.pythonanywhere.com/codes"],                                                                                                                                                                                       
["D10773971","https://fanglicheng.pythonanywhere.com/codes"],                                                                                                                                                                                  
["D10773972","https://beibeifang.pythonanywhere.com/codes"],                                                                                                                                                                                   
["D10773977","https://s1lentxd.pythonanywhere.com/codes"],                                                                                                                                                                                     
["D10773978","https://niko666.pythonanywhere.com/codes"],                                                                                                                                                                                      
["D10773982","https://wild114old514.pythonanywhere.com/code"]                                                                                                                                                                                 
["D10774000","https://MattW1123.pythonanywhere.com/codes"],                                                                                                                                                                                    
["D10774001","https://huangyihan.pythonanywhere.com/codes"],                                                                                                                                                                                   
["D10774006","https://www.pythonanywhere.com/user/jianglan07/"]                                                                                                                                                                               
["D10774008","https://xiaoqiang.pythonanywhere.com/codes"],                                                                                                                                                                                    
["D10774009","https://555555555ddddddddd.pythonanywhere.com/codes"],                                                                                                                     
["D10774014","https://jpzzz.pythonanywhere.com/codes"],                                                                                                                                                                                        
["D10774023","https://niamu1.pythonanywhere.com/codes"],                                                                                                                                                                                       
["D10774024","https://lonnie666.pythonanywhere.com/codes"],                                                                                                                                                                                    
["D10774027","https://24406040240.pythonanywhere.com/codes"],                                                                                                                                                                                  
["D10774033","https://Liamlaung.pythonanywhere.com/codes"],                                                                                                                                                                                    
["D10774035","https://d10774035.pythonanywhere.com/codes"],                                                                                                                                                                                    
["D10774042","https://xiaye777.pythonanywhere.com/codes"],                                                                                               
["D10774043","https://haoo.pythonanywhere.com/codes"],                                                                                                                                                                                         
["D10774051","https://dragonking520.pythonanywhere.com/codes"],                                                                                                                                      
["D10774052","https://leaster.pythonanywhere.com/codes"],                                                                                                                                                                                      
["D10774053","https://a380fj.pythonanywhere.com/codes"],                                                                                                                                                                                       
["D10774055","https://lzoozlk.pythonanywhere.com/codes"],                                                                                                                                                                                      
["D10774057","https://luxiangwei0604.pythonanywhere.com/codes"],                                                                                                                                                                               
["D10774061","https://cnm666.pythonanywhere.com/codes"],                                                                                                                                                                                       
["D10774076","https://hhhc.pythonanywhere.com"]                                                                                                                                                                                               
["D10774085","https://zhiruoq.pythonanywhere.com/codes"],                                                                                                                                                                                      
["D10774093","https://shensiyao.pythonanywhere.com/codes"],                                                                                                                                                                                    
["D10774116","https://zeqi.pythonanywhere.com/codes"],                                                                                                                                                                                         
["D10774118","https://d10774118.pythonanywhere.com/codes"],                                                                                                                                                                                    
["D10774123","https://wlh5211314.pythonanywhere.com/codes"],                   
["D10774126","https://wangking.pythonanywhere.com/codes"],                                                                                                                                                                                     
["D10774127","https://pepsi66.pythonanywhere.com/codes"],                                                                                                                                                                                      
["D10774133","https://d10774133.pythonanywhere.com/codes"],                                                                                                                                                                                    
["D10774138","https://24406040234.pythonanywhere.com/codes"],                                                                                                                                                                                  
["D10774147","https://wzh.pythonanywhere.com/codes"],                                                                                                                                                                                          
["D10774163","https://d10774163.pythonanywhere.com/codes"],                                                                                                                                                                                    
["D10774166","https://niamu1.pythonanywhere.com/codes"],                                                                                                                                                                                       
["D10774172","https://wushuang123.pythonanywhere.com/codes"],                                                                                                                                                                                  
["D10774173","https://24406040236.pythonanywhere.com/codes"],                                                                                                                                                                                  
["D10774175","https://xiaobo.pythonanywhere.com/codes"],                                                                                                                                                                                       
["D10774178","https://wuzejia.pythonanywhere.com/codes"],                                                                                                                                                                                      
["D10774181","https://killwzr.pythonanywhere.com/codes"],                                                                                                                                                                                      
["D10774184","https://xzm2006.pythonanywhere.com/codes"],                                                                                                                                                                                      
["D10774187","https://xyz24406040126.pythonanywhere.com/codes"],                                                                                                                                                                               
["D10774188","https://xkxlll.pythonanywhere.com/codes?"]                                                                                                                                                                                      
["D10774190","https://xto.pythonanywhere.com/codes"],                                                                                                                                                                                          
["D10774191","https://xzkkkkk.pythonanywhere.com/codes"],                                                                                                                                                                                      
["D10774198","https://devilion0656.pythonanywhere.com/codes"],                                                                                                                                                                                 
["D10774202","https://Deity.pythonanywhere.com/codes"],                                                                                                                                                                                        
["D10774204","https://dove24406040226.pythonanywhere.com/codes"],                                                                                                                                                                              
["D10774211","https://zishanye.pythonanywhere.com/codes.txt"]                                                                                                                                                                                 
["D10774224","https://2uooooo.pythonanywhere.com/codes"],                                                                                                                                                                                      
["D10774225","https://davidzhan.pythonanywhere.com/codes"],                                                                                                                                                                                    
["D10774226","https://Rogry.pythonanywhere.com/codes"],                                                                                                                                                                                        
["D10774230","https://zeqi.pythonanywhere.com/codes"],                                                                                                                                                                                         
["D10774239","http://Zzzhxx.pythonanywhere.com/codes"],                                                                                                                                                                                        
["D10774248","https://zhou123.pythonanywhere.com/codes"],                                                                                                                                                                                      
["D10774249","https://zhouyufan.pythonanywhere.com/codes"],                                                                                                                                                                                    
["D10775763","https://Tuizi233.pythonanywhere.com/codes"],                                                                                                                                                                                     
["D10775764","https://xiaoliuzi.pythonanywhere.com/codes"],                                                                                                                                                                                    
["D10775765","https://youraccount.pythonanywhere.com/codes"],                                                                                                                                                                                  
["D10775766","http://ihatepython.pythonanywhere.com/codes"],                                                                                                                                                                                   
["D10775767","https://scktdgkd.pythonanywhere.com/codes"]];


//for (let dd of d) testall(dd[0],dd[1]);
testall('https://zhongyanlin.pythonanywhere.com/codes','D10059906');






