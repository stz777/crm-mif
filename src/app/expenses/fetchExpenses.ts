export default async function fetchExpenses(searchParams: any) {
  return fetch("/api/expenses/get", {
    method: "post",
    body: JSON.stringify(searchParams),
  })
    .then((x) => x.json())
    .then((x) => x);
}