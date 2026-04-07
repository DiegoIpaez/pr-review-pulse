declare global {
  interface BigInt {
    toJSON(): string;
  }
}

export async function register() {
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };
}
