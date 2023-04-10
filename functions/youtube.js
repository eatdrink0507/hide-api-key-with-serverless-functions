const fetch = require("node-fetch");
const querystring = require("querystring");
const stringify = require("../utils/stringify.js");

const GOOGLEAPIS_ORIGIN = "https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService";
const headers = {
  "Access-Control-Allow-Origin": process.env.HOST,
  "Content-Type": "application/json; charset=utf-8",
};

exports.handler = async (event) => {
  const {
    path,
    queryStringParameters,
    headers: { referer },
  } = event;

  const url = new URL(path, GOOGLEAPIS_ORIGIN);
  const parameters = querystring.stringify({
    ...queryStringParameters,
    key: process.env.GOV_KEY,
  });

  url.search = parameters;

  try {
    const response = await fetch(url, { headers: { referer } });
    const body = await response.json();

    if (body.error) {
      return {
        statusCode: body.error.code,
        ok: false,
        headers,
        body: stringify(body),
      };
    }

    return {
      statusCode: 200,
      ok: true,
      headers,
      body: stringify(body),
    };
  } catch (error) {
    return {
      statusCode: 400,
      ok: false,
      headers,
      body: stringify(error),
    };
  }
};
