export class ProbeError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "ProbeError";
    this.code = code;
  }
}