import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const xHookSecret = request.headers.get("x-hook-secret");

  // Confirmação do Handshake
  if (xHookSecret) {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "X-Hook-Secret": xHookSecret,
      },
    });
  }

  try {
    const eventData = await request.json();
    await axios.post(
      "https://localhost:5678/webhook-test/asana-teste",
      { data: eventData },
      {
        httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
      }
    );
    console.log("webhook deu certo: ");
    console.log("Evento recebido:", eventData);

    // Adicione aqui o processamento do evento, como salvar no banco de dados
    return NextResponse.json(
      { message: "Evento processado com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao processar evento:", error);
    return NextResponse.json(
      { message: "Erro ao processar evento." },
      { status: 500 }
    );
  }
}

const fetchInstagramData = async () => {
  try {
    const url = "https://www.pathsocial.com/wp-admin/admin-ajax.php";

    const headers = {
      accept: "*/*",
      "accept-language":
        "pt-BR,pt;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      cookie:
        "path_referrer=; cjConsent=MHxOfDB8Tnww; cjLiveRampLastCall=2024-12-16T19:59:59.936Z; _omappvp=PmOaBDUYntdx8XQ7ida5PEyOJQzc7rUYfVCELvDUFhp0REdBfY0p7FU4k0nHfNLgaoD3QGfOyFi6lDki1EzFfaXPCbl0fJma; cjUser=069bd7a3-ab7d-4ae5-999d-bedd5a50fd96; _gid=GA1.2.323626504.1734379201; _gcl_au=1.1.1233610586.1734379201; _tt_enable_cookie=1; _ttp=z_muWFtMxCxfJoffiJufIAoFamb.tt.1; _cioanonid=895d8718-6584-09a9-16ae-0c63b50bce0d; omSeen-jufwirv9hjjfyc6r3nfs=1734379795743; om-jufwirv9hjjfyc6r3nfs=1734379825556; _ga_089RDS0PY8=GS1.1.1734379789.1.1.1734379850.60.0.0; _ga=GA1.2.1383945869.1734379201; _gat_gtag_UA_177322647_1=1; nitroCachedPage=1; vehe7m.grsf.uuid=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiYjVmNTMwMjgtOTg2MC00N2U0LTg5NGMtYTBlYjNiNzM1ZWNjIiwiaWF0IjoxNzM0Mzc5ODUzLCJleHAiOjE3Mzc5Nzk4NTN9.vHv6ldJh5DwulSZPF7tkYU3pf4mRETW5hSJKN8HnIog; _omappvs=1734379858184; _uetsid=55f6b4c0bbe811ef9797d31f8f0e7c83; _uetvid=f4cc7470930811efaa95874f6d3b4196; ph_phc_F5YZwpKoeNcWmiYA3jt9erfVBuOjXMZ0Bkbsnyo74nG_posthog=%7B%22distinct_id%22%3A%220192c531-962c-7c3e-9dac-e9d60aa13a0b%22%2C%22%24sesid%22%3A%5B1734379864159%2C%220193d10e-5d73-7f25-b72d-64c70ea55e33%22%2C1734379199859%5D%2C%22%24initial_person_info%22%3A%7B%22r%22%3A%22https%3A%2F%2Fwww.google.com%2F%22%2C%22u%22%3A%22https%3A%2F%2Fwww.pathsocial.com%2Fpt%2Ffree-instagram-tools%2Finstagram-profile-analyzer%2F%22%7D%7D",
      newrelic:
        "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjM3NTYyMTQiLCJhcCI6IjE1ODg5MjQ2OTciLCJpZCI6IjE2NWEwNjZhOWM5MmNkYTIiLCJ0ciI6IjgwNjdkYTZkZmJlNWFhODcyZjhjNjI2YTc5NjliOTczIiwidGkiOjE3MzQzNzk4NjQxNjR9fQ==",
      origin: "https://www.pathsocial.com",
      priority: "u=1, i",
      referer:
        "https://www.pathsocial.com/pt/free-instagram-tools/instagram-profile-analyzer/",
      "sec-ch-ua":
        '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      traceparent: "00-8067da6dfbe5aa872f8c626a7969b973-165a066a9c92cda2-01",
      tracestate:
        "3756214@nr=0-1-3756214-1588924697-165a066a9c92cda2----1734379864164",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      "x-newrelic-id": "VwECV1RSDBABUVJaBAcEVlYD",
      "x-requested-with": "XMLHttpRequest",
    };

    const data = new URLSearchParams({
      action: "get_instagram_data_for_analyzer",
      account_handle: "richelebr",
      source:
        "Instagram Profile Analyzer | Ferramentas gratuitas | Path Social",
    });

    const response = await axios.post(url, data.toString(), { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching Instagram data:", error);
  }
};

export async function GET() {
  try {
    const response = await fetchInstagramData();
    console.log("response: ", response);

    return NextResponse.json({ message: response }, { status: 405 });
  } catch (error) {
    console.log("error: ", error);
  }
}
