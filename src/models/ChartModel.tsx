export interface ChartItem {
    actual: number;
    efficiency: number;
    maximum: number;
    minimum: number;
    plan: number;
    timestamp: number;
}

export interface SelectOption {
    value: string,
    label: string
}

export interface SeriesEntry {
    entry: [number, number]
}