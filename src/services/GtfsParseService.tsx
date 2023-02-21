export default class GtfsParseService {
  static fromGTFS(
    data: string,
    recordTransformation?: (record: { [key: string]: string }) => {
      [key: string]: string;
    }
  ): { [key: string]: string }[] {
    const rows: string[] = data.split("\n");
    let records: { [key: string]: string }[] = [];
    let header: string[] = [];
    rows.forEach((row: string) => {
      if (row) {
        const cells = this.csvToArray(row);
        // header
        if (header.length === 0) {
          cells.forEach((cell: string, cellIndex: number) => {
            header[cellIndex] = cell;
          });
        }
        // data
        else {
          let recordGTFS: { [key: string]: string } = {};
          cells.forEach((cell: string, cellIndex: number) => {
            if (cell !== "") {
              const fieldName = header[cellIndex];
              recordGTFS[fieldName] = cell;
            }
          });

          if (recordTransformation) {
            records.push(recordTransformation(recordGTFS));
          } else {
            records.push(recordGTFS);
          }
        }
      }
    });
    return records;
  }

  // Return array of string values
  // Source: https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
  static csvToArray(text: string) {
    var re_value =
      /(?!\s*$)\s*(?:"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,\s\\]*(?:\s+[^,\s\\]+)*))\s*(?:,|$)/g;
    var a = []; // Initialize array to receive values.
    text.replace(
      re_value, // "Walk" the string using replace with callback.
      function (m0, m1, m2, m3) {
        // Remove backslash from \' in single quoted values.
        if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
        // Remove backslash from \" in double quoted values.
        else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
        else if (m3 !== undefined) a.push(m3);
        return ""; // Return empty string.
      }
    );
    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) a.push("");
    return a;
  }
}
