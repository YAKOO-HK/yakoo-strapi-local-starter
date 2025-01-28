export default () => ({
  formatData(data: Record<string, unknown>): string {
    let message = '';
    //Loop through data and construct message from data object
    for (const key in data) {
      if (typeof data[key] === 'object') {
        message += `${key}: ${JSON.stringify(data[key], null, 2)}\n`;
      } else {
        message += `${key}: ${data[key]}\n`;
      }
    }
    return message;
  },
  formatDataAsHtml(data: Record<string, unknown>): string {
    let message = '<p>';
    //Loop through data and construct message from data object
    for (const key in data) {
      if (typeof data[key] === 'object') {
        message += `<b>${key}:</b> ${JSON.stringify(data[key], null, 2)}<br>`;
      } else {
        message += `<b>${key}:</b> ${data[key]}<br>`;
      }
    }
    message += '</p>';
    return message;
  },
});
