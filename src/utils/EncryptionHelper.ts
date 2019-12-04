import crypto from 'crypto';

import { serverConfig } from '../constants/env';

export class EncryptionHelper {
  private _algorithm: string;
  private _key: string;

  constructor() {
    this._algorithm = "aes256";
    this._key = `${serverConfig.jwtSecret}`;
  }

  public encrypt(rawString: string) {
    const cipher = crypto.createCipher(this._algorithm, this._key);
    return cipher.update(rawString, "utf8", "hex") + cipher.final("hex");
  }

  public decrypt(encryptedString: string) {
    const decipher = crypto.createDecipher(this._algorithm, this._key);
    return (
      decipher.update(encryptedString, "hex", "utf8") + decipher.final("utf8")
    );
  }
}
