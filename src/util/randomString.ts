export class RandomString {
  private _printable : string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  private idgen() : string {
    let text = "";
    for (let i = 0; i < 22; i++) {
      text += this
        ._printable
        .charAt(Math.floor(Math.random() * this._printable.length));
    }
    return text;
  }
}
