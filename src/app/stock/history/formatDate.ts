export default function formatDate(dateString: string) {
  var parts = dateString.split(".");
  var day = parts[0];
  var month = parts[1];
  var year = parts[2];
  var formattedDate = year + "." + month + "." + day;
  return formattedDate;
}
