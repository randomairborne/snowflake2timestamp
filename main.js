const input = document.getElementById("input");
const output = document.getElementById("output");

function clearOutput() {
  while (output.firstChild) {
    output.removeChild(output.lastChild);
  }
}

function calculateUnixTimestamp(input) {
  return new Date(Number((input >> 22n) + 1420070400000n));
}

function calculateAllTimestamps(data) {
  const itemArray = data.split(/\r?\n/);
  const sorted = itemArray.sort((a, b) => {
    const aflake = BigInt(a.trim()) >> 22n;
    const bflake = BigInt(b.trim()) >> 22n;
    return Number(aflake - bflake);
  });
  clearOutput();
  let previous = null;
  for (const rawText of sorted) {
    const text = rawText.trim();
    if (text.length === 0) {
      continue;
    }
    const snowflake = BigInt(text);
    const date = calculateUnixTimestamp(snowflake);

    const table = document.createElement("tr");
    const snowflakeEl = document.createElement("td");
    const dateEl = document.createElement("td");
    const timeEl = document.createElement("td");
    const deltaEl = document.createElement("td");

    const year = date.getUTCFullYear().toString().padStart(4, "0");
    const month = date.getUTCMonth().toString().padStart(2, "0");
    const day = date.getUTCDate().toString().padStart(2, "0");

    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const secs = date.getUTCSeconds().toString().padStart(2, "0");

    snowflakeEl.innerText = snowflake.toString();
    dateEl.innerText = `${day}/${month}/${year}`;
    timeEl.innerText = `${hours}:${minutes}:${secs}`;
    if (previous === null) {
      deltaEl.innerText = "n/a";
    } else {
      const differenceMs = date - previous;
      const totalDifferenceSecs = Math.abs(differenceMs / 1000);
      const secs = totalDifferenceSecs % 60;
      const minutes = Math.floor(totalDifferenceSecs / 60) % 60;
      const hours = Math.floor(totalDifferenceSecs / 3600) % 24;
      const days = Math.floor(totalDifferenceSecs / 86400);

      let delta = "";
      let started = false;
      if (days > 0) {
        delta += `${days.toFixed()}d `;
        started = true;
      }
      if (hours > 0 || started) {
        delta += `${hours.toFixed()}h `;
        started = true;
      }
      if (minutes > 0 || started) {
        delta += `${minutes.toFixed()}m `;
        started = true;
      }
      if (secs > 0 || started || (secs === 0 && !started)) {
        delta += `${secs.toFixed()}s `;
      }
      deltaEl.innerText = delta.trim();
    }

    table.appendChild(snowflakeEl);
    table.appendChild(dateEl);
    table.appendChild(timeEl);
    table.appendChild(deltaEl);
    output.appendChild(table);
    previous = date;
  }
}

function onInputEdit() {
  calculateAllTimestamps(input.value);
}

input.addEventListener("input", onInputEdit);
calculateAllTimestamps(input.value);
