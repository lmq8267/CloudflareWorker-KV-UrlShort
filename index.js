// 管理员页面路径 （默认为 / 如果隐藏首页可设置为其他路径，例如：/admin ）
const ADMIN_PATH = "/";
// API 路径
const API_PATH = "/api";
// 长链接键名
const URL_KEY = "longUrl";
// 短链接键名
const URL_NAME = "shortCode";
// 短链接键名（用于 API 返回）
const SHORT_URL_KEY = "shorturl";
// 静态首页源码链接 （设置首页替换页面，不需要也可以直接注释掉）
// const STATICHTML = "https://raw.githubusercontent.com/Aiayw/CloudflareWorkerKV-UrlShort/main/404.html";


const index = `<!doctype html>
<html lang="zh-CN">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.2.3/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.2.3/js/bootstrap.min.js"></script>
    <script async src="https://umami.aiayw.com/script.js" data-website-id="1b4b644e-8552-452e-8c58-f6efb03ba42b"></script>
    <link rel="icon"
        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔗</text></svg>">
    <title>简短分享 - 长网址缩短，文本分享，Html单页分享</title>
</head>

<style>
    .bd-placeholder-img {
        font-size: 1.125rem;
        text-anchor: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
    }

    .btn-secondary,
    .btn-secondary:hover,
    .btn-secondary:focus {
        color: #333;
        text-shadow: none;
    }

    body {
        text-shadow: 0 .05rem .1rem rgba(0, 0, 0, .5);
    }

    .cover-container {
        max-width: 42em;
    }

    .navbar-brand svg {
        width: 30px;
        height: 30px;
    }

    @media (max-width: 576px) {
        #input-container .form-control,
        #input-container .input-group-text {
            display: block;
            width: 100%;
            margin-bottom: 1rem;
            border-radius: 5px;
        }
        }

    .footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 60px;
    }

    .footer .container {
        width: 100%;
        height: 100%;
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .black-toast .toast {
        background-color: black;
      }

    .text-muted {
        font-size: 14px;
        color: #555;
        margin-right: 20px;
    }
</style>

<body class="d-flex h-100 text-center text-white bg-dark">

    <div class="position-fixed top-0 end-0 p-3 black-toast" style="z-index: 5;">
        <div id="toast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-body">
                已复制到剪贴板！
            </div>
        </div>
    </div>

    <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <header class="mb-auto">
            <nav class="navbar navbar-expand-md navbar-dark">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">
                        <svg t="1682502812036" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="1958" width="64" height="64">
                            <path
                                d="M429.013333 640A32 32 0 0 1 384 594.986667l37.76-37.76-22.826667-22.613334-135.68 135.68 90.453334 90.453334 135.68-135.68-22.613334-22.613334zM534.613333 398.933333l22.613334 22.613334L594.986667 384A32 32 0 0 1 640 429.013333l-37.76 37.76 22.613333 22.613334 135.68-135.68-90.453333-90.453334z"
                                fill="#666666" p-id="1959"></path>
                            <path
                                d="M512 21.333333a490.666667 490.666667 0 1 0 490.666667 490.666667A490.666667 490.666667 0 0 0 512 21.333333z m316.8 354.986667l-181.12 181.12a32 32 0 0 1-45.226667 0L557.226667 512 512 557.226667l45.226667 45.226666a32 32 0 0 1 0 45.226667l-181.12 181.12a32 32 0 0 1-45.226667 0l-135.68-135.68a32 32 0 0 1 0-45.226667l181.12-181.12a32 32 0 0 1 45.226667 0L466.773333 512 512 466.773333l-45.226667-45.226666a32 32 0 0 1 0-45.226667l181.12-181.12a32 32 0 0 1 45.226667 0l135.68 135.68a32 32 0 0 1 0 45.226667z"
                                fill="#666666" p-id="1960"></path>
                        </svg>
                        简短分享
                    </a>
                </div>
            </nav>
        </header>

        <main class="px-3">
            <p id="result" class="lead" onclick="copyToClipboard()"></p>

            <br>
            <div id="input-container">
            <div id="link_div" class="input-group mb-3">
            <select class="form-control" id="select">
                <option value="link">网址链接</option>
                <option value="text">文本字符</option>
                <option value="html">HTML源代码</option>
            </select>
            <select class="form-control" id="expiration">
                <option value="-1">时效：永久有效</option>
                <option value="burn_after_reading">阅后即焚</option>
                <option value="1">1分钟</option>
                <option value="10">10分钟</option>
                <option value="60">1小时</option>
                <option value="1440">1天</option>
                <option value="10080">7天</option>
                <option value="43200">1个月</option>
            </select>
            <input type="text" id="name" placeholder="自定义网址后缀" class="input-group-text">
            <input type="password" id="password" placeholder="输入后缀密码" class="input-group-text">
        </div>
            </div>
            <div class="text-danger" style="color: red; font-weight: bold;">⚠️请务必牢记后缀密码，忘记将无法修改，只能联系此站长删除！👆</div>
            <div id="text_div">
                <textarea id="link" placeholder="请输入长链接/文本/HTML源代码内容" class="form-control" rows="10"></textarea><br>
            </div>
            <p class="lead">
                <a href="#" onclick="getlink()" class="btn btn-lg btn-secondary fw-bold border-white bg-white">生成/修改</a>
            </p>
        </main>
        <div class="stats">
        总计生成: {{totalRules}} 条 | 今日新增: {{todayNewRules}} 条
    </div>
    
    <footer class="footer">
    <div class="container">
        <a href="https://www.cloudflare.com/" class="text-muted">基于Cloudflare-WorkerKV</a>
        <span class="text-muted">站长邮箱: 修改为你的邮箱地址 </span>
    </div>
</footer>

    <script>
        async function postData(url = '', data = {}) {
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(data)
            });
            return response.json();
        }

        function isValidUrl(string) {
            try {
            new URL(string);
            return true;
            } catch (_) {
            return false;
            }
        }
      
        function copyToClipboard() {
            const textToCopy = document.getElementById('result').innerText;
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const toast = new bootstrap.Toast(document.getElementById('toast'));
                    toast.show();
                }).catch(err => {
                    console.error('无法复制文本: ', err);
                });
            } else {
                alert('没有文本可复制');
            }
        }
        
        function getlink() {
            let link = document.getElementById('link').value.trim();
            const name = document.getElementById('name').value;
            const type = document.getElementById('select').value;
            const password = document.getElementById('password').value;
        
            if (link === '') {
                document.getElementById('result').innerHTML = "请输入长链接/文本/HTML源代码内容";
                return;
            }
        
            if (link.indexOf('http') == -1 && type == "link") {
                link = 'http://' + link;
            }
        
            if (type == "link" && !isValidUrl(link)) {
                document.getElementById('result').innerHTML = "请输入有效的URL格式";
                return;
            }
        
            document.getElementById('result').innerHTML = "生成中..";
            const expirationElement = document.getElementById('expiration');
            const selectedIndex = expirationElement.selectedIndex;
            const expiration = expirationElement.options[selectedIndex].value;
            const burnAfterReading = expiration === 'burn_after_reading';
        
            postData("${API_PATH}", {
                "${URL_KEY}": link,
                "${URL_NAME}": name,
                "type": type,
                "expiration": burnAfterReading ? -1 : expiration,
                "burn_after_reading": burnAfterReading,
                "password": password
            }).then(resp => {
                if (resp.error) {
                    document.getElementById('result').innerHTML = resp.error;
                    document.getElementById('name').value = ''
                } else if (resp.value) {
                    document.getElementById('result').innerHTML = resp.value;
                } else {
                    var url = document.location.protocol + '//' + document.location.host + '/' + resp['${URL_NAME}'];
                    document.getElementById('result').innerHTML = url;
                    document.getElementById('link').value = '';
                    document.getElementById('name').value = '';
                    document.getElementById('select').selectedIndex = 0;
                }
            });
        }
        
    </script>

</body>

</html>`;

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const { protocol, hostname, pathname } = new URL(request.url);

    if (!await shortlink.get('short_rules')) {
        const shortRulesData = {
            total_rules: '0',
            today_new_rules: '0',
        };
        await shortlink.put('short_rules', JSON.stringify(shortRulesData));
    } else {
        const shortRulesData = JSON.parse(await shortlink.get('short_rules'));
        if (!shortRulesData.total_rules) {
            shortRulesData.total_rules = '0';
        }
        if (!shortRulesData.today_new_rules) {
            shortRulesData.today_new_rules = '0';
        }
        if (!shortRulesData.last_rule_update) {
            shortRulesData.today_new_rules = '2024';
        }
        await shortlink.put('short_rules', JSON.stringify(shortRulesData));
    }


    if (pathname == ADMIN_PATH) {
        // 从shortlink获取short_rules数据
        let shortRulesData = await shortlink.get('short_rules') || '{}';
        shortRulesData = JSON.parse(shortRulesData);

        // 设置默认值为0
        const totalRules = shortRulesData.total_rules || 0;
        const todayNewRules = shortRulesData.today_new_rules || 0;

        const indexWithStats = index.replace("{{totalRules}}", totalRules)
                                    .replace("{{todayNewRules}}", todayNewRules);

        return new Response(indexWithStats, {
            headers: { "content-type": "text/html; charset=utf-8" },
        });
    }
    
    
    if (pathname.startsWith(API_PATH)) {
        const body = JSON.parse(await request.text());
        const clientIp = request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for") || "unknown";
        const country = request.headers.get("CF-IPCountry") || "unknown";
        var short_type = "link";
        if (body["type"] != undefined && body["type"] != "") {
            short_type = body["type"];
        }
        if (body[URL_NAME] == undefined || body[URL_NAME] == "" || body[URL_NAME].length < 2) {
            body[URL_NAME] = Math.random().toString(36).slice(-6);
        }
    
        const existingData = await shortlink.get(body[URL_NAME]);
        const isNewRule = !existingData;
    
        if (existingData) {
            const existing = JSON.parse(existingData);
            if (existing.password && existing.password !== body.password) {
                return new Response(
                    JSON.stringify({ error: "密码错误！该后缀已经被使用，请使用正确的密码修改或使用其他后缀。" }),
                    {
                        headers: { "Content-Type": "application/json; charset=utf-8" },
                    }
                );
            }
        }
    
        const expiration = parseInt(body["expiration"]);
        let expiresAt = null;
        if (expiration > 0) {
            expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + expiration);
        }
        // 获取当前时间
        function getChinaTime() {
            const now = new Date();
            const offset = 8 * 60; // 中国时间比UTC+8小时
            const chinaTime = new Date(now.getTime() + (offset * 60 * 1000));
            const year = chinaTime.getFullYear();
            const month = String(chinaTime.getMonth() + 1).padStart(2, '0');
            const day = String(chinaTime.getDate()).padStart(2, '0');
            const hours = String(chinaTime.getHours()).padStart(2, '0');
            const minutes = String(chinaTime.getMinutes()).padStart(2, '0');
            const seconds = String(chinaTime.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }
        await shortlink.put(
            body[URL_NAME],
            JSON.stringify({
                lastUpdate: getChinaTime(), // 增加记录当前时间
                clientIp: clientIp,  // 记录客户端IP地址
                type: short_type,  // 类型
                value: body[URL_KEY], //长链接内容
                password: body.password, //后缀密码
                country: country, // 记录提交的国家
                expiresAt: expiresAt ? expiresAt.toISOString() : null, //规则有效期
                burn_after_reading: body["burn_after_reading"] //阅后即焚
            })
        );
    
        // 仅当新规则时，更新规则数量
    if (isNewRule) {
      let shortRulesData = JSON.parse(await shortlink.get('short_rules'));
      let totalRules = parseInt(shortRulesData.total_rules) || 0;
      let todayNewRules = parseInt(shortRulesData.today_new_rules) || 0;
      let lastRuleUpdate = shortRulesData.last_rule_update;
      const today = new Date().toISOString().split('T')[0];

      if (lastRuleUpdate !== today) {
        todayNewRules = 0;
      }

      totalRules += 1;
      todayNewRules += 1;

      shortRulesData.total_rules = totalRules.toString();
      shortRulesData.today_new_rules = todayNewRules.toString();
      shortRulesData.last_rule_update = today;

      await shortlink.put('short_rules', JSON.stringify(shortRulesData));
    }
    
        const responseBody = {
            type: body.type,
            shorturl: `${protocol}//${hostname}/${body[URL_NAME]}`,
            shortCode: body[URL_NAME],
        };
    
        return new Response(JSON.stringify(responseBody), {
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Access-Control-Allow-Origin": "*",
            },
        });
    }
  
    const key = decodeURIComponent(pathname.replace("/", ""));
    if (key !== "" && !(await shortlink.get(key))) {
      return Response.redirect(`${protocol}//${hostname}${ADMIN_PATH}`, 302);
    }
    if (key == "") {
      const html = await fetch(STATICHTML);
      return new Response(await html.text(), {
        headers: {
          "content-type": "text/html;charset=UTF-8",
        },
      });
    }
    let link = await shortlink.get(key);
    if (link != null) {
      link = JSON.parse(link);
      const expiresAt = link["expiresAt"] ? new Date(link["expiresAt"]) : null;
      const now = new Date();
      if (expiresAt && now >= expiresAt) {
        return new Response(`链接已过期`, {
          headers: { "content-type": "text/plain; charset=utf-8" },
        });
      }
      if (link["burn_after_reading"]) {
        await shortlink.delete(key);
      }
  
      if (link["type"] == "link") {
        return Response.redirect(link["value"], 302);
      }
      if (link["type"] == "html") {
        return new Response(link["value"], {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      } else {
        return new Response(`${link["value"]}`, {
          headers: { "content-type": "text/plain; charset=utf-8" },
        });
      }
    }
    return new Response(`403`, {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
