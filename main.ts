import fs from "fs/promises";
import finnum from "financial-number";
import { Argument, Option, program } from "commander";
import { setTimeout } from "timers/promises";

type Response = {
  chart: {
    result?: {
      meta: {
        symbol: string;
        priceHint: number;
      };
      timestamp: number[];
      indicators: {
        quote: {
          close: number[];
        }[];
      };
    }[];
    error?: {
      code: string;
      description: string;
    };
  };
};

program
  .name("yfin-chart-downloader")
  .addOption(new Option("-i, --interval <timespan>").choices(["1m", "2m", "5m", "15m", "30m", "60m", "90m", "1h", "1d", "5d", "1wk", "1mo", "3mo"]).default("1d"))
  .addOption(new Option("-r, --range <timespan>").choices(["1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"]).default("1mo"))
  .addOption(new Option("-o, --output <file>"))
  .addArgument(new Argument("<symbols...>"))
  .parse();

const options = program.opts();
const interval: string = options.interval;
const range: string = options.range;
const output: string = options.output;
const symbols: string[] = program.args;

const lines: {
  symbol: string;
  date: string;
  close: string;
}[] = [{ symbol: "Symbol", date: "Date", close: "Close" }];

for (const symbol of symbols) {
  console.log(`Retrieving symbol ${symbol}`);

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;
  const response: Response = await (await fetch(url)).json();

  if (response.chart.error) {
    throw new Error(`Error retrieving symbol ${symbol}: ${response.chart.error.code}: ${response.chart.error.description}`);
  }

  const precision = response.chart.result?.[0]?.meta?.priceHint;
  const timestamps = response.chart.result?.[0]?.timestamp ?? [];
  const closePxs = response.chart.result?.[0]?.indicators.quote[0]?.close ?? [];

  for (let i = 0; i < Math.min(timestamps.length, closePxs.length); i++) {
    const date = new Date(timestamps[i] * 1000).toISOString().split("T")[0];
    if (closePxs[i] == null) {
      continue;
    }

    let close = finnum(`${closePxs[i]}`);
    if (precision != null) {
      close = close.changePrecision(precision, finnum.round);
    }
    lines.push({ symbol, date, close: close.toString() });
  }
  await setTimeout(500);
}

const csv = lines
  .map(x => `"${x.symbol}","${x.date}","${x.close}"`)
  .join("\n");

await fs.writeFile(output, csv);
