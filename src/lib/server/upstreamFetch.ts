import * as dns from "node:dns";
import http from "node:http";
import https from "node:https";

type FetchJsonOptions = {
  timeoutMs?: number;
  headers?: Record<string, string>;
};

type FetchJsonResponse<T> = {
  ok: boolean;
  status: number;
  data?: T;
  rawText?: string;
};

const getDnsServers = (): string[] => {
  const configured = process.env.UPSTREAM_DNS_SERVERS
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return configured?.length ? configured : ["8.8.8.8", "1.1.1.1"];
};

type LookupFn = Parameters<typeof https.request>[1] extends { lookup?: infer L }
  ? NonNullable<L>
  : any;

const createLookup = (): LookupFn => {
  const resolver = new dns.Resolver();
  resolver.setServers(getDnsServers());

  return (hostname: any, options: any, callback: any) => {
    try {
      resolver.resolve4(hostname, (error, addresses) => {
        if (error || !addresses?.length) {
          dns.lookup(hostname, options, callback);
          return;
        }
        const wantsAll =
          typeof options === "object" && options !== null && options.all === true;

        if (wantsAll) {
          callback(null, [{ address: addresses[0], family: 4 }]);
          return;
        }

        callback(null, addresses[0], 4);
      });
    } catch {
      dns.lookup(hostname, options, callback);
    }
  };
};

const lookup = createLookup();

export const fetchJson = async <T>(
  url: string,
  options: FetchJsonOptions = {}
): Promise<FetchJsonResponse<T>> => {
  const timeoutMs = options.timeoutMs ?? 15_000;
  const parsedUrl = new URL(url);
  const transport = parsedUrl.protocol === "http:" ? http : https;

  return await new Promise((resolve, reject) => {
    const request = transport.request(
      parsedUrl,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          ...options.headers,
        },
        lookup,
      },
      (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        response.on("end", () => {
          const rawText = Buffer.concat(chunks).toString("utf8");
          const status = response.statusCode ?? 500;
          const ok = status >= 200 && status < 300;

          if (!rawText) return resolve({ ok, status });

          try {
            const data = JSON.parse(rawText) as T;
            resolve({ ok, status, data, rawText });
          } catch {
            resolve({ ok, status, rawText });
          }
        });
      }
    );

    request.on("error", reject);
    request.setTimeout(timeoutMs, () => {
      request.destroy(new Error(`Upstream request timeout after ${timeoutMs}ms`));
    });
    request.end();
  });
};
