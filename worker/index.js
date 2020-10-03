const COOKIE_NAME = "name";
const COOKIE_QUOTE = "quote";
const PUBLIC_URL = "https://sweeps.bilsay.workers.dev";

/**
 * Gets the cookie with the name from the request headers
 * @param {Request} request incoming Request
 * @param {string} name of the cookie to get
 */
function getCookieValue(request, name) {
  let result = ""
  const cookieString = request.headers.get("Cookie")
  if (cookieString) {
    const cookies = cookieString.split(";")
    cookies.forEach(cookie => {
      const cookieName = cookie.split("=")[0].trim()
      if (cookieName === name) {
        const cookieVal = cookie.split("=")[1]
        result = cookieVal
      }
    })
  }
  return result
}

function getIpFromRequest(request) {
  return request.headers.get("CF-Connecting-IP")
}

function getMaxExpiresGMT () {
  return new Date('2038-01-19 04:14:07').toUTCString();
}

async function getNameAndQuoteInfoFromRequest (request) {
  const contentType = request.headers.get("Content-Type") || "";

  if (contentType.includes("application/json")) {
    const nameAndQuote = await request.json()
    return nameAndQuote && nameAndQuote.name && nameAndQuote.quote ? nameAndQuote : null;
  }
}

function getCookieFromKeyValue (key, value) {
  const expires = getMaxExpiresGMT();
  return `${key}=${value}; expires=${expires}; path='/';`;
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
});

const postNameAndQuoteJs = `
  (function() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        try {
          // Print ip
          const responseJSON = JSON.parse(xhr.response);
          console.log(responseJSON.ip);
        } catch (e) {
          console.log(e);
        }
      }
    }
    xhr.open("POST", "${PUBLIC_URL}", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Credentials', 'true')
    xhr.setRequestHeader('Access-Control-Allow-Headers', 'access-control-allow-credentials, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, access-control-allow-methods');
    xhr.setRequestHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.send(JSON.stringify({ name, quote }));
  })();
`;

// Accepting all request helped me to get over cors issues
function getResponse (response, options) {
  const headers = Object.assign({}, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": 'true',
    "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
    "Access-Control-Allow-Headers": "Set-Cookie, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin, access-control-allow-credentials, access-control-allow-methods",
    "Content-Type": "application/javascript; charset=UTF-8",
  }, (options || {}).headers)

  return new Response(response, {
    headers: headers
  });
}
/**
 * Sweeps assignment 1
 * @param {Request} request
 */
async function handleRequest(request) {
  const cookieNameValue = getCookieValue(request, COOKIE_NAME)
  const cookieQuoteValue = getCookieValue(request, COOKIE_QUOTE);

  if (cookieNameValue && cookieQuoteValue) {

    const localCookieName = getCookieFromKeyValue('local_' + COOKIE_NAME, cookieNameValue);
    const localCookieQuote = getCookieFromKeyValue('local_' + COOKIE_QUOTE, cookieQuoteValue);
    
    const setLocalCookiesNameAndQuoteJs = `
      (function() {
        // Print cookies
        console.log("${localCookieName}");
        console.log("${localCookieQuote}");

        // Set cookies
        document.cookie = "${cookieName}";
        document.cookie = "${cookieQuote}";
      })();
    `;

    return getResponse(setLocalCookiesNameAndQuoteJs);
  } else {
    const nameAndQuote = await getNameAndQuoteInfoFromRequest(request);

    if (nameAndQuote) {

      // Get request ip to log on browser
      const ip = getIpFromRequest(request);

      const response =  getResponse(JSON.stringify({ ip: ip }), {
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        }
      });

      // Set worker cookies
      const cookieName = getCookieFromKeyValue(COOKIE_NAME, cookieNameValue);
      const cookieQuote = getCookieFromKeyValue(COOKIE_QUOTE, cookieQuoteValue);

      response.headers.append('Set-Cookie', cookieName);
      response.headers.append('Set-Cookie', cookieQuote);

      return response;
    } else {
      // Get name and quote from page
      return getResponse(postNameAndQuoteJs);
    }
  }
}
