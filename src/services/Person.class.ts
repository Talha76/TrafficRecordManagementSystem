/**
 * @abstract
 * @classdesc Abstract class for Person
 * @param {string} name - Name of the person
 * @param {string} mail - Mail of the person
 * @param {string} password - Password of the person
 * @since 1.0.0
 * @version 1.0.0
 * @exports Person
 */
abstract class Person {
  protected _name: string;
  protected _mail: string;
  protected _password: string;

  protected constructor({name = null, mail = null, password = null}) {
    this._name = name;
    this._mail = mail;
    this._password = password;
  }

  get name(): string {
    return this._name;
  }

  get mail(): string {
    return this._mail;
  }

  get password(): string {
    return this._password;
  }

  abstract changePassword(password: string);
}

export default Person;
