# yfin-chart-downloader

Downloads Yahoo Finance data to a CSV.

```
Usage: yfin-chart-downloader [options] <symbols...>

Options:
  -i, --interval <timespan>   (choices: "1m", "2m", "5m", "15m", "30m", "60m", "90m", "1h", "1d", "5d", "1wk", "1mo", "3mo", default: "1d")
  -r, --range <timespan>      (choices: "1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max", default: "1mo")
  -o, --output <file>
  -h, --help                 display help for command
```

## Usage

```sh
podman run --rm -it -v ./output:/output ghcr.io/fxyoge/yfin-chart-downloader:latest SPY --output /output/SPY.csv
```
