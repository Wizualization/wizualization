export interface Transform {
    // REQUIRES ONE OF THESE (also "as" is recommended for calculate and aggregate)
    calculate?: unknown;
    filter?: unknown;
    aggregate?: unknown;
    bin?: unknown;
    as?: string; //new var name to display; strongly recommended for aggregate and calculate.
}