/* Pure demo-only calculations and workflow checks. No persistence or backend. */
(function (root) {
  "use strict";
  function amount(value) {
    const n = Number(value);
    if (!Number.isSafeInteger(n) || n < 0) throw new Error("Enter a nonnegative whole RWF amount.");
    return n;
  }
  function calculate(values) {
    const opening = amount(values.opening);
    const cash = amount(values.cash);
    const momo = amount(values.momo);
    const card = amount(values.card);
    const expenses = amount(values.expenses);
    const withdrawn = amount(values.withdrawn);
    const counted = amount(values.counted);
    const sales = cash + momo + card;
    const expected = opening + cash - expenses - withdrawn;
    if (![sales,expected, counted - expected].every(Number.isSafeInteger)) throw new Error("The amount is too large.");
    return { sales, expected, difference: counted - expected };
  }
  function canTransition(role, status, action) {
    if (action === "approve" || action === "return") return role === "manager" && status === "Pending";
    if (action === "submit") return role === "employee" && (status === "Draft" || status === "Returned");
    return false;
  }
  function transition(report, role, action, note) {
    if (!canTransition(role, report.status, action)) throw new Error("This demo role cannot perform that action.");
    if (action === "return" && !String(note || "").trim()) throw new Error("Please enter a return reason.");
    return Object.assign({}, report, {
      status: action === "approve" ? "Approved" : action === "return" ? "Returned" : "Pending",
      returnReason: action === "return" ? String(note).trim() : ""
    });
  }
  const api = { amount, calculate, canTransition, transition };
  root.StationDemoCore = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window === "undefined" ? globalThis : window);
